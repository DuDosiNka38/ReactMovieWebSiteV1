import React, { Component } from "react";
import loader from './../Loader/loadercss.svg'

class PreloaderTimer extends Component {
  state = {};

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) this.render();
  }

  render() {
    return (
      <>
        <div id="PreloaderTimer">
          <div id="status">
          </div>
          <div className="check-holder">
            <h2 className=" check-title text-center mb-5" >Please ask the Legal Docs admin to approve your Computer. <br/> Then You can exit the Application or wait for approval.</h2>
            <div className="loader-holder">
            <object className="loader_Obj" data={loader}></object>
         
        </div>
            <h3 className="check-text-sub">{this.props.message}</h3>
          </div>
        </div>
      </>
    );
  }
}

export default PreloaderTimer;
