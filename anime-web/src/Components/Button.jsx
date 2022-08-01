import React from 'react';
import classes from './Components.module.css';


const Button = function({children, ...props}){

  return(
   <button {...props} className={classes.Butt}>
     {children}
   </button>
)
};

export default Button;
