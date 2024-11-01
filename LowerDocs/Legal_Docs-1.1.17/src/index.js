import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { ipcRenderer } from 'electron';
import axios from './services/axios';


const app = (
 
    <Provider store={store} >
        <BrowserRouter>
          
                <App />
      
        </BrowserRouter>
    </Provider>
);

ipcRenderer.send("GET_HOST", {});

ipcRenderer.on("GET_HOST", (event, args) => {
    const { host } = args;
    axios.defaults.baseURL = host;
    console.log(host)

    ReactDOM.render(app, document.getElementById('root'));
    serviceWorker.unregister();
});


