import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import './vendor/bootstrap/css/bootstrap.min.css';
import './vendor/bootstrap-icons/bootstrap-icons.css';
import './vendor/boxicons/css/boxicons.min.css';
import './vendor/quill/quill.snow.css';
import './vendor/quill/quill.bubble.css';
import './vendor/remixicon/remixicon.css';
import './vendor/simple-datatables/style.css';
import './style.css';


//import './vendor/apexcharts/apexcharts.min.js';
import './vendor/bootstrap/js/bootstrap.bundle.min.js';
import './vendor/chart.js/chart.umd.js';
import './vendor/echarts/echarts.min.js';
import './vendor/quill/quill.min.js';
import './vendor/simple-datatables/simple-datatables.js';
import './vendor/tinymce/tinymce.min.js';
import './js/main';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
