import React from 'react';
import './Pages.css';
import {Link} from "react-router-dom";



const Home = function(){

  return(
   <div className='Home'>
   <h1>The Best Films and Series are only on our site</h1>
   <h2><Link to='/films'>Show List of Films</Link></h2>
    
   </div>
)
};

export default Home;