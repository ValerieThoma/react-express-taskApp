import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import ToDo from './ToDo';

ReactDOM.render(<ToDo />, document.getElementById('root'));
registerServiceWorker();
