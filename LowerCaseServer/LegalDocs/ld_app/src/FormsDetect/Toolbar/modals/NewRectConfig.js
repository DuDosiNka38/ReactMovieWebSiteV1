import React, { Component, createRef } from "react";
import {
  Button,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Card,
} from "reactstrap";
import { connect } from "react-redux";
import * as ModalActions from "./../../../store/modal/actions";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Icon from "react-icofont"
import Konva from "konva";

import Select from "react-select";

class NewRectConfig extends React.Component {
  state = {
    // interrapt: {
    left: null,
    right: null,
    top: null,
    bottom: null,
    // }
  };

dragableModal = createRef();




  handleChange = (e, val) => {
    const { name } = e.currentTarget;
    this.setState({ [name]: val });
  };

  handleSelectChange = (el, e) => {
    const { value } = el;
    const { name } = e;
    this.setState({ [name]: value });
    if (e.name === "interrapt") {
      switch (el.value) {
        case "left":
          this.setState({ left: "bLeft" });
          break;
        case "right":
          this.setState({ right: "bRight" });
          break;

        case "top":
          this.setState({ top: "bTop" });
          break;

        case "bottom":
          this.setState({ bottom: "bBottom" });
      }
    }
  };

  unselectInterrapt = (e, intr) => {
      const State = e
      const br = intr
      this.setState({[State]: null, [br]: null})
  }


  
  addPropsTAoRect = () => {
    const { tmpRect, toolsLayer } = this.props;
    const { alias, action, field } = this.state;
   
    // switch (action) {
    //   case "cut": this.props.setColor("red")
    //   break;
    // }

    
    tmpRect.setAttrs({
      alias: alias,
      action: action,
      field: field,
      intLeft: this.state.intLeft || null,
      intRight:this.state.intRight || null,
      intTop:this.state.intTop|| null,
      intBottom:this.state.intBottom || null,
      
    });
    
   
    // console.log(this.props.rG);
    setTimeout(() => this.props.hideModal(this.props.type));
  };



  // modalOptions = () => {
  //   let info;
  //   info = this.dragableModal.current
  //   console.log(info);
  // }

  // getCursorePos = (event) => {
  //   console.log(event.pageX+':'+event.pageY);
  // }
  

  render() {
    const { left, right, top, bottom } = this.state;
    console.log(this.dragableModal);
    const actions = [
      {
        label: "Finde",
        value: "finde",
      },
      {
        label: "Cut",
        value: "cut",
      },
      {
        label: "Interrapt",
        value: "interrapt",
      },
    ];

    const field = [
      {
        label: "Case Number",
        value: "case_number",
      },
      {
        label: "Case Name ",
        value: "case_name",
      },
      {
        label: "Form",
        value: "form",
      },
    ];
    const interrapt = [
      {
        label: "Left",
        value: "left",
      },
      {
        label: "Top ",
        value: "top",
      },
      {
        label: "Right",
        value: "right",
      },
      {
        label: "Bottom",
        value: "bottom",
      },
    ];
    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="delete-case-modal"
          size="lg"
          ref = {this.dragableModal}
          onMouseDown = {this.modalOptions}
          onMouseMove = {this.getCursorePos}
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Please add keys to created rect.
          </ModalHeader>
          <ModalBody className="w-100 confirm-modal">
            <AvForm className="">
              <FormGroup>
                <Label>Alias</Label>
                <AvField
                  type="text"
                  name="alias"
                  className="w-100"
                  onChange={this.handleChange}
                ></AvField>
              </FormGroup>
              <FormGroup>
                <Label>Action</Label>
                <Select
                  name="action"
                  options={actions}
                  onChange={this.handleSelectChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Field Name</Label>
                <Select
                  name="field"
                  options={field}
                  onChange={this.handleSelectChange}
                />
              </FormGroup>
              <div>
                <h6 className=" mb-2">Interrapt</h6>
                <Select
                  onChange={this.handleSelectChange}
                  name="interrapt"
                  options={interrapt}
                />
                <span> 

            To specify a stop point, enter unchangeable words or the Alias of the desired area.
                  </span>
                <div className="interract">
                  <div
                    className={`interrapt_BOX ${this.state.left} ${this.state.right} ${this.state.top} ${this.state.bottom} `}
                  ></div>
                {this.state.left !== null && (
                  <>
                   <FormGroup className="intLeft d-flex interractField">
                   <AvField 
                   name="intLeft"
                   onChange={this.handleChange}
                   placeholder="Interract Left"
                   className="interractInput"
                   />
                   
                     <Icon  className="fIcon" icon="icofont-delete" onClick= {() => this.unselectInterrapt("left", "intLeft")}></Icon>
               
                 </FormGroup>
                  </>
                )}
                  {this.state.right !== null && (
                  <>
                   <FormGroup className="intRight d-flex interractField">
                   <AvField 
                   name="intRight"
                   onChange={this.handleChange}
                   placeholder="Interract Right"
                   className="interractInput"
                   />
                   
                     <Icon  className="fIcon" icon="icofont-delete"  onClick= {() => this.unselectInterrapt("right", "intRight")}></Icon>
               
                 </FormGroup>
                  </>
                )}
                 {this.state.top !== null && (
                  <>
                   <FormGroup className="intTop d-flex interractField">
                   <AvField 
                   name="intTop"
                   onChange={this.handleChange}
                   placeholder="Interract Top"
                   className="interractInput"
                   />
                   
                     <Icon  className="fIcon" icon="icofont-delete"  onClick= {() => this.unselectInterrapt("top", "intTop")}></Icon>
               
                 </FormGroup>
                  </>
                )}
                 {this.state.bottom !== null && (
                  <>
                   <FormGroup className="intBottom d-flex interractField">
                   <AvField 
                   name="intBottom"
                   onChange={this.handleChange}
                   placeholder="Interract Bottom"
                   className="interractInput"
                   />
                     <Icon  className="fIcon" icon="icofont-delete"  onClick= {() => this.unselectInterrapt("bottom", "intBottom")}></Icon>
                 </FormGroup>
                  </>
                )}
                </div>
              </div>
            </AvForm>
          </ModalBody>

          <ModalFooter className="mfooterGT">
            <Button
              className="ld-button-succes"
              type="submit"
              onClick={this.addPropsTAoRect}
            >
              Submit
            </Button>
            <Button
              className="ld-button-info"
              type="button"
              onClick={this.props.hideModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(null, mapDispatchToProps)(NewRectConfig);
