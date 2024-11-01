import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { } from "../../store/actions";

//Simple bar
import SimpleBar from "simplebar-react";

import SidebarContent from "./SidebarContent";
import HostManager from "./../../components/HostManager/HostManager"

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <React.Fragment>
                <div className="vertical-menu">
                    <div data-simplebar className="h-100">
                        {this.props.type !== "condensed" ? (
                            <SimpleBar style={{ height: "100%",maxHeight: "100%" }}>
                                <SidebarContent />
                                <HostManager isSidebar={true}/>
                            </SimpleBar>
                        ) : 
                        <><SidebarContent />
                        <HostManager isSidebar={true}/>
                        </>}
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

const mapStatetoProps = state => {
    return {
        layout: state.Layout
    };
};
export default connect(mapStatetoProps, {})(withRouter(Sidebar));
