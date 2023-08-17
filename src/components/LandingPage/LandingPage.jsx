import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome to Petopia!');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <div className="container">
      <div className="centered-content">
        <h2>{heading}</h2>
      </div>
      <div className="grid">
        <div className="grid-col grid-col_4">
          <RegisterForm />
          <div className="login-button-container">
            <h4>Already a Member?</h4>
            <Button
              variant="outlined"
              style={{color: 'white'}}
              className="mui-btn-asLink"
              onClick={() => {
                history.push('/login');
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
