import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { BrowserRouter, NavLink } from 'react-router-dom';
import './style.css';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(

<div className='BodyDiv'>
  <React.StrictMode>
    <BrowserRouter>

      <nav className='NavBar'>
        <ul>
          <li><a><NavLink to={'/'}>Home</NavLink></a></li>
          <li><a><NavLink to={'/demo'}>Demo</NavLink></a></li>
          <li><a><NavLink to={'/documentation'}>Docs</NavLink></a></li>
          <li><a><NavLink to={'/about'}>About</NavLink></a></li>
        </ul>
      </nav>

      <App />
    </BrowserRouter>
  </React.StrictMode>

</div>
    
);
