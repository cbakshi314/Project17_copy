import React, { useEffect, useState } from 'react';
import { message } from "antd"
import ActivityComponentTags from "../../../ContentCreator/ActivityEditor/components/ActivityComponentTags"
import './lesson.less';
import {getClassroom} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';

export default function lesson({ classroomId }) {
    const [classroom, setClassroom] = useState({});
    const [scienceComponents, setScienceComponents] = useState([])
    const [makingComponents, setMakingComponents] = useState([])
    const [computationComponents, setComputationComponents] = useState([])

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

  return (
    <div className='all'>
    <MentorSubHeader
        title={'Create Lesson'}
      />
      <div id='c_lesson'>
        <h3>Creating lesson for <strong>{classroom.name}</strong></h3>
        <hr />
      <form action="">
            <div className='fst'>
                <h4>STANDARDS:</h4>
                <input className='textbox' type="text" name='standards' />
            </div>
            <div className='fst'>
                <h4>Description:</h4>
                <textarea className='dtextbox' type="text" name='description'/>
            </div>
            <div className='fst'>
                <h4>Table Chart:</h4>
                <textarea className='dtextbox' placeholder='Enter Image URL' type="text" name='description'/>
            </div>
            <hr />
            <h3>Lesson Material</h3>
            <div className='ms'>
                    <h4>Classroom Materials:</h4>
                    <ActivityComponentTags
                        components={scienceComponents}
                        setComponents={setScienceComponents}
                        colorOffset={1}
                    />
            </div>
            <div className='ms'>
                    <h4>Student Components: </h4>
                    <ActivityComponentTags
                        components={makingComponents}
                        setComponents={setMakingComponents}
                        colorOffset={1}
                    />
            </div>
            <div className='ms'>
                    <h4>Arduino Components: </h4>
                    <ActivityComponentTags
                        components={computationComponents}
                        setComponents={setComputationComponents}
                        colorOffset={1}
                    />
            </div>
            <hr />
            <h3>Additional Information</h3>
            <div className='fst'>
                <h4>Additional Info:</h4>
                <input className='textbox' type="text" name='standards' placeholder='Enter a Link'/>
            </div>
            <input className='submitbtn' type="submit" name="" id="" value={"Create Lesson"}/>
        </form>
      </div>
    </div>
  );
}
