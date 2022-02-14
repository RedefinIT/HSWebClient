import 'whatwg-fetch';
import { polyfill as promisePolyfill } from 'es6-promise';

import React from 'react';
import ReactDOM from 'react-dom';

// import '../scss/index.scss';

import App from './App';

promisePolyfill();

const element = document.getElementById('content');
// const element = document.getElementById('app');
//console.log("element: ###############");
//console.log(element);
ReactDOM.render(<App />, element);

document.body.classList.remove('loading');
