import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updatePassword'
        : '/api/v1/users/updateUserSelf';

    const respond = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (respond.data.status === 'Success.') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
