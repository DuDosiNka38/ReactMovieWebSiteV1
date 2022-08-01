import React, { useState } from 'react';
import Button from '../Components/Button';
import Input from '../Components/Input';
import './Ui.css';


const PostForm = function({createPost}){
  
  const [title, setTitle] = useState('')
  const [discript, setDiscript] = useState('')
  const [img, setImg] = useState('')

const addPost = function(e){
  e.preventDefault()
  const newPost = {
    id: Date.now,
    title: title,
    discript: discript,
    img: img
}

createPost(newPost)
setTitle('')
setDiscript('')
setImg('')


} 
  
  return(
    <div className='form'>
  <Input
  type ='text'
  placeholder='Name' 
  value = {title}
  onChange = {event => setTitle(event.target.value)}
  ></Input>
  <Input
    type ='text'
    placeholder='Discription'
    value = {discript}
   onChange = {event => setDiscript(event.target.value)}
></Input>
  <Input
  type ='text'
  placeholder='Link to picture' 
  value = {img}
  onChange = {event => setImg(event.target.value)}
  ></Input>
   <Button onClick = {addPost}>Создать</Button>
    </div>
)
};

export default PostForm;
