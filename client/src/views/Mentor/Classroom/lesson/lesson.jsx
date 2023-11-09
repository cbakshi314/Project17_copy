import React, { useEffect, useState } from 'react';
import { message } from "antd"
import ActivityComponentTags from "../../../ContentCreator/ActivityEditor/components/ActivityComponentTags"
import './lesson.less';
import {getClassroom, getUnits, createLessonModule} from '../../../../Utils/requests';
import MentorSubHeader from '../../../../components/MentorSubHeader/MentorSubHeader';


// export function should just be nameed whatever your fileName is
// Usually there is not input unless it is provided when called
// In this case 'classroomId' is being sent as input
export default function lesson({ classroomId }) {

  // essentially global variables (where we save the input to on change)
    const [classroom, setClassroom] = useState({});
    
    const [name, setName ] = useState("");
    const [scienceComponents, setScienceComponents] = useState([]);
    const [makingComponents, setMakingComponents] = useState([]);
    const [computationComponents, setComputationComponents] = useState([]);
    const [unitValue, setUnitValue] = useState("");
    const [standardsValue, setStandardsValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');
    const [tc, settc] = useState('');
    const [additionalInfo, setAdditionalInfo ] = useState("");

    const selector  = document.getElementsByName('unitSelection');

    // getting data from backend 
    // useEffect just makes it so that it runs when the website loads
    // useEffect takes in 2 components (fethcing data call, and neccessary data to call database)
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

      // async allows other components to run while you await your fetched data

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
      
      // These functions update the global variables live while the user inputs them (This is different from save on submition)
      const updateN = (e) =>{
        setName(e.target.value);
      };
      const updateS = (e) =>{
        setStandardsValue(e.target.value);
      };
      const updateD= (e) =>{
        setDescriptionValue(e.target.value);
      };
      const updateTC= (e) =>{
        settc(e.target.value);
      };
      const updateAI = (e) =>{
        setAdditionalInfo(e.target.value);
      };
      const updateUnit = (e) => {
        setUnitValue(e.target.value);
      };

      // clear all global variables
      function clearForm(){
        setUnitValue("");
        setAdditionalInfo("");
        settc("");
        setDescriptionValue("");
        setStandardsValue("");
        setName("");
        setScienceComponents([]);
        setMakingComponents([]);
        setComputationComponents([]);
      }
      
      // on submittion do whatever's in here...
      function handleSubmit(event){
        event.preventDefault();

        if((scienceComponents.length==0 &&  makingComponents.length==0 && computationComponents.length==0) || unitValue==""){
          message.error("Empty lesson material or Unit");
        }

        else{
          // send info to backend
          const saveLesson = async () =>{
            const res = await createLessonModule(descriptionValue, name, 0, unitValue, standardsValue, additionalInfo)
            if(res.data){
              console.log(res.data);
              message.success(`"${standardsValue}" was successfuly created for ${unitValue}`);

              // clear Form
              clearForm();
            }
            else{
              message.error("Unable to Save");
            }

          };
          saveLesson;
        }
      }

  // return is what you see on the screen
  // Think of this as the front frontEnd
  return (
    <div className='all'>
    <MentorSubHeader
        title={'Create Lesson'}
      />
      <div id='c_lesson'>
        <h3>Create lesson for <strong>{classroom.name}</strong></h3>
        <hr />
      <form onSubmit={handleSubmit}>
            <div className='selection'>
                <h4>Unit: </h4>                
                <select name="unitSelection" id="units" onChange={updateUnit} value={unitValue}>
                  <option value=""></option>
                </select>
            </div>
            <div className='fst'>
                <h4>*Name:</h4>
                <input className='textbox' type="text" name='name' onChange={updateN} value={name} required/>
            </div>
            <div className='fst'>
                <h4>*STANDARDS:</h4>
                <input className='textbox' type="text" name='standards' onChange={updateS} value={standardsValue} required/>
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
            <h3>*Lesson Material</h3>
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
                <input className='textbox' type="text" name='standards' placeholder='Enter a Link' onChange={updateAI} value={additionalInfo}/>
            </div>
            <input className='submitbtn' type="submit" name="" id="" value={"Create Lesson"}/>
        </form>
      </div>
    </div>
  );
}
