import { Button } from 'reactstrap';
import React from 'react';
import { useHistory } from "react-router-dom";


const GoBack = () => {
  let history = useHistory();

  function handleClick() {
    history.goBack();
  }
  return (
    <Button type="button" className="goBack" onClick={handleClick}>
   <i className="ri-arrow-go-back-fill"></i>
    </Button>
  );
}

export default GoBack