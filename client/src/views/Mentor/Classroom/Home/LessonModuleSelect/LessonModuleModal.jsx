import { Modal, Button, message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import LessonModuleSelect from './LessonModuleSelect';
import {
  getLessonModule,
  setSelection,
  getLessonModuleActivities,
  deleteLessonModule,
  createActivity,
} from '../../../../../Utils/requests';
import { useSearchParams } from 'react-router-dom';

export default function LessonModuleModal({
  setActiveLessonModule,
  gradeId,
  classroomId,
  viewing,
  setActivities,
}) {
  const [visible, setVisible] = useState(false);
  const [activePanel, setActivePanel] = useState('panel-1');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selected, setSelected] = useState({});
  // eslint-disable-next-line
  const [_, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      if (viewing) {
        const res = await getLessonModule(viewing);
        if (res.data) {
          setSelected(res.data);
          const activitiesRes = await getLessonModuleActivities(res.data.id);
          if (activitiesRes) setSelectedActivities(activitiesRes.data);
          else {
            message.error(activitiesRes.err);
          }
          setVisible(true);
          setActivePanel('panel-2');
        } else {
          message.error(res.err);
        }
      }
    };
    fetchData();
  }, [viewing]);

  const showModal = () => {
    setActivePanel('panel-1');
    setVisible(true);
  };

  const handleCancel = () => {
    setSearchParams({ tab: 'home' });
    setVisible(false);
  };

  const handleOk = async () => {
    const res = await setSelection(classroomId, selected.id);
    if (res.err) {
      message.error(res.err);
    } else {
      setActiveLessonModule(selected);
      setActivities(selectedActivities);
      message.success('Successfully updated active learning standard.');
      setSearchParams({ tab: 'home' });
      setVisible(false);
    }
  };

  const handleReview = () => {
    setSearchParams({ tab: 'home', viewing: selected.id });
    setActivePanel('panel-2');
  };

  const deleteLesson = async () =>{
    const res  = await deleteLessonModule(selected.id)
    if(res.data){
      message.success(`'${selected.name}' has been deleted`)
    }
    else{
      message.error(`Could not delete '${selected.name}'`)
    }
  };

  const addActivity = async () =>{
    const res = await createActivity
  }

  return (
    <div id='lesson-module-modal'>
      <button id='change-lesson-btn' onClick={showModal}>
        <p id='test'>Change</p>
      </button>
      <Modal
        title={
          activePanel === 'panel-1'
            ? 'Select a Learning Standard:'
            : selected.name
        }
        visible={visible}
        onCancel={handleCancel}
        width='60vw'
        footer={[
          <Button
            key='ok'
            type='primary'
            disabled={selected.id === undefined}
            onClick={activePanel === 'panel-1' ? handleReview : handleOk}
          >
            {activePanel === 'panel-1'
              ? 'Review'
              : 'Set as Active Learning Standard'}
          </Button>,
        ]}
      >
        <LessonModuleSelect
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          selected={selected}
          setSelected={setSelected}
          gradeId={gradeId}
          activities={selectedActivities}
          setActivities={setSelectedActivities}
        />
      </Modal>
      {/* add avtivty button has not been implemented yet */}
      <button id='add-activity'>+ Activity</button>
      <Popconfirm
          title='This action is NOT reversible'
          onConfirm={() => { deleteLesson()
              }}
            >
      <button id='delete-lesson'>Delete Lesson</button>
      </Popconfirm>
    </div>
  );
}
