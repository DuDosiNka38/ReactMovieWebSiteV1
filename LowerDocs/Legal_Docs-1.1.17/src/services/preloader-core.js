import React, { Component } from "react";
import Preloader from "./../components/Preloader/preloader";
import PreloaderTimer from "./../components/Preloader/preloaderTimer";

let App = null;
class PreloaderLD {
  constructor(obj, visible = false) {
    App = obj;
    this.obj = obj;
    this.obj.preloaderState = false;
    this.visible = visible;
    this.isShowed = false;

    this.obj.update = (state) => {
      if(this.obj.state.hasOwnProperty("preloaderState") && this.obj.state.preloaderState !== state)
      this.obj.setState({preloaderState: state})
    };
  }

  get() {
    if (this.obj.preloaderState === true) return <Preloader />;
    else return null;
  }

  getWait(message){
    return <PreloaderTimer message={message}/>;
  }

  show(message = null) {
    if (!this.visible) {
      this.visible = true;
      this.obj.preloaderState = true;
      this.obj.update(true);
    }
    return 1;
  }

  showOnStart() {
    if (!this.isShowed) {
      this.isShowed = true;
      this.visible = true;
      this.obj.preloaderState = true;
      this.obj.update(true);
    }
  }

  hide(render) {
    if (this.visible) {
      this.visible = false;
      this.obj.preloaderState = false;
      this.obj.update(false);

      

      if(render === true)
        setTimeout(() => this.obj.render(), 500);
    }
    return 1;
  }
}

export default PreloaderLD;
