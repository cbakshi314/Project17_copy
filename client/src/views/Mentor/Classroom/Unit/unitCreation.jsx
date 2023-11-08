import React, { useEffect, useState } from 'react';
import './unitCreation.less';
import {getClassroom} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';

export default function unitCreation({ classroomId }) {
    const [classroom, setClassroom] = useState({});
    const [newUnitName, setNewUnitName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
          const res = await getClassroom(classroomId);
          if (res.data) {
            const classroom = res.data;
            setClassroom(classroom);
            
          } else {
            message.error(res.err);
          }

        };
        fetchData();
      }, [classroomId]);

      const updateName = (e) => {
        setNewUnitName(e.target.value)
        console.log(e.target.value)
      }

      function handleSubmit(){
        // send info to backend
        console.error("test");

      }

    return(
    <div className='all'>
        <MentorSubHeader
        title={'Create Unit'}
      />
      <div id='c_lesson'>
        <h3>Creating lesson for <strong>{classroom.name}</strong></h3>
        <hr />
      <form onSubmit={handleSubmit}>
        <div>
            <h4> Unit Name: </h4>
            <input type="text" onChange={updateName} value={newUnitName}/>
            <input type="submit" />
        </div>

        </form>
      </div>
    </div>);
}
