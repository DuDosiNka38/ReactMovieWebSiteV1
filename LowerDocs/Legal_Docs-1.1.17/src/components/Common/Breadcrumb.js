import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap";



class Breadcrumbs extends Component {

    state = {
        count: 0,
    }

    clickOnTitle = this.clickOnTitle.bind(this);

    clickOnTitle(){
        if(this.state.count >= 10){
            alert('Как сказал Омар Кхуям: "Нехуй клацать где попало!"');
        }
        this.setState({count: this.state.count+1});
    }

    render() {

        const itemsLength = this.props.breadcrumbItems.length;


        return (
            <React.Fragment>
                        <Row>
                            
                            <Col xs={12}>
                                
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                    {/* <GoBack></GoBack> */}
                                    <h4 className="mb-0" onClick={this.clickOnTitle}>{this.props.title}</h4>

                                    </div>

                                    <div className="page-title-right">
                                        <Breadcrumb listClassName="m-0">
                                            {
                                                this.props.breadcrumbItems.map((item, key) =>
                                                    key+1 === itemsLength ?
                                                        <BreadcrumbItem key={key} active>{item.title}</BreadcrumbItem>
                                                    :   <BreadcrumbItem key={key} ><Link to={item.link}>{item.title}</Link></BreadcrumbItem>
                                                )
                                            }
                                        </Breadcrumb>
                                    </div>

                                </div>
                            </Col>
                        </Row>
            </React.Fragment>
        );
    }
}

export default Breadcrumbs;