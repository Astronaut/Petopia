import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import './LoginPage.css';

function LoginPage() {
  const history = useHistory();

  return (
    <div className="login-page-container">
      <h2>Login to Petopia</h2>
      <LoginForm />
      <div className="centered-content">
        <p>Don't have an account?</p>
        </div>
        <div>
        <Button
          variant="outlined"
          style={{color: 'white'}}
          className="mui-btn-asLink"
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
