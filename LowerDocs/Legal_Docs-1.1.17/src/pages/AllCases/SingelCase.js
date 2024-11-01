import React, { Component } from "react";
import { Media, Card, CardBody } from "reactstrap";
import { NavLink, Route, Switch} from "react-router-dom";
import ReactTooltip from 'react-tooltip';
    

class SingelCase extends Component {
  state = {
    showInfo: false
  };
  render() {
    let showInfo = this.state.showInfo;
    if(this.props.hasOwnProperty("showInfo"))
      showInfo = this.props.showInfo;


    return (
      <>
          <Card
            className={this.props.class}
            style={{ borderRight: `5px solid ${this.props.bg}` }}
          >
            <CardBody className={this.props.cclass, this.props.clN} data-tip={this.props.caseName}>
              <Media className="d-flex">
                <div className="text-primary">
                </div>
                <span className={`badge-soft-primary mr-1 badge badge-secondary font-size-16 customCase d-flex`} style={{width:"100%"}} title={this.props.caseName}>
                
                  
                  <NavLink to={`/app/case-explorer/single-case/${this.props.shortName}`} style={{
                    maxWidth: "100%",
                    paddingRight: showInfo ? "25px" : 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {this.props.caseName}
                  </NavLink>
                  {showInfo && 
                    <>
                      <NavLink to={`caseinfo/${this.props.shortName}`}>
                        <div
                          style={{
                            
                            display: "inline-block",
                            textAlign: "center",
                            float: "right",
                            position: "relative",
                            zIndex: "999"
                          }}
                        ><i style={{
                          color: "#fff",
                          borderRadius: "50%",
                          background: this.props.bg,
                        }}class=" ri-information-line font-size-20 mr-1  auti-custom-input-icon "></i></div>
                      </NavLink>
                    </>
                  }
                  
                </span>
              </Media>
            </CardBody>
            <ReactTooltip />
          </Card>
      </>
    );
  }
}

export default SingelCase;
