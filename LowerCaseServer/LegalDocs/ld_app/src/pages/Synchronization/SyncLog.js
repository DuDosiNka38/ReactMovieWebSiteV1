import React, { Component, Suspense, lazy } from "react";
import { Container, Card, CardBody, Row, Col, Button } from "reactstrap";
import SyncApi from "./../../api/SyncApi";
import ComputersApi from "./../../api/ComputersApi";
import TrotlingBlocks from "./../../components/StyledComponents/TrotlingBlocks";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHader/PageHeader";

class SyncLog extends Component {
  state = {
    Syncs:[],
    Folders:[], 
    
    isInit: false,
  };

  componentDidUpdate = async (prevProps, prevState) => {
    if(!this.state.isInit){
      const { User, sysInfo } = this.props;

      let Syncs = await SyncApi.fetchUserSynchronizations(User.Person_id);
      let Folders = await SyncApi.fetchUserSyncFolders(
        User.Person_id,
        sysInfo.os.hostname
      );
      this.setState({ Syncs, Folders });
    }
    
  };

  render() {
    const { Syncs, Folders } = this.state;
    if (!(Syncs || Folders)) return <></>;
    // log
    return (
      <>
        <div className="page-content">
          <Container fluid>
            <PageHeader>Synchronization History</PageHeader>
            <Row>
              <Col lg={6}>
                <Card>
                  <CardBody className="p-0">
                    <div className="gridTable ">
                      <div className="capture">Synchronization</div>
                      <div className="gThead_row">
                        <div className="gT_row_item">Person</div>
                        <div className="gT_row_item">Computer</div>
                        <div className="gT_row_item">Status</div>
                        <div className="gT_row_item">Date</div>
                      </div>
                      {Syncs.map((x, i ) => (
                        <div className="gTbody_row" key = {i} row = {i}>
                        <div className="gT_row_item">{x.Person_id}</div>
                        <div className="gT_row_item">{x.Computer_id}</div>
                        <div className="gT_row_item success">{x.Status}</div>
                        <div className="gT_row_item">{x.Sync_Time}</div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <CardBody className="p-0">
                    <div className="gridTable RW">
                      <div className="capture">Folders</div>
                      <div className="gThead_row">
                        <div className="gT_row_item">Person</div>
                        <div className="gT_row_item">Computer</div>
                        <div className="gT_row_item">Path</div>
                        <div className="gT_row_item">Modified date</div>
                      </div>
                      {Folders.map((x, i ) => (
                        <div className="gTbody_row" key = {i} row = {i}>
                        <div className="gT_row_item">{x.Person_id}</div>
                        <div className="gT_row_item">{x.Computer_id}</div>
                        <div className="gT_row_item success">{x.Path}</div>
                        <div className="gT_row_item">{x.Modified_date}</div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  // hidePreloader: (type) => dispatch(PreloaderActions.hidePreloader(type)),
});

const mapStateToProps = (state) => ({
  User: state.User.data,
  sysInfo: state.Main.system,
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncLog);
