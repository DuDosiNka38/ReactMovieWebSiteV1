import React, { Component } from "react";
import {
  Button,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Table,
} from "reactstrap";
import AvCheckboxGroup from "availity-reactstrap-validation/lib/AvCheckboxGroup";
import AvCheckbox from "availity-reactstrap-validation/lib/AvCheckbox";
import { AvForm, AvField } from "availity-reactstrap-validation";
import * as ModalActions from "../../store/modal/actions";
import * as CaseActions from "../../store/case/actions";
import * as PersonnelActions from "../../store/personnel/actions";
import DocsApi from "./../../api/DocsApi";
import { connect } from "react-redux";

class CalendarSelectDocuments extends Component {
  state = {
    chkBoxModel: [],
    isMainChecked: false,
    DocData: [],
  };

  toggleOne = (e) => {
    let { chkBoxModel } = this.state;
    const { checked, name } = e.currentTarget;
    const { DocData } = this.state;
    const value = parseInt(e.currentTarget.value);

    if (checked === false && chkBoxModel.indexOf(value) >= 0)
      chkBoxModel.splice(chkBoxModel.indexOf(value), 1);
    if (checked === true) chkBoxModel.push(value);

    this.setState({
      chkBoxModel: chkBoxModel,
      isMainChecked: chkBoxModel.length === DocData.length,
    });
  };

  toggleAll = (e) => {
    let { chkBoxModel } = this.state;
    const { value, checked, name } = e.currentTarget;
    const { DocData } = this.state;

    chkBoxModel = [];
    if (checked === true) {
      DocData.map((x) => {
        chkBoxModel.push(parseInt(x.DOC_ID));
      });
    }
    this.setState({ chkBoxModel: chkBoxModel, isMainChecked: checked });
  };

  componentDidMount = async () => {
    const DocData = await DocsApi.fetchCaseDocuments(this.props.Case_NAME);
    this.setState({ DocData });
  };

  render() {
    let { chkBoxModel, isMainChecked, DocData } = this.state;
    return (
      <>
        <Modal
          isOpen={true}
          centered={true}
          className="new-case-modal"
          size="xl"
          style={{ width: "800px" }}
        >
          <ModalHeader
            className="d-flex align-items-center justify-content-center"
            toggle={this.props.hideModal}
          >
            Select Documents 
          </ModalHeader>
          <ModalBody className="w-100 scrollable-modal manage-case-participants">
            <AvForm>
              <AvCheckboxGroup name="existingPersons">
                <Table className="customTable">
                  <thead>
                    <tr>
                      <td>
                        <AvCheckbox
                          customInput
                          onChange={this.toggleAll}
                          checked={isMainChecked}
                        />
                      </td>
                      <td>Document Name</td>
                      <td>Created Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {DocData.map((d) => (
                      <>
                        <tr>
                          <td>
                            <AvCheckbox
                              customInput
                              value={d.DOC_ID}
                              onChange={this.toggleOne}
                              checked={chkBoxModel.includes(d.DOC_ID)}
                            />
                          </td>
                          <td>{d.DOCUMENT_NAME}</td>
                          <td>{d.CREATED_DATE}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </AvCheckboxGroup>
            </AvForm>
          </ModalBody>
          <ModalFooter className= "mfooterGT">
            <Button className="ld-button-success mr-2" onClick={this.nextStep}>
              Submit
            </Button>
            <Button
              className="ld-button-danger"
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  hideModal: (type, props) => dispatch(ModalActions.hideModal(type, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CalendarSelectDocuments);
