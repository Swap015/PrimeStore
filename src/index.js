import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Provider } from 'react-redux';
import store from './Components/Redux/store';
import {  AuthProvider } from "./Components/Authentication/AuthContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <Provider store={store}>

    <AuthProvider value={{ AuthProvider }}>
      <App />
    </AuthProvider>

  </Provider>


);


reportWebVitals();
