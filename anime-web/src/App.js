import React from 'react';
import {
  BrowserRouter,Routes, Route,Navigate} from "react-router-dom";
import Home from './Pages/Home';
import Posts from './Pages/Posts';
import Error from './Pages/Error';



function App() {

  return (
    <div className="App">
  <BrowserRouter>
  <Routes>

    <Route path='' element={<Home/>} />
    <Route path='/films' element={<Posts/>}/>
    <Route path='/error' element={<Error/>} />
  
    <Route render={() => <Navigate to="/error" />}/>

  </Routes>
  </BrowserRouter>
      


    </div>
  );
}

export default App;

