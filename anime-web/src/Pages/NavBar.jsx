import React from 'react';
import './Pages.css';
import {Link} from "react-router-dom";



const Navbar = function(){

  return(
   <div className='nav-bar'>
   <span><Link to='/films'>Films</Link></span>
   <span><Link to=''>Home</Link></span>
    
   </div>
)
};

export default Navbar;