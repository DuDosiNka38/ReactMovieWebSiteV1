import React, { Component } from "react";
import ChangePassword from "../Authentication/ChangePassword";
import LoginForm from "./LoginForm";
import axios from "./../../services/axios";
import noteWindow from "./../../services/notifications";
import sysInfo from "./../../electron/services/sysInfo";
import Core from "./../../electron/services/core";
import * as actions from "./../../store/user/actions";

import { Row, Col, Container, Button } from "reactstrap";

// Redux
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";

// import images
import logo from "./../../assets/images/logo-dark.png";
import PreloaderLD from "./../../services/preloader-core";
import { ipcRenderer } from "electron";
let fileReader;

let isSysInfoLoaded = false;



class Login extends Component {
  constructor(props) {
    super(props);
    this.Preloader = new PreloaderLD(this);
    this.state = {
      computer: {
        Computer_id: null,
        Mac_Address: null,
        Computer_type: null,
        OS: null,
        RSA_KEY: null,
        Computer_user: null,
      },
      user_email: "",
      user_password: "",
      user_confirmPassword: "",
      keyfile: "",
      uploadKey: false,
      showPasswords: false,
      logged_first: false,
      // redirect: null,
      downloadKey: false,
      keyFilePath: null,
      Display: true,
      Load_message: "Loading...",
      update:false,
    };
    this.checkUser = this.checkUser.bind(this);
    this.userSetNewPassword = this.userSetNewPassword.bind(this);
  }

  setComputerData() {
    if (!sysInfo.isLoad()) {
      setTimeout(this.setComputerData(), 1000);
    } else {
      const { computer } = this.state;
      const i = sysInfo.get();

      computer.Computer_id = i.os.hostname;
      computer.Computer_type = "CLIENT";
      computer.Computer_user = i.os.hostname;
      computer.OS = i.os.platform;
      computer.Mac_Address = i.uuid.macs[0];

      console.log(computer);

      this.setState({
        computer: computer,
      });
    }
  }
  componentDidMount() {
    this.setComputerData();
    // ipcRenderer.send("getSysInfo", {});
    // ipcRenderer.on("getSysInfo", (event, args) => {
    //   console.log(args)
    //   isSysInfoLoaded = true;
    // });
    
    this.Preloader.hide();
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.update !== prevState.update){
      this.setState({update: !prevState.update});
      this.render();
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("auth-body-bg");
  }

  approveComputer = (sec, callBack) => {
    this.setState({ Load_message: `Auto update after: ${sec} seconds` });
    if (sec > 0) {
      setTimeout(() => this.approveComputer(sec - 1, callBack), 1000);
    } else {
      this.setState({ Load_message: `Updating...` });
      callBack();
    }
  };

  async checkUser(event, user) {
    this.Preloader.show();
    this.setState({ user_email: user.user_email });
    const response = await axios.post("/api/auth/open", {
      Email_address: user.user_email,
      Password: user.user_password,
      cInfo: this.state.computer,
    });
    if (response.data.result) {
      this.setState({ user_email: user.user_email });
      this.setState({ user_password: user.user_password });

      if (response.data.hasOwnProperty("result_data")) {
        if (response.data.result_data.hasOwnProperty("logged_at_first")) {
          if (response.data.result_data.logged_at_first) {
            this.setState({ showPasswords: true });
            this.Preloader.hide();            
            this.setState({update: !this.state.update});
          } else {
            Core.setHash(response.data.hash);
            this.props.onGlobalLoad();
            // setTimeout(() => this.props.history.push("/home"), 500);
          }
        } else {
          console.log("Error");
        }
      } else {
        Core.setHash(response.data.hash);
        this.props.onGlobalLoad();            
        // setTimeout(() => this.props.history.push("/home"), 500);

      }
    } else {
      // setTimeout(() => this.Preloader.hide(true), 300);
      this.Preloader.hide();
      if (
        response.data.hasOwnProperty("result_data") &&
        response.data.result_data.hasOwnProperty("result_error_code")
      ) {
        const code = response.data.result_data.result_error_code;

        switch (code) {
          case "NOT_APPROVED_COMPUTER":
            this.setState({NOT_APPROVED_COMPUTER: true})
            this.approveComputer(10, () => {
              this.checkUser(event, user);
            });
            break;

          case "USER_IS_NOT_EXIST":
            this.setState({update: !this.state.update});
            noteWindow.isError(response.data.result_data.result_error_text);
            break;

          case "USER_WITH_TYPED_EMAIL_IS_NOT_EXIST":
            this.setState({update: !this.state.update});
            noteWindow.isError(response.data.result_data.result_error_text);
            break;

          default:
            this.setState({update: !this.state.update});
            break;
        }
      } else {
        if (
          response.data.hasOwnProperty("result_data") &&
          response.data.result_data.hasOwnProperty("result_error_text")
        ) {
          noteWindow.isError(response.data.result_data.result_error_text);
        } else {
          console.log(
            'response.data.hasOwnProperty("result_data")',
            response.data.hasOwnProperty("result_data")
          );
          console.log(
            'response.data.result_data.hasOwnProperty("result_error_text")',
            response.data.result_data.hasOwnProperty("result_error_text")
          );
        }
      }
    }
  }
  async userSetNewPassword(event, user) {
    this.Preloader.show();
    this.setState({update: !this.state.update});
    const response = await axios.post("/api/auth/setNewPassword", {
      Email_address: this.state.user_email,
      Password: user.password,
      cInfo: this.state.computer,
    });
    if (response.data.result) {
      Core.setHash(response.data.hash);
      this.props.onGlobalLoad();
      this.props.history.push("/usersmanagement");
      this.Preloader.show();
      this.setState({update: !this.state.update});
      // window.history.pushState(null, null, '/home');
    } else if (response.data.result_data.hasOwnProperty("result_error_text")) {
      this.Preloader.hide();
      this.setState({update: !this.state.update});
      noteWindow.isError(response.data.result_data.result_error_text);
    } else {
    }
  }

  handleFileRead = (event) => {
    const content = fileReader.result;
    this.setState({ keyfile: content });
  };

  handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onloadend = () => {
      this.checkUserSecretKey(this, fileReader);
    };
  };

  render() {
    this.Preloader.showOnStart();

    // if(!isSysInfoLoaded)
    //   return <>{this.Preloader.get()}</>;

    if(this.state.hasOwnProperty("NOT_APPROVED_COMPUTER") && this.state.NOT_APPROVED_COMPUTER === true)
      return this.Preloader.getWait(this.state.Load_message);
    return (
      <React.Fragment> 
        {this.Preloader.get()}
        <Container fluid className="p-0">
          <Row className="no-gutters">
            <Col lg={12}>
              <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                <div className="w-100">
                  <Row className="justify-content-center">
                    <Col lg={4} offset={4}>
                      <div>
                        <div className="text-center">
                          <div>
                            <Link to="/" className="logo logo-dark-d">
                              <img src={logo} height="40" alt="logo" />
                            </Link>
                          </div>
                        </div>

                        <div className="p-2 mt-2">
                          {(this.state.downloadKey === true && (
                            <>
                              <div className="mt-4 text-center">
                                <h4 className="font-size-18 my-4 text-center">
                                  Download your access key file
                                  <p className="d-none">suka</p>
                                </h4>

                                <Button
                                  color="info w-100"
                                  href={`/${this.state.keyFilePath}`}
                                  download
                                  target="target_blank"
                                  onClick={this.loginUser}
                                >
                                  Download your key
                                </Button>
                              </div>
                            </>
                          )) ||
                            (this.state.showPasswords === false && (
                              <>
                                <h4 className="font-size-18 my-4 text-center">
                                  Welcome!
                                </h4>
                                <LoginForm
                                  data={this.state.uploadKey}
                                  user_email={this.state.user_email}
                                  user_password={this.state.user_password}
                                  checkUser={this.checkUser}
                                  sucsessKay={this.state.keyfile}
                                  handleFileChosen={this.handleFileChosen}
                                />
                              </>
                            )) ||
                            (this.state.showPasswords === true && (
                              <>
                                <ChangePassword
                                  user_email={this.state.user_email}
                                  user_password={this.state.user_password}
                                  user_confirmPass={this.user_confirmPassword}
                                  userSetNewPassword={this.userSetNewPassword}
                                  checkPass={this.state.handleChange}
                                />
                              </>
                            ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { loginError } = state.Login;
  return { loginError };
};

const mapDispatchToProps = (dispatch) => ({
  onGlobalLoad: () => dispatch(actions.getGlobalData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
