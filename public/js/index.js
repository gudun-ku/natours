/* eslint-disable */

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updatSettings } from './updateSettings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = docuemnt.querySelector('.form-user-password');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, (type = 'data'));
  });
}

if (userPasswordForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const passwordCurrent = password.getElementById('password-current').value;
    const password = password.getElementById('password').value;
    const passwordConfirm = password.getElementById('password-confirm').value;

    //const email = document.getElementById('email').value;
    updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');
  });
}
