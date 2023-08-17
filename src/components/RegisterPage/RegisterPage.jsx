import React from 'react';
import RegisterForm from '../RegisterForm/RegisterForm';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import './RegisterPage.css';

function RegistrationPage() {
  const history = useHistory();

  return (
    <div className="register-page-container">
      <h2>Register to Petopia</h2>
      <RegisterForm />
      <div className="centered-content">
        <p>Already have an account?</p>
        </div>
        <div>
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
  );
}

export default RegistrationPage;
