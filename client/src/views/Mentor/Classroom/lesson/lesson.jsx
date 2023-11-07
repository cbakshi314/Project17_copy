import React, { useEffect, useState } from 'react';
import { message } from "antd"
import ActivityComponentTags from "../../../ContentCreator/ActivityEditor/components/ActivityComponentTags"
import './lesson.less';
import {getClassroom, getUnits} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';

export default function lesson({ classroomId }) {
    const [classroom, setClassroom] = useState({});
    const [scienceComponents, setScienceComponents] = useState([])
    const [makingComponents, setMakingComponents] = useState([])
    const [computationComponents, setComputationComponents] = useState([])
    const [unitValue, setUnitValue] = useState(0);

    const [standardsValue, setStandardsValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [tc, settc] = useState('');

    const selector  = document.getElementsByName('unitSelection');


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

      useEffect(() => {
        if (classroom.grade && classroom.grade.id) {
          const fetchUnits = async () => {
            try {
              const res = await getUnits(classroom.grade.id);
              if (res.data) {
                for(const x in res.data){
                    var unit = res.data[x];
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
        }
      }, [classroom.grade]);

      const updateS = (e) =>{
        setStandardsValue(e.target.value);
      };

      const updateD= (e) =>{
        setDescriptionValue(e.target.value);
      };

      const updateTC= (e) =>{
        settc(e.target.value);
      };


      const updateUnit = (e) => {
        const selectedUnit = e.target.value;
        // Save the selected unit to state
        setUnitValue(selectedUnit);
      };
      

      const handleSubmit= (e) =>{
        // send info to backend
        console.log("submited");
      }

  return (
    <div className='all'>
    <MentorSubHeader
        title={'Create Lesson'}
      />
      <div id='c_lesson'>
        <h3>Creating lesson for <strong>{classroom.name}</strong></h3>
        <hr />
      <form onSubmit={handleSubmit}>
            <div className='fst'>
                <h4>Unit: </h4>                
                <select name="unitSelection" id="units" onChange={updateUnit} value={unitValue}>
                </select>

            </div>
            <div className='fst'>
                <h4>STANDARDS:</h4>
                <input className='textbox' type="text" name='standards' onChange={updateS} value={standardsValue} />
            </div>
            <div className='fst'>
                <h4>Description:</h4>
                <textarea className='dtextbox' type="text" name='description' onChange={updateD} value={descriptionValue}/>
            </div>
            <div className='fst'>
                <h4>Table Chart:</h4>
                <textarea className='dtextbox' placeholder='Enter Image URL' type="text" name='description' onChange={updateTC} value={tc}/>
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
