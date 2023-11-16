import React, { useEffect, useState } from 'react';
import { getMentor, getClassrooms } from '../../../Utils/requests';
import { Tabs } from 'antd';
import MentorSubHeader from '../../../components/MentorSubHeader/MentorSubHeader';
import NavBar from '../../../components/NavBar/NavBar';
import { useGlobalState } from '../../../Utils/userState';
import { useNavigate } from 'react-router-dom';
import './Inbox.less';

const { TabPane } = Tabs;

export default function Inbox() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dashboard');
      };

  return (
    <div className='container nav-padding'>
        <NavBar isMentor={true}/>

        <div>
            <button id='home-back-btn1' onClick={handleBack}>
                <i className='fa fa-arrow-left' aria-hidden='true' />
            </button>
            <div className='inboxData'>

            </div>
        </div>
    </div>
  );
}
