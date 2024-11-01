import React, { Component } from 'react'
import { Button } from 'reactstrap';
import combine  from '../../routes/combine';


class Refresh extends Component {
  state = {

  } 

 
    render() { 
      const {PData} = this.props
        return ( 
            <>
              <Button onClick={this.props.resreshPage}
              className="goBack" title = "Resfresh">
                <i className="ri-refresh-line "></i>
              </Button>
            </>

         );
    }
}
export default Refresh;


