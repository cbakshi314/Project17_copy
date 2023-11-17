import React, { useEffect, useState } from 'react';
import { getMentor, getLessonModuleActivities } from '../../../Utils/requests';
import { Modal, Button, message, Popconfirm, Tabs } from 'antd';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import './Inbox.less';

const { TabPane } = Tabs;

export default function Inbox() {
    const [printed, setprinted] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activities, setActivites] = useState({});
    
    const navigate = useNavigate();
    
    const handleBack = () => {
        navigate('/dashboard');
      };

      useEffect(() => {
        const dataBox = document.getElementById('inboxData');
        getMentor().then((res) => {
          if (res.data && !printed) {
            res.data.inbox.forEach((lesson) => {
                console.log(lesson);
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

    const expand = async (lesson) =>{
        setVisible(true);

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
      };
    const handleOk = () => {
        setVisible(false);
      };
    

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
        title={
          "Lesson Activities"
        }
        visible={visible}
        onCancel={handleCancel}
        width='60vw'
        footer={[
          <Button
            key='ok'
            type='primary'
            disabled={false}
            onClick={handleOk}
          >
            Save
          </Button>,
        ]}
      >
        {/* <LessonModuleSelect
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          selected={selected}
          setSelected={setSelected}
          gradeId={gradeId}
          activities={selectedActivities}
          setActivities={setSelectedActivities}
        /> */}
      </Modal>
        </div>
    </div>
  );
}
