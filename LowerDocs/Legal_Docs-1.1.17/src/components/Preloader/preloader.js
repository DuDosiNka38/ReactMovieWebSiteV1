import React, { Component } from "react";
// import loader from './../../assets/images/dargsvg.svg'
import loader from './../Loader/loadercss.svg'

import SVG, { Props as SVGProps } from 'react-inlinesvg';
// const Logo = React.forwardRef<SVGElement, SVGProps>((props, ref) => (
//   <SVG innerRef={ref} title="MyLogo" {...props} />
// ));
class Preloader extends Component {
  state = {};

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) this.render();
  }

  render() {
    return (
      <>
        <div id="preloader">
          <div className="loader-holder">
            {/* <div className="loader">
              <span>L</span>
              <span>o</span>
              <span>a</span>
              <span>d</span>
              <span>i</span>
              <span>n</span>
              <span>g</span>
            </div> */}
            {/* {loader}   */}

            <object className="loader_Obj" data={loader}></object>

            


          </div>
          {/* <div id="status">
                <div className="spinner">
                  <i className="ri-loader-line spin-icon"></i>
                </div>
              </div> */}
        </div>
      </>
    );
  }
}

export default Preloader;
