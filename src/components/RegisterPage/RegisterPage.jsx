import React from 'react';
import RegisterForm from '../RegisterForm/RegisterForm';
import { useHistory } from 'react-router-dom';

function RegistrationPage() {
  const history = useHistory();

  return (
    <div>
      <h2>Register to Petopia</h2>
      <RegisterForm />
      <center>
        <p>Already have an account?</p>
        <button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </button>
      </center>
    </div>
  );
}

export default RegistrationPage;
