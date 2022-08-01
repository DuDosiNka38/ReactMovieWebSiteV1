import React, {useState} from 'react';
import './Ui.css';
import Button from '../Components/Button';
const Counter = function(){

  const[count, setCount] = useState(0)
         
  function increm() {
    setCount( count + 1)
    }
 
 function decrem() {
  setCount( count - 1)
    }

  return(
<div className='form'>
<h2>{count}</h2> 
<Button onClick={increm}>Plus 1</Button>
<Button onClick={decrem}>Munus 1</Button>  

</div>

)
};

export default Counter;
