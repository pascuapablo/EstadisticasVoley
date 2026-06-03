import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Fuentes del tema (locales, para funcionar offline)
import '@fontsource/anton/400.css';
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/500.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/700.css';
import '@fontsource/archivo/800.css';
import '@fontsource/archivo/900.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import "./css/app.scss"
import "./css/theme.css"
import 'bootstrap/js/dist/tab.js'


window.onerror = (msg, src, line, col, err) => {
    document.body.innerHTML = `<div style="padding:20px;color:red;font-size:14px;word-break:break-all">
        <b>ERROR:</b><br>${msg}<br><br>
        ${src}:${line}:${col}<br><br>
        ${err ? err.stack : ''}
    </div>`;
};

window.addEventListener('unhandledrejection', e => {
    document.body.innerHTML = `<div style="padding:20px;color:red;font-size:14px;word-break:break-all">
        <b>PROMISE ERROR:</b><br>${e.reason}
    </div>`;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>
);
