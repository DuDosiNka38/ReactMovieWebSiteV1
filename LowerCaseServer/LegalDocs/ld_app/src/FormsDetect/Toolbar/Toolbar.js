import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  CardHeader,
  FormGroup,
  Label,
} from "reactstrap";
import Select from "react-select";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { thisExpression } from "@babel/types";

class ToolBar extends Component {
  state = {};
  componentDidMount = async () => {
    const { selectedRect } = this.props;
    if (selectedRect) {
      await this.setState({ ...selectedRect });
    }

    // this.setState(...selectedRect)
  };
// showInterrapt = () => {
//   const { selectedRect } = this.props;
//   const selected = selectedRect.attrs
//   console.log(selected);
//   return (
//     <>
//       <div>
//         {/* <span>Left: {selected.intLeft ? selected.intLeft: "-"}</span> */}
//         dfdsfdsfsdfsdfsd
//       </div>
//     </>
//   )
// }


  render() {
    const { selectedRect, rrr } = this.props;
    console.log(selectedRect);

    return (
      <>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="toolbar_card d-flex">
                <span title="Save Sample" className="toolform_button" onClick={this.props.saveSample}>
                  <i className=" ri-save-3-fill font-size-16"></i>
                  Save Sample
                </span>
                <span title="Save Sample" className="toolform_button">
                  <i className="  ri-pencil-line font-size-16"></i>
                  Edit Sample
                </span>
                <span
                  title="Save Sample"
                  className="toolform_button"
                  onClick={this.props.toogleVertikalLine}
                >
                  <i
                    className=" ri-ruler-line
 font-size-16"
                  ></i>
                  Crop Line
                </span>
                <span
                  title="Save Sample"
                  className={`toolform_button ${this.props.SClass}`}
                  onClick={() => this.props.toggleAction("ADD_FRAME")}
                >
                  <i className=" ri-shape-2-fill font-size-16"></i>
                  Add Frame
                </span>

                <span
                  title=""
                  className="toolform_button"
                  onClick={this.props.deleteRect}
                >
                  Delete
                </span>
              </CardHeader>

              {rrr.length > 0 && (
                <>
                  <CardBody>
                    <AvForm className="FTF">
                      <FormGroup>
                        <Label className="smallLabel">Alias</Label>
                        <AvField
                          type="text"
                          name="alias"
                          value={selectedRect ? selectedRect.attrs.alias : ""}
                          placeholder="Select Field or Add Alias"
                        ></AvField>
                      </FormGroup>
                       
                      <FormGroup>
                        <Label className="smallLabel">Action</Label>
                        <AvField
                          type="text"
                          name="action"
                          value={ selectedRect ? selectedRect.attrs.action : ""}
                          placeholder="Select Field or Select Action "

                        ></AvField>
                      </FormGroup>
                      <FormGroup>
                        <Label className="smallLabel">Field Name</Label>
                        <AvField
                          type="text"
                          name="field_name"
                          value={selectedRect ? selectedRect.attrs.field : "" }
                          placeholder="Select Field or Select Field Name "

                        ></AvField>
                      </FormGroup>
                    


                      <FormGroup>
                        <Label className="smallLabel">Interrapt point Left</Label>
                        <AvField
                          type="text"
                          name="intLeft"
                          disabled
                          value={selectedRect&& selectedRect.attrs.intLeft ? selectedRect.attrs.intLeft : "No" }

                        ></AvField>
                      </FormGroup>
                      <FormGroup>
                        <Label className="smallLabel">Interrapt point Right</Label>
                        <AvField
                          type="text"
                          name="intLeft"
                          disabled
                          value={selectedRect&& selectedRect.attrs.intRight ? selectedRect.attrs.intRight : "No" }
                          placeholder="Select Field or Select Field Name "

                        ></AvField>
                      </FormGroup>
                      <FormGroup>
                        <Label className="smallLabel">Interrapt point Top</Label>
                        <AvField
                          type="text"
                          name="intLeft"
                          disabled
                          value={selectedRect&& selectedRect.attrs.intTop ? selectedRect.attrs.intTop : "No" }

                        ></AvField>
                      </FormGroup>
                      <FormGroup>
                        <Label className="smallLabel">Interrapt point Bottom</Label>
                        <AvField
                          type="text"
                          name="intLeft"
                          disabled
                          value={selectedRect&& selectedRect.attrs.intBottom ? selectedRect.attrs.intBottom  : "No" }

                        ></AvField>
                      </FormGroup>
                    </AvForm>
                  </CardBody>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

export default ToolBar;
