import { Component } from "react";


class AlreadyUploaded extends Component{
    state = {};

    render(){
        return <></>
    }
}

const mapStateToProps = (state) => {
    return {
      getGlobal: state.User.globalData,
      personeData: state.User.persone,
    };
  };
  const mapDispatchToProps = (dispatch) => {
    return {
      onGlobalLoad: () => dispatch(actions.getGlobalData()),
    };
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(AlreadyUploaded);