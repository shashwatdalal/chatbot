import React from 'react';
import ReactDOM from 'react-dom';
import './static/index.css';
import App from './modules/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();