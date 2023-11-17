import React, { useEffect, useState } from 'react';
import { getMentor, getLessonModuleActivities } from '../../../Utils/requests';
import { Tabs } from 'antd';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import './Inbox.less';

const { TabPane } = Tabs;

export default function Inbox() {
    const [printed, setprinted] = useState(false);
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
                text1.innerHTML = `${lesson.name}`;
                const text2 = document.createElement('p');
                text2.innerHTML = `Expectations: ${lesson.expectations}`;
                const text3 = document.createElement('p');
                if(less)
                text2.innerHTML = `Expectations: ${lesson.expectations}`;
                box.append(text1);
                box.append(text2);
                box.append(text3);
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

    const expand = (lesson) =>{
        console.log(lesson)
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
        </div>
    </div>
  );
}
