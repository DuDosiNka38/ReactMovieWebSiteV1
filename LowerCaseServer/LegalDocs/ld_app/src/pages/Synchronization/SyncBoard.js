import React, { Component, Suspense } from "react";
import { Card, CardBody, CardHeader, Container, Spinner } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHader/PageHeader";
import SyncApi from "../../api/SyncApi";
import CountDown from "../../services/CountDown";

class SyncBoard extends Component {
  state = {
    loadParseInfo: false,

    ParseInfo:[],
    FileParseInfo: [],
    ParseInfoCounter: 0,

    countDown: null,
  };

  fetchParseInfo = async () => {
    const { countDown, ParseInfoCounter} = this.state;
    const ParseInfo = await SyncApi.fetchUserParseInfo(this.props.User.Person_id); 
    const filter = ["ORIGINAL_EXT", "REMOVE_FILES", "TMP"];
    const filtered = [];
    ParseInfo.map((x) => {
      if(!filter.includes(x.Step_Key))
        filtered.push(x);
    });

    this.setState({ParseInfo:filtered, ParseInfoCounter: ParseInfoCounter + 1 });    
  }

  fetchFileParseInfo = async () => {
    const FileParseInfo = await SyncApi.fetchFileParseInfo(); 
    this.setState({FileParseInfo});  
  }

  componentDidMount() {
    const countDown = new CountDown();
    this.setState({ countDown });  
    this.fetchFileParseInfo();  
  }
  

  componentDidUpdate(prevProps, prevState) {
    if(this.props.User !== prevProps.User){
      this.fetchParseInfo();
    }

    if(this.state.ParseInfoCounter !== prevState.ParseInfoCounter){
      this.state.countDown.runCountdown(5, (sec, obj) => {
        // console.log({sec})
      }, async () => {
        this.setState({loadParseInfo: true});
        await this.fetchParseInfo();
        await this.fetchFileParseInfo();
        this.setState({loadParseInfo: false});
      });
    }
  }

  componentWillUnmount() {
    const { countDown } = this.state;
    countDown.stopCountdown();
  }
  

  render() {
    const { loadParseInfo, ParseInfo, FileParseInfo } = this.state;
    console.log({FileParseInfo})
    
    return (
      <>
        <div className="page-content">
          <Container fluid className="pageWithSearchTable">
            <PageHeader>Synchronization Info Board</PageHeader>
            <Card>
              <CardHeader className="coloredCardHeader">
                <div className="d-flex align-items-center justify-content-between">
                  <h4 className="h4">
                  Parsing Queue Of Files, Which will be Available To You After Ends</h4>
                  <div className="d-flex align-items-center justify-content-between">
                    {/* <Button
                      className="d-flex align-items-center okh_button_classic text-uppercase ml-2"
                      onClick={() => this.props.showModal("MANUAL_SYNC")}
                    >
                      <i className="ri-add-line"></i> New Synchronization
                    </Button> */}
                    {loadParseInfo && (
                      <>
                        <Spinner size="sm" style={{color: "#fff"}}/>
                      </>
                    )}
                    
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <div className="sync-info-blocks sync-page">
                  {ParseInfo.length ? (
                    <>
                      {ParseInfo.map((x) => (
                        <>
                          <div className="sync-info-block">
                            <div className="block-icon">
                              <i className="ri-folders-line"></i>
                            </div>
                            <div className="block-info">
                              <div className="title">{x.Step_Desc}</div>
                              <div className="value">{x.Count}</div>
                            </div>
                          </div>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-center justify-content-center p-4">
                        <Spinner size="m"/>
                      </div>
                    </>
                  )}
                  
                  
                  
                </div>
                <div className="">
                    {FileParseInfo.filter((x) => x.File_id !== null).map((p) => {

                      return (
                        <>
                          <div className="m-2 p-2 fileParsingProcessBlock">
                            <div className="fileName font-weight-bold">{p.File_name}</div>
                            <div className="stepKey">{p.Step_Info.Step_Desc}</div>
                            <div className="fileSize">Pages: {p.meta?.find((x) => x.Name === "pages")?.Value}</div>
                            <div className="startTime">Start at: {(new Date(p.Start_Time)).toLocaleString()}</div>
                          </div>
                        </>
                      )
                    })}
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  User: state.User.data,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SyncBoard);
