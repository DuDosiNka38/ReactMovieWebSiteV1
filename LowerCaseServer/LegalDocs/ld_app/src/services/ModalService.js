import React, { Component } from "react";
import { maximizeModal } from "../store/modal/actions";
import store from "./../store";

const navTo = (link, history) => {
  if(history)
  history.push(link);
}

const renderModal = (history) => {
  const { modals, display, type, displayed, minimized } = store.getState().Modal;  

  if(displayed.length === 0)
    return null;

  return (displayed.map((type) => {
    const modal = modals.find((x) => x.type === type);
    if (modal) {
      if(modal.props === undefined)
        modal.props = {};

      modal.props.isMinimized = minimized.indexOf(type) !== -1;
      modal.props.type = type;

      return (
        <>
          <modal.component {...modal.props} navTo={(link) => navTo(link, history)}/>
        </>
      );
    }
  }));

  return null;
};

export default { renderModal };
