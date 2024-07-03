import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateData } from './updateProfile';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutButton = document.querySelector('.nav__el--logout');
const updateUserData = document.querySelector('.form-user-data');
const updateUserPassword = document.querySelector('.form-user-settings');

if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutButton) logOutButton.addEventListener('click', logout);

if (updateUserData) {
  updateUserData.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);

    await updateData(form, 'data');
  });
}

if (updateUserPassword) {
  updateUserPassword.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;

    await updateData({ password, newPassword, newPasswordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
