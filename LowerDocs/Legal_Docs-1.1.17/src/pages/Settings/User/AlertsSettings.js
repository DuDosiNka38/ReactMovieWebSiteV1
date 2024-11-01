import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "reactstrap";
import { Range } from "react-range";
class AlersSettings extends Component {
  state = { 
    modal: false ,
    values: [1]
  
  };
  // rangeChange = this.rangeChange.bind(this);
  switch_modal = this.switch_modal.bind(this);
  switch_modal() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }
  
  render() {
    return (
      <>
        <Button
          type="button"
          color="info"
          className="waves-effect waves-light w-100"
          onClick={this.switch_modal}
        >
          Settings
        </Button>

        <Modal
          isOpen={this.state.modal}
          switch={this.switch_modal}
          centered={true}
        >
          <ModalHeader
            toggle={() => this.setState({ modal: false })}
            className="text-center"
          >
            Alert Settings
          </ModalHeader>
          <ModalBody toggle={() => this.setState({ modal: false })}>
            <h5>Warn for</h5>
         <div className="my-3">
         <Range
                step={1}
                min={0}
                max={100}
                values={this.state.values}
                onChange={(values) => this.setState({ values })}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '6px',
                      width: '100%',
                      backgroundColor: '#252b3b'
                    }}
                  >
                    {children}

                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    className="range_cstm"
                    {...props}
                    style={{
                      ...props.style,
                      height: '22px',
                      width: '22px',
                      backgroundColor: '#2490ff'
                    }}
                  >
                   <p className = "range-indecator">
                   {this.state.values.toString()}
                   </p>
                    </div>
               
                )}
              />
         </div>
          <Button color="info" className="w-100">Confirm</Button>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default AlersSettings;
