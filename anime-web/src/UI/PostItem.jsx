import React from 'react';
import Button from '../Components/Button';
import './Ui.css';

const PostItem = function(props){


  return(
   
<div className='post-card'>
  <img  className='post-img' src={props.post.url}></img>
   <h2 >{props.number}. {props.post.title}</h2>
 
   <div className='post-discript'>
      <h3>{props.post.discript}</h3>
  </div>
  <Button onClick={()=> props.deletepost(props.post)}>Удалить</Button>


</div>

)
};

export default PostItem;
