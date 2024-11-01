import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth
} from "../../store/actions";
import {Button} from 'reactstrap'
import Icon from "react-icofont"
// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import * as ModalActions from "./../../store/modal/actions";
import combine from "./../../routes/combine";
import ModalService from "../../services/ModalService";
import FlexyModal from "../FlexyModal/FlaxyModal";

// import FlexyModal from "./../FlexyModal/FlaxyModal"

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  capitalizeFirstLetter = string => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if(this.props.isPreloader === true)
        {
          // document.getElementById('preloader').style.display = "block";
          // document.getElementById('status').style.display = "block";

          setTimeout(function(){ 

          // document.getElementById('preloader').style.display = "none";
          // document.getElementById('status').style.display = "none";

          }, 2500);
        }
        else
        {
          // document.getElementById('preloader').style.display = "none";
          // document.getElementById('status').style.display = "none";
        }
    }
}

  componentDidMount() {

    
    // Scroll Top to 0
    window.scrollTo(0, 0);
    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    document.title =
      currentage + " | Legal Docs";
    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }

    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }

    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }

    if (this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }
  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile);
    } else if (this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile);
    }
  };

  goToSearch = () => {
    // this.props.hideModal(this.props.type)
    // setTimeout(() => {
      let path = combine("SEARCH_PAGE");
      this.props.history.push(path);
    // }) 
  }

  render() {
    
    return (
      <React.Fragment>

        {/* {ModalService.renderModal(this.props.history)} */}
        <div id="layout-wrapper">
        <Header toggleMenuCallback={this.toggleMenuCallback} toggleRightSidebar={this.toggleRightSidebar} />
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
          />
              <div className="main-content">
                {this.props.children}
                {/* <Button className="CallSearchBtn" onClick={() => this.props.showModal('SEARCH_MODAL', {closeModal: this.goToSearch} )}>
                 <Icon icon="icofont-search-2"/>
                </Button>
                <Footer/> */}
              
              </div>
        </div>
      </React.Fragment>
    );
  }
}


const mapStatetoProps = state => {
  return {
    ...state.Layout
  };
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (type, props) => dispatch(ModalActions.showModal(type, props)),
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
  changeLayout: (p) => dispatch(changeLayout(p)),
  changeSidebarTheme: (p) => dispatch(changeSidebarTheme(p)),
  changeSidebarType: (p) => dispatch(changeSidebarType(p)),
  toggleRightSidebar: (p) => dispatch(toggleRightSidebar(p)),
  changeTopbarTheme: (p) => dispatch(changeTopbarTheme(p)),
  changeLayoutWidth: (p) => dispatch(changeLayoutWidth(p)),
  
});
export default connect(mapStatetoProps, mapDispatchToProps)(withRouter(Layout));
