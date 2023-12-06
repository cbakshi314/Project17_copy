import React, { useEffect, useState } from 'react';
import './Home.less';
import {
  getClassroom,
  getLessonModule,
  getLessonModuleActivities,
  deleteActivity,
} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';
import '../../Dashboard/Dashboard.less'
import DisplayCodeModal from './DisplayCodeModal';
import MentorActivityDetailModal from './MentorActivityDetailModal';
import LessonModuleModal from './LessonModuleSelect/LessonModuleModal';
import { message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Home({ classroomId, viewing }) {
  const [classroom, setClassroom] = useState({});
  const [activities, setActivities] = useState([]);
  const [gradeId, setGradeId] = useState(null);
  const [activeLessonModule, setActiveLessonModule] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [display, setDisplay] = useState(false);

  const navigate = useNavigate();
  

  const SCIENCE = 1;
  const MAKING = 2;
  const COMPUTATION = 3;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getClassroom(classroomId);
      if (res.data) {
        const classroom = res.data;
        setClassroom(classroom);
        setGradeId(classroom.grade.id);
        classroom.selections.forEach(async (selection) => {
          if (selection.current ) {
            const lsRes = await getLessonModule(
              selection.lesson_module
            );
            if (lsRes.data) setActiveLessonModule(lsRes.data);
            else {
              message.error(lsRes.err);
              setDisplay(false);
            }
            const activityRes = await getLessonModuleActivities(lsRes.data.id);
            if (activityRes) setActivities(activityRes.data);
            else {
              message.error(activityRes.err);
            }
          }
        });
      } else {
        message.error(res.err);
      }
    };
    fetchData();
  }, [classroomId]);
  

  const handleViewActivity = (activity, name) => {
    activity.lesson_module_name = name;
    localStorage.setItem('sandbox-activity', JSON.stringify(activity));
    navigate('/sandbox');
  };

  const openActivityInWorkspace = (activity, name) => {
    activity.lesson_module_name = name;
    activity.template = activity.activity_template;
    delete activity.id;
    delete activity.activity_template;
    localStorage.setItem('sandbox-activity', JSON.stringify(activity));
    navigate('/sandbox');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const removeAcitivty = async (selectedAct) => {
    const newActivities = activities;

    var i = newActivities.length;

    while(i--){

      if(activities[i].id == selectedAct.id){
        newActivities.splice(i, 1);
        break;

      }
    }

    setActivities(newActivities);

    const res = await deleteActivity(selectedAct.id);
    if(res){
      message.success("Activity Deleted");
      setForceRender((prev) => !prev);

    }
  }

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

  return (
    <div>
      <button id='home-back-btn' onClick={handleBack}>
        <i className='fa fa-arrow-left' aria-hidden='true' />
      </button>
      <DisplayCodeModal code={classroom.code} />
      <MentorSubHeader title={classroom.name}></MentorSubHeader>
      <div id='home-content-container'>
        <div id='active-lesson-module'>
          {activeLessonModule ? (
            <div>
              <div id='active-lesson-module-title-container'>
                <h3>{`Learning Standard - ${activeLessonModule.name}`}</h3>
                <LessonModuleModal
                  setActiveLessonModule={setActiveLessonModule}
                  activeLessonModule={activeLessonModule}
                  classroomId={classroomId}
                  gradeId={gradeId}
                  viewing={viewing}
                  setActivities={setActivities}
                />
              </div>
              <p id='lesson-module-expectations'>{`Expectations: ${activeLessonModule.expectations}`}</p>
             {activeLessonModule.link ? (
                <p>
                  Addtional resources to the lesson:{' '}
                  <a
                    href={activeLessonModule.link}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {activeLessonModule.link}
                  </a>
                </p>
              ) : null}
              {activities ? (
                <div id='card-btn-container' className='flex space-between'>
                  {activities.map((activity) => (
                    <div id="view-activity-card" key={activity.id}>
                      <div id='activity-title'>
                       Activity Level {activity.number}
                       </div>
                      <div id='view-activity-heading' style={{display: "flex"}}>
                        
                        <button
                          id='view-activity-button'
                          style={{marginRight: "auto"}}
                          onClick={() =>
                            handleViewActivity(activity, activeLessonModule.name)
                          }
                        >
                          Student Template
                        </button>
                        {activity.activity_template && (
                          <button
                            id='view-activity-button'
                            style={{marginRight: "auto"}}
                            onClick={() =>
                              openActivityInWorkspace(
                                activity,
                                activeLessonModule.name
                              )
                            }
                          >
                            Demo Template
                          </button>
                        )}
                        <MentorActivityDetailModal
                          learningStandard={activeLessonModule}
                          selectActivity={activity}
                          activityDetailsVisible={false}
                          setActivityDetailsVisible={false}
                          setActivities={setActivities}
                          viewing={false}
                        />
                        <button className='removal-btn' onClick={() => removeAcitivty(activity)}><svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg></button>

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
          ) : (
            <div>
              <p>There is currently no active lesson set.</p>
              <p>Click the button below to browse available lessons.</p>
              <LessonModuleModal
                setActiveLessonModule={setActiveLessonModule}
                classroomId={classroomId}
                gradeId={gradeId}
                viewing={viewing}
                setActivities={setActivities}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
