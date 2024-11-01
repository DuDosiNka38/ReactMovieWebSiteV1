import React, { Component, PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

import "./styles.scss";
import { Card, CardBody } from "reactstrap";

const LEFT_PAGE = "LEFT";
const RIGHT_PAGE = "RIGHT";

const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

class Pagination extends Component {
  constructor(props) {
    super(props);

    this.children = this.props.children;

    const { totalRecords = null, pageLimit = 10, pageNeighbours = 0 } = props;

    this.pageLimit = typeof pageLimit === "number" ? pageLimit : 10;
    this.fixedPageLimit = this.pageLimit;
    this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;

    this.pageNeighbours = typeof pageNeighbours === "number" ? Math.max(0, Math.min(pageNeighbours, 2)) : 0;

    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);

    this.markupPosition = this.props.markupPosition || ["bottom"];

    this.state = { currentPage: 1 };

    this.size = this.props.size || "l";

    this.onlyPages = this.props.onlyPages || false;
  }

  componentDidMount() {
    // this.gotoPage(1);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.pageLimit !== this.props.pageLimit || prevProps.totalRecords !== this.props.totalRecords) {
      this.updateState();
    }
  }

  updateState = () => {
    const { totalRecords = null, pageLimit = 30, pageNeighbours = 0 } = this.props;
    this.totalRecords = typeof totalRecords === "number" ? totalRecords : 0;
    this.pageNeighbours = typeof pageNeighbours === "number" ? Math.max(0, Math.min(pageNeighbours, 2)) : 0;
    this.children = this.props.children;

    this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);
    setTimeout(() => this.setState({ currentPage: 1 }), 1);
    setTimeout(this.render, 1);
  };

  gotoPage = (page) => {
    const { onPageChanged = (f) => f } = this.props;

    const currentPage = Math.max(0, Math.min(page, this.totalPages));

    const paginationData = {
      currentPage,
      totalPages: this.totalPages,
      pageLimit: this.pageLimit,
      totalRecords: this.totalRecords,
      name: this.props.name,
    };

    this.setState({ currentPage }, () => onPageChanged(paginationData));
  };

  setPageLimit = (limit) => {
    const { currentPage } = this.state;
    this.pageLimit = limit;
    this.updateState();
    this.gotoPage(currentPage);
  };

  handleClick = (page, evt) => {
    evt.preventDefault();
    this.gotoPage(page);
  };

  handleMoveLeft = (evt) => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage - 1);
  };

  handleMoveRight = (evt) => {
    evt.preventDefault();
    this.gotoPage(this.state.currentPage + 1);
  };

  fetchPageNumbers = () => {
    const totalPages = this.totalPages;
    const currentPage = this.state.currentPage;
    const pageNeighbours = this.pageNeighbours;

    const totalNumbers = this.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      let pages = [];

      const leftBound = currentPage - pageNeighbours;
      const rightBound = currentPage + pageNeighbours;
      const beforeLastPage = totalPages - 1;

      const startPage = leftBound > 2 ? leftBound : 2;
      const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;

      pages = range(startPage, endPage);

      const pagesCount = pages.length;
      const singleSpillOffset = totalNumbers - pagesCount - 1;

      const leftSpill = startPage > 2;
      const rightSpill = endPage < beforeLastPage;

      const leftSpillPage = LEFT_PAGE;
      const rightSpillPage = RIGHT_PAGE;

      if (leftSpill && !rightSpill) {
        const extraPages = range(startPage - singleSpillOffset, startPage - 1);
        pages = [leftSpillPage, ...extraPages, ...pages];
      } else if (!leftSpill && rightSpill) {
        const extraPages = range(endPage + 1, endPage + singleSpillOffset);
        pages = [...pages, ...extraPages, rightSpillPage];
      } else if (leftSpill && rightSpill) {
        pages = [leftSpillPage, ...pages, rightSpillPage];
      }

      return [1, ...pages, totalPages];
    }

    return range(1, totalPages);
  };

  getMarkup = () => {
    const { currentPage } = this.state;
    const pages = this.fetchPageNumbers();

    return (
      <Fragment>
        <Card className={`pagination-block size-${this.size}`}>
          <CardBody className="pagination-block-body">
            <div className={`d-flex justify-content-${this.totalPages > 1 ? "between" : "between"}`}>
              {this.totalPages > 1 && (
                <nav aria-label="Pagination">
                  <p className="mb-1 page-indicator" style={{ color: "#c1c1c1", textTransform: "uppercase" }}>
                    Page {currentPage} of {this.totalPages}
                  </p>
                  <ul className="pagination">
                    {pages.map((page, index) => {
                      if (page === LEFT_PAGE)
                        return (
                          <li key={index} className="page-item">
                            <a className="page-link" aria-label="Previous" onClick={this.handleMoveLeft}>
                              <span aria-hidden="true">&laquo;</span>
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                        );

                      if (page === RIGHT_PAGE)
                        return (
                          <li key={index} className="page-item">
                            <a className="page-link" aria-label="Next" onClick={this.handleMoveRight}>
                              <span aria-hidden="true">&raquo;</span>
                              <span className="sr-only">Next</span>
                            </a>
                          </li>
                        );

                      return (
                        <li key={index} className={`page-item${currentPage === page ? " active" : ""}`}>
                          <a className="page-link" onClick={(e) => this.handleClick(page, e)}>
                            {page}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              )}
              {!this.onlyPages && (
                <>
                  <nav aria-label="Shown_Records">
                    <p className="mb-1" style={{ color: "#c1c1c1", textTransform: "uppercase", textAlign: "center" }}>
                      Shown
                    </p>
                    <div style={{ color: "#c1c1c1", textTransform: "uppercase", textAlign: "center" }}>
                      {(currentPage - 1) * this.pageLimit + 1} -{" "}
                      {currentPage * this.pageLimit <= this.totalRecords
                        ? currentPage * this.pageLimit
                        : this.totalRecords}{" "}
                      of {this.totalRecords}
                    </div>
                  </nav>
                  <nav aria-label="Pagination Per Page">
                    <p className="mb-1" style={{ color: "#c1c1c1", textTransform: "uppercase", textAlign: "right" }}>
                      Records per page
                    </p>
                    <ul className="pagination">
                      {[
                        this.fixedPageLimit,
                        this.fixedPageLimit * 2,
                        this.fixedPageLimit * 3,
                        this.fixedPageLimit * 5,
                        this.fixedPageLimit * 7,
                        this.fixedPageLimit * 10,
                        // this.fixedPageLimit * 50,
                      ].map((x) => (
                        <>
                          <li key={x} className={`page-item${this.pageLimit === x ? " active" : ""}`}>
                            <a className="page-link" onClick={() => this.setPageLimit(x)}>
                              {x}
                            </a>
                          </li>
                        </>
                      ))}
                      {this.props.isShowAllRecordsButton && (
                        <>
                          <li
                            key="ALL_RECORDS"
                            className={`page-item${this.pageLimit === "ALL_RECORDS" ? " active" : ""}`}
                          >
                            <a className="page-link" onClick={() => this.setPageLimit("ALL_RECORDS")}>
                              All Records
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </CardBody>
        </Card>
      </Fragment>
    );
  };

  render() {
    return (
      <>
        {this.totalRecords > 0 && this.markupPosition.includes("top") && this.getMarkup()}
        {this.props ? this.props.children : null}
        {this.totalRecords > 0 && this.markupPosition.includes("bottom") && this.getMarkup()}
      </>
    );
  }
}

Pagination.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  pageLimit: PropTypes.number,
  pageNeighbours: PropTypes.number,
  onPageChanged: PropTypes.func,
};

export default Pagination;
