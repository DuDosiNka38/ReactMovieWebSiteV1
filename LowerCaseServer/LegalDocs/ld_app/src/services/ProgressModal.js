import React, { Component } from "react";
import { maximizeModal } from "../store/modal/actions";
import store from "./../store";

const navTo = (link, history) => {
  if(history)
    history.push(link);
};

const renderModal = (history) => {
  const { modals, display, type, displayed } = store.getState().ProgressModal;

  if (displayed.length === 0) return null;

  return (
    <>
      <div className="okh-component">
        <div className="progress-modal-wrapper">
          {displayed.map(({_id, props, type}) => {
            const modal = modals.find((x) => x.type === type);

            if(!props) props = {};

            if(!modal) return null;

            props._info = {
              type,
              _id
            }

            return (
              <>
                <modal.component {...props} navTo={(link) => navTo(link, history)} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );

  return null;
};

export default { renderModal };
