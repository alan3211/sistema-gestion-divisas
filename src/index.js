import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';
import 'remixicon/fonts/remixicon.css';

import './style.css';

import 'apexcharts/dist/apexcharts';
import 'echarts/dist/echarts.min';
import 'quill/dist/quill.min';
import 'simple-datatables/dist/index';
import 'tinymce/tinymce';
import './js/main';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
