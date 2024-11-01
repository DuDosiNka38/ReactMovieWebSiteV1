import React, { Component } from 'react';
import PageFilters from "../../components/FormComponents/PageFilters/PageFilters";
class SearchForm extends React.Component {
  render() { 
    const PageFilterComponents = {
      Search: {
        placeholder: "ex. My First Document",
        SearchFields: [
          { value: "DOCUMENT_NAME", label: "Document Name", isChecked: true, isDisabled: true },
          { value: "DOCUMENT_KEYWORDS", label: "Document Keywords" },
          { value: "Case_NAME", label: "Case Name" },
          { value: "Person_id", label: "Person_id" },
        ],
      },
      
      OrderBy: {
        name: "Order_By",
        options: [
          { value: "DOC_ID", label: "Doc Id" },
          { value: "DOCUMENT_NAME", label: "Document Name" },
          { value: "CREATED_DATE", label: "Created Date" },
          { value: "FILED_DATE", label: "Filed Date" },
        ],
        value: "CREATED_DATE",
        label: "Order By",
        col: 3,
      },
      
    };
    return (
      <>
        <PageFilters components={PageFilterComponents} />
      </>
    );
  }
}
 
export default SearchForm;