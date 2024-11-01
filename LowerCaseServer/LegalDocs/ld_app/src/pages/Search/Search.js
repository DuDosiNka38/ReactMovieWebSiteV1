import React, { Component } from 'react';
import {Container, Row, Col} from "reactstrap";
import SearchForm from '../../components/Search/SearchForm';
import PageHeader from "./../../components/PageHader/PageHeader"


class Search extends React.Component {
  render() { 
    return  (
      <>
          <div className="page-content">
          <Container fluid>
            <PageHeader>Search</PageHeader>
            <Row>
              <SearchForm></SearchForm>
              </Row>
          </Container>
        </div>
      </>
    )
   
  }
}
 
export default Search;