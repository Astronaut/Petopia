import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const response = yield fetch('/api/user');
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const user = yield response.json();

    // now that the session has given us a user object
    // with an id and username, set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: user });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

// Worker saga for logout
function* logoutUser() {
  try {
    // Assuming you have an API endpoint to log the user out.
    const response = yield fetch('/api/logout', { method: 'POST' });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    // Dispatch an action to clear the user from the Redux store.
    yield put({ type: 'UNSET_USER' });
  } catch (error) {
    console.log('User logout request failed', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('LOGOUT_REQUEST', logoutUser);
}

export default userSaga;
