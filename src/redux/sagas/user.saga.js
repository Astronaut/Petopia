import { put, takeLatest } from 'redux-saga/effects';

function* fetchUser() {
  try {
    const response = yield fetch('/api/user');
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const user = yield response.json();

    yield put({ type: 'SET_USER', payload: user });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* logoutUser() {
  try {
    const response = yield fetch('/api/logout', { method: 'POST' });
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
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
