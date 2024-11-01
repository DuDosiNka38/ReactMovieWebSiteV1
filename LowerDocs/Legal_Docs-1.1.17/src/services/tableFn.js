//SEARCH ANG PAG
tableSearch = (e) => {
  const { name, value } = e.currentTarget;
  this.setState({ tableSearch: value });
};

clearSearch = () => {
  this.setState({ tableSearch: "" });
};

searchFilter = (data) => {
  const { tableSearch, searchFields } = this.state;

  if (tableSearch === "") return data;

  const needle = tableSearch.toLowerCase();

  return data.filter((x) => {
    let result = false;

    for (let k in x) {
      if (
        typeof x[k] === "string" &&
        searchFields["Uploaded_files"].includes(k)
      ) {
        const tmp = x[k].toLowerCase();
        if (tmp.indexOf(needle) !== -1) {
          result = true;
        }
      }
    }

    return result;
  });
};

getPageRows = (name, data) => {
  let { tablePagination, order } = this.state;
  let RESULT = data;

  if (tablePagination.hasOwnProperty(name) && data.length > 10) {
    const { offset, pageLimit } = tablePagination[name];

    RESULT = RESULT.slice(offset, offset + pageLimit);
  }

  return RESULT;
};

onPageChanged = (data) => {
  let { tablePagination } = this.state;
  const { currentPage, totalPages, pageLimit, name } = data;
  const offset = (currentPage - 1) * pageLimit;

  tablePagination[name] = {
    currentPage: currentPage,
    offset: offset,
    totalPages: totalPages,
    pageLimit: pageLimit,
  };

  this.setState({ tablePagination: tablePagination });
};

orderBy = (e) => {
  let { order } = this.state;
  const name = e.hasOwnProperty("name")
    ? e.name
    : e.currentTarget.getAttribute("name");
  const orderField = e.hasOwnProperty("value")
    ? e.value
    : e.currentTarget.getAttribute("value");

  if (!order.hasOwnProperty(name)) {
    order[name] = { orderField: orderField, orderType: "ASC" };
  }

  if (order[name].orderField === orderField) {
    order[name].orderType = order[name].orderType === "ASC" ? "DESC" : "ASC";
  } else {
    order[name].orderField = orderField;
    order[name].orderType = "ASC";
  }

  if (order.hasOwnProperty(name)) {
    let RESULT = this.state[name];

    if (RESULT !== null) {
      const { orderType, orderField } = order[name];

      if (orderType === "ASC")
        RESULT = RESULT.sort((a, b) => {
          if (a[orderField] !== null && b[orderField] !== null) {
            return a[orderField] > b[orderField] ? 1 : -1;
          }
          if (a[orderField] === null && b[orderField] !== null) {
            return -1;
          }
          if (a[orderField] !== null && b[orderField] === null) {
            return 1;
          }
          if (a[orderField] === null && b[orderField] === null) {
            return 1;
          }
        });

      if (orderType === "DESC")
        RESULT = RESULT.sort((a, b) => {
          if (a[orderField] !== null && b[orderField] !== null) {
            return a[orderField] < b[orderField] ? 1 : -1;
          }
          if (a[orderField] === null && b[orderField] !== null) {
            return 1;
          }
          if (a[orderField] !== null && b[orderField] === null) {
            return -1;
          }
          if (a[orderField] === null && b[orderField] === null) {
            return 1;
          }
        });

      this.setState({ [name]: RESULT });
    }
  }

  this.setState({ order: order });
};

getOrderArrow = (name, field) => {
  const { order } = this.state;

  if (!order.hasOwnProperty(name) || order[name].orderField !== field)
    return null;

  const { orderType } = order[name];

  if (orderType === "ASC")
    return (
      <>
        <i class="ri-sort-asc"></i>
      </>
    );

  if (orderType === "DESC")
    return (
      <>
        <i class="ri-sort-desc"></i>
      </>
    );

  return null;
};
//SEARCH ANG PAG ENDS
