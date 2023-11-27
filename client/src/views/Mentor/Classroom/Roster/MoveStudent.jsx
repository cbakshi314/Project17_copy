import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import {
  addStudent,
  getMentor,
  getClassrooms,  
  getAllClassrooms
} from '../../../../Utils/requests';

export default function MoveStudent({ linkBtn, student, getFormattedDate, addStudentsToTable }) {
  const [visible, setVisible] = useState(false);
  //const [classList, setClassList] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [studentData, setStudentData] = useState([]);
  let allClassrooms = getAllClassrooms();
  let classIds = [];
  
  const setClassIds = () => {
    /*getMentor().then((res) => {
      if (res.data) {
        res.data.classrooms.forEach((classroom) => {
          classIds.push(classroom.id);
        });
      }
    });*/
    classIds = getClassrooms;
    alert("getClassrooms.length is: " + getClassrooms.toString() + " and classIds.length: " + classIds.length);
  };

  

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleMoveStudent = async(key) => {
    //const oldStudent = studentData
    
    alert("moving student");

    const newStudent = await addStudent(
      student.name, student.character, classroomId
    )

    //add student to new classroom
    addStudentsToTable([newStudent.data])

    //remove student from old classroom
    const dataSource = [...studentData];
    setStudentData(dataSource.filter((item) => item.key !== key));
  }


  //const handleCancel = () => {
  //  setVisible(false);
  //};

  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        Move
      </button>
      <Modal
        // title={student.name}
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleCancel}>
            Cancel Move
          </Button>,
        ]}
      >
        <div id='modal-student-card-header'>
          <p id='animal'>{student.character}</p>
          <h1 id='student-card-title'>{"Move " + student.name + " to another class"}</h1>
        </div>
        <div id='description-container'>
              <p id='label'>Current class&nbsp;</p>
              <p id='label-info'> {""}</p>
              <br></br>
        </div>
        <div id='description-container'>
          <p id='label'>Status:&nbsp;</p>
          <p id='label-info'>
            {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}
          </p>
        </div>
        <div>
          <div id='modal-card-content-container'>
              <p id='label'>Choose destination classroom:</p>
              {setClassIds()}
              




              <select
                  id="classroom-dropdown-selector-id"
                  name="classroom-dropdown-selector-name"
                  onChange={e => handleMoveStudent(e.target.value)} /////here, how do I save the selected classroom?
                  required
              >
                {classIds.map(class_ => (
                <option key={class_.id} value={class_.id}>
                    {class_.name}
                </option>
                ))}
                <option>1</option>
                <option>2</option>
                {classrooms.map(class_ => (
                <option key={class_.id} value={class_.id}>
                    {class_.name}
                </option>
                ))}
              </select>





          </div>
          <div id='modal-card-content-container'>
            
          </div>
        </div>
      </Modal>
    </div>
  );
}


/*

<select
                  id="classroom-dropdown"
                  name="classroom"
                  onChange={e => setClassList(e.target.value)} /////here, how do I save the selected classroom?
                  required
              >
                  {allClassrooms.map(class_ => (
                      <option key={class_.id} value={class_.id}>
                          {class_.name}
                      </option>
                  ))}
              </select>



res.data.classrooms

*/