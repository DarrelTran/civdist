import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter} from 'react-router-dom'
import AllRoutes from './routes/allRoutes'  

function App() {
  return (
    <BrowserRouter>
      <AllRoutes/>
    </BrowserRouter>
  );
}

export default App;
