import React, { Component } from "react";

import loader from './../Loader/loadercss.svg'
import background from './../../assets/images/logosvg.svg'

import * as PreloaderActions from '../../store/preloader/actions';
import { connect } from "react-redux";
class Preloader extends Component {
  state = {};

  render() {
    const { display } = this.props; 

    if(display){
      return (
        <>
          <div id="preloader">
            <div className="loader-holder">
              <div className="loader-block">
                <object className="loader_bg" data={background}></object>
                <object className="loader_Obj" data={loader}></object>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state) => ({
  ...state.Preloader
});

const mapDispatchToProps = (dispatch) => ({
  show: (caller) => dispatch(PreloaderActions.showPreloader(caller)),
  hide: (caller) => dispatch(PreloaderActions.hidePreloader(caller)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Preloader);
