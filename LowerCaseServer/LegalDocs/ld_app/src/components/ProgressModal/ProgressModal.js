import React, { Component } from "react";

import "./style.scss";

class ProgressModal extends Component {
  state = {};
  render() {
    const { title, children, className } = this.props;

    return (
      <>
        <div className="okh-component">
          <div className={`progress-modal ${className}`}>
            {title && (
              <>
                <div className="progress-modal-header">
                  {title}
                </div>
              </>
            )}            
            <div className="progress-modal-body">
              {children}
            </div>
          </div>
        </div>        
      </>
    );
  }
}

export default ProgressModal;
