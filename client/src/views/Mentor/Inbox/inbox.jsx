import React, { useEffect, useState } from 'react';
import { getMentor, getLessonModuleActivities, getClassrooms, getUnits } from '../../../Utils/requests';
import { Modal, Button, message, Popconfirm, Tabs, Tag } from 'antd';
import '../Dashboard/Dashboard.less'
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import './Inbox.less';

const { TabPane } = Tabs;
const classroomMap = new Map();

export default function Inbox() {
    const [printed, setprinted] = useState(false);
    const [visible, setVisible] = useState(false);
    const[activePanel, setActivePanel] = useState("panel-1");
    const [visible2, setVisible2] = useState(false);
    const [activities, setActivites] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedClassroom, setSelectedClassroom] = useState(0);

    const SCIENCE = 1;
    const MAKING = 2;
    const COMPUTATION = 3;

    const color = [
        'magenta',
        'purple',
        'green',
        'cyan',
        'red',
        'geekblue',
        'volcano',
        'blue',
        'orange',
        'gold',
        'lime',
      ];
      useEffect(() => {
        let classroomIds = [];
        getMentor().then((res) => {
          if (res.data) {
            res.data.classrooms.forEach((classroom) => {
              classroomIds.push(classroom.id);
            });
            getClassrooms(classroomIds).then((classrooms) => {
              classrooms.forEach((classroom) => {
                classroomMap.set(classroom.id, classroom);
              });
              setClassOptions(classroomMap)
            });
          } else {
            message.error(res.err);
            navigate('/teacherlogin');
          }
        });
      }, []);
    
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate('/dashboard');
      };

      useEffect(() => {
        const dataBox = document.getElementById('inboxData');
        getMentor().then((res) => {
          if (res.data && !printed) {
            res.data.inbox.forEach((lesson) => {
                const box = document.createElement('div');
                box.className = 'item';
                box.onclick = () => expand(lesson);
                const text1 = document.createElement('h2');
                text1.innerText = `${lesson.name}`;
                const text2 = document.createElement('p');
                text2.innerHTML = `<strong>Expectations:</strong> ${lesson.expectations}`;
                box.append(text1);
                box.append(text2);
                dataBox.append(box);
            });
            setprinted(true);
          } 
          else if(!printed){
            message.error(res.err);
            navigate('/teacherlogin');
          }
        });
      }, []);

// display possible Units to save to
      useEffect(() =>{
        if(selectedClassroom > 0){
            console.log(selectedClassroom)
            useEffect(() => {
                  const fetchUnits = async () => {
                    try {
                      const res = await getUnits(selectedClassroom);
                      if (res.data) {
                        for(const x in res.data){
                            var unit = res.data[x];
                            console.log(unit);
                            unitLayout.set(unit.name, unit);
                            setUnit(unit)
                            let optionElement = document.createElement('option');
                            optionElement.value = unit.name;
                            optionElement.text = unit.name;
                            selector[0].appendChild(optionElement);
                        }
                      } else {
                        message.error(res.err);
                      }
                    } catch (error) {
                      console.error("Error fetching units:", error);
                    }
                  };
                  fetchUnits();
              });
        }

      }, selectedClassroom)

    const setClassOptions = async() =>{
        const selector = document.getElementById('classOptions');
        let isFirstIteration = true; // Variable to track the first iteration
        selector.innerHTML='';

        classroomMap.forEach((value, key) =>{
            console.log(value)
            let optionElement = document.createElement('option');
            optionElement.value = key;
            optionElement.text = value.name;
            selector.appendChild(optionElement);
            // Check if it's the first iteration
            if (isFirstIteration) {
                setSelectedClassroom(value.id);
                isFirstIteration = false;
            }
            else{

            }
        })
    }

    const expand = async (lesson) =>{
        setVisible(true);
        setSelectedLesson(lesson.name)

        const res = await getLessonModuleActivities(lesson.id)
        if(res.data){
            setActivites(res.data);
        }
        else{
            message.error("unable to retrieve Lesson Module")
        }
    }
    const handleCancel = () => {
        setVisible(false);
        setVisible2(false);
        setActivites([]);
        setActivePanel('panel-1');
      };
    const handleSave = () => {
        setVisible(false);
        setVisible2(true);
      };
    function saveTo(){
        setActivePanel('panel-2');
        // get classrooms and Units
    }
    function back(){
        setActivePanel('panel-1');
    }
    function discard(){
        // remove from inbox
        handleCancel();
    }

    const chooseClassroom  = (e) =>{
        e.preventDefault();
        const chosen = parseInt(e.target.value)
        console.log(chosen)
        setSelectedClassroom(chosen)
    }
    

  return (
    <div className='container nav-padding'>
        <NavBar isMentor={true}/>
        <div>
            <button id='home-back-btn1' onClick={handleBack}>
                <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <h1 className='title'>Recently Shared with You</h1>
            <div id='inboxData'>

            </div>
            <Modal
                title= {activePanel === 'panel-1'
                ? `Viewing: ${selectedLesson}`
                : `Saving: ${selectedLesson}`}
                visible={visible}
                onCancel={handleCancel}
                width='60vw'
                footer={[          
                <Button
                    key='ok'
                    type='secondary'
                    disabled={false}
                    onClick={activePanel === 'panel-1' ? discard : back}
                >
                {activePanel === 'panel-1'
                    ? 'Discard'
                    : 'Back'}
                </Button>,
                <Button
                     key='ok'
                      type='primary'
                      onClick={activePanel === 'panel-1' ? saveTo : handleSave}
                    >
                  {activePanel === 'panel-1'
                    ? 'Save to'
                    : 'Save'}
                </Button>,
                ]}
            >
            <div
                 className={activePanel !== 'panel-1' ? 'panel-1 show' : 'panel-1 hide'}
                >
                <div className='saving-box'>
                    <div id='input'>
                        <h3>Classroom:</h3>
                        <select name="" id="classOptions" onChange={chooseClassroom}>
                        </select>
                    </div>
                    <div id='input'>
                        <h3>Unit:</h3>
                        <select name="" id="unitOptions">
                            <option value="">Unit 1</option>
                        </select>
                    </div>
                </div>
            </div>
            <div
            className={activePanel === 'panel-1' ? 'panel-1 show' : 'panel-1 hide'}
            >
            {activities ? (
                <div id='card-inbox-container' className='flex space-between'>
                  {activities.map((activity) => (
                    <div id="view-inbox-activity-card" key={activity.id}>
                      <div id='activity-title'>
                       Activity Level {activity.number}
                       </div>
                      <div id='view-activity-info'>
                        <p>
                          <strong>STANDARDS: </strong>
                          {activity.StandardS}
                        </p>
                        <p>
                          <strong>Description: </strong>
                          {activity.description}
                        </p>
                        <p>
                          <strong>Classroom Materials: </strong>
                          {activity.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type === SCIENCE
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 1) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        <p>
                          <strong>Student Materials: </strong>
                          {activity.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type === MAKING
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 4) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        <p>
                          <strong>Arduino Components: </strong>
                          {activity.learning_components
                            .filter(
                              (component) =>
                                component.learning_component_type ===
                                COMPUTATION
                            )
                            .map((element, index) => {
                              return (
                                <Tag
                                  key={index}
                                  color={color[(index + 7) % 11]}
                                >
                                  {element.type}
                                </Tag>
                              );
                            })}
                        </p>
                        {activity.link ? (
                          <p>
                            <strong>Link to Additional Information: </strong>
                            <a href={activity.link} target='_blank' rel='noreferrer'>
                              {activity.link}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
        </Modal>
        </div>
    </div>
  );
}
