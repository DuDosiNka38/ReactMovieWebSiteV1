import React, {useState} from 'react';
import './Ui.css';

const Comments = function(){

  const[comment, setComment] = useState("")
         
  

  return(
<div className='form'>
<h2>{comment}</h2> 
<input className='Comments'
type = "text"
value = {comment}
onChange = {event => setComment(event.target.value)}
></input>  

</div>

)
};

export default Comments;
