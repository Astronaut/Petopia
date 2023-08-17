import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "LOGIN" actions
function* loginUser(action) {
  try {
    // clear any existing error on the login page
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    // send the action.payload as the body
    const response = yield fetch('/api/user/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(action.payload),
    });

    // Check if our network request was successful
    if (!response.ok) {
      const errorData = yield response.json();
      if (response.status === 401) {
        // If status code is 401, handle as unauthorized
        throw new Error(errorData.message || "Unauthorized");
      } else {
        throw new Error("Network response was not OK");
      }
    }

    // after the user has logged in, get the user information from the server
    yield put({ type: 'FETCH_USER' });
  } catch (error) {
    console.log('Error with user login:', error.message);

    if (error.message === "Unauthorized") {
      // If the error message is "Unauthorized", dispatch LOGIN_FAILED
      yield put({ type: 'LOGIN_FAILED' });
    } else {
      // Handle any other errors
      yield put({ type: 'LOGIN_FAILED_NO_CODE' });
    }
  }
}

// worker Saga: will be fired on "LOGOUT" actions
function* logoutUser() {
  try {
    const response = yield fetch('/api/user/logout', {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }

    // now that the session has ended on the server, remove the client-side user object
    yield put({ type: 'UNSET_USER' });
  } catch (error) {
    console.log('Error with user logout:', error);
  }
}

function* loginSaga() {
  yield takeLatest('LOGIN', loginUser);
  yield takeLatest('LOGOUT', logoutUser);
}

export default loginSaga;
