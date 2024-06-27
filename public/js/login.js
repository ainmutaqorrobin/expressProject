import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const respond = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (respond.data.status === 'Successful.') {
      showAlert('success', 'Logged in sucessfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
