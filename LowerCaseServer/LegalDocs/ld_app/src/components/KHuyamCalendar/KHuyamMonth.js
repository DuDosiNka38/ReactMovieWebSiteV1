import { months } from "moment";
import React from "react";
import { Button, Label } from "reactstrap";
const moment = require("moment");

const { cols, rows, weekDaysNames } = require("./params.js");
class KHuyamMonth extends React.Component {
  state = {
    events: [],

    _selectedDate: null,
    _onMouseDownDate: null,
    _selectedRange: null,

    _isCtrlKeyDown: false,
  };

  getMonthWrapper = (
    { monthBody, monthDate } = {
      monthBody: "",
      monthDate: null,
    }
  ) => {
    const { switchCalendarView } = this.props;

    function getPrevMonth(monthDate) {
      return moment(monthDate).subtract(1, "month");
    }

    function getNextMonth(monthDate) {
      return moment(monthDate).add(1, "month");
    }

    const prevMonth = !monthDate ? null : getPrevMonth(monthDate);
    const nextMonth = !monthDate ? null : getNextMonth(monthDate);
    return (
      <>
        <div className="monthBlock unselectableText">
          <div
            className="calendarMonthHeader d-flex justify-content-between align-items-center"
            // onClick={() => this.onMonthNameClick(monthDate)}
          >
            <div className="d-flex backView">
              <Button onClick={switchCalendarView} className="backToYear d-flex align-items-center">
                <i class="ri-arrow-left-s-line"></i> Back
              </Button>
            </div>
            <div className="d-flex monthSelector">
              {monthDate && (
                <>
                  <div
                    onClick={() =>
                      switchCalendarView("month", { monthDate: prevMonth })
                    }
                    className="prevMonthName d-flex align-items-center"
                  >
                    <i class="ri-arrow-left-s-line"></i>{" "}
                    {prevMonth.format("MMMM, YYYY")}
                  </div>
                </>
              )}

              <div className="monthCalendarName">
                {" "}
                {moment(monthDate).format("MMMM, YYYY")}
              </div>

              {monthDate && (
                <>
                  <div
                    onClick={() =>
                      switchCalendarView("month", { monthDate: nextMonth })
                    }
                    className="nextMonthName d-flex align-items-center"
                  >
                    {" "}
                    {nextMonth.format("MMMM, YYYY")}{" "}
                    <i class="ri-arrow-right-s-line"></i>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="monthGridCalendar">{monthBody}</div>
        </div>
      </>
    );
  };
  getMonthHeaderCell = ({ cellBody } = { cellBody: "" }) => {
    return (
      <div
        className="calendarDaysHeaders"
        style={{
          padding: "8px",
        }}
      >
        {cellBody}
      </div>
    );
  };
  getMonthCell = (
    { dateMoment, dateEvents } = { dateMoment: moment(), dateEvents: null }
  ) => {
    const { _selectedRange, _selectedDate } = this.state;

    // ${!dateMoment ? "DOnOTsHOW " : "dateGridItem"}
    return (
      <div
        class={`
          dateGridItem
          ${
            this.isCurrentDate(new Date(dateMoment?.format()))
              ? "isCurrentDay "
              : ""
          }
          ${
            this.isSelectedDate(new Date(dateMoment?.format()))
              ? "selectedCalendarDay "
              : ""
          }
          ${dateEvents?.length ? "hasCalendarEvents " : ""}
          ${!dateMoment ? "emptyCell " : ""}
          ${
            this.isInEntriesRange(new Date(dateMoment?.format())) &&
            !_selectedDate
              ? "selectedCalendarRange "
              : ""
          }
          ${
            this.isRangeStartDate(new Date(dateMoment?.format())) &&
            _selectedRange[1]
              ? _selectedRange[0] < _selectedRange[1]
                ? "selectedCalendarRange_startDate "
                : "selectedCalendarRange_endDate "
              : ""
          }
          ${
            this.isRangeEndDate(new Date(dateMoment?.format())) &&
            _selectedRange[1]
              ? _selectedRange[0] < _selectedRange[1]
                ? "selectedCalendarRange_endDate "
                : "selectedCalendarRange_startDate "
              : ""
          }
        `}
        onMouseDown={dateMoment ? () => this.onDateMouseDown(dateMoment) : null}
        onMouseUp={dateMoment ? () => this.onDateMouseUp(dateMoment) : null}
        onMouseMove={dateMoment ? () => this.onDateMouseMove(dateMoment) : null}
      >
        <div className="dateNumber">{dateMoment?.date() || "0"}</div>
      </div>
    );
  };
  getMonthRow = (value) => {
    return <div className="monthRowCalendarGrid">{value}</div>;
  };
  getDaysNames = () => {
    let calendarDaysNames = [];

    //Render
    for (let c = 0; c < cols; ++c) {
      calendarDaysNames.push(
        this.getMonthHeaderCell({ cellBody: weekDaysNames[c] })
      );
    }

    return this.getMonthRow(calendarDaysNames);
  };

  setDateRange = (dateMoment) => {
    let { _onMouseDownDate } = this.state;

    if (!_onMouseDownDate) {
      this.setState({
        _onMouseDownDate: new Date(dateMoment?.format()),
        _selectedRange: [Date.parse(dateMoment), null],
      });
      return;
    }

    if (Date.parse(_onMouseDownDate) === Date.parse(dateMoment?.format()))
      return;

    this.setState({
      _selectedRange: [
        Date.parse(_onMouseDownDate),
        Date.parse(dateMoment?.format()),
      ],
      // _isCtrlKeyDown: false,
    });
  };

  isCurrentDate = (date = new Date()) => {
    return moment().format("L") === moment(date).format("L");
  };
  isSelectedDate = (date = new Date()) => {
    const { _selectedDate } = this.state;

    return (
      moment(new Date(_selectedDate)).format("L") ===
      moment(new Date(date)).format("L")
    );
  };
  isInEntriesRange = (date = new Date()) => {
    const { _selectedRange } = this.state;

    if (!_selectedRange) return false;

    if (!_selectedRange[1]) return _selectedRange[0] === date.getTime();

    if (_selectedRange[0] < _selectedRange[1])
      return (
        _selectedRange[0] <= date.getTime() &&
        date.getTime() <= _selectedRange[1]
      );
    else
      return (
        _selectedRange[1] <= date.getTime() &&
        date.getTime() <= _selectedRange[0]
      );
  };
  isRangeStartDate = (date = new Date()) => {
    const { _selectedRange } = this.state;

    if (!_selectedRange) return false;

    return _selectedRange[0] === date.getTime();
  };
  isRangeEndDate = (date = new Date()) => {
    const { _selectedRange } = this.state;

    if (!_selectedRange) return false;

    return _selectedRange[1] === date.getTime();
  };
  getDateEvents = (date = new Date()) => {
    const { events } = this.state;

    const filteredEvents = events?.filter(
      (event) =>
        moment(new Date(event.date)).format("L") === moment(date).format("L")
    );
    return { events: filteredEvents, length: filteredEvents.length };
  };

  generateMonth = (monthDate = new Date()) => {
    const year = moment(monthDate).year();
    const month = moment(monthDate).month();
    const firstMonthDay = moment(monthDate).weekday();
    const monthDays = moment(monthDate).daysInMonth();

    let tableRows = [];
    let renderDateNumber = 1 - firstMonthDay;

    //Add Month Days Names
    tableRows.push(this.getDaysNames());

    //Generate Month Body
    for (let r = 0; r < rows; ++r) {
      let tableCols = [];
      let isEmptyRow = true;

      for (let c = 0; c < cols; ++c) {
        let dateMoment = null;
        let dateEvents = null;

        if (renderDateNumber > 0 && renderDateNumber <= monthDays) {
          isEmptyRow = false;
          const renderDate = new Date(year, month, renderDateNumber);
          dateMoment = moment(renderDate);
          dateEvents = this.getDateEvents(renderDate);
        }

        tableCols.push(
          this.getMonthCell({
            dateMoment,
            dateEvents,
          })
        );
        renderDateNumber++;
      }

      if (!isEmptyRow) tableRows.push(this.getMonthRow(tableCols));
    }

    return this.getMonthWrapper({
      monthBody: tableRows,
      monthDate,
    });
  };
  generateMonthCalendar = ({ monthDate } = { monthDate: new Date() }) => {
    return this.generateMonth(monthDate);
  };

  //Handlers
  onDismissClick = () => {
    const { _selectedDate, _selectedRange, _onMouseDownDate, _isCtrlKeyDown } =
      this.state;

    if (_isCtrlKeyDown) return;

    // if(_selectedDate) this.setState({_selectedDate: null});

    if (_selectedRange && !_onMouseDownDate)
      this.setState({ _selectedRange: null });
  };
  onDateMouseDown = (dateMoment) => {
    console.log({ dateMoment });
    const { _isCtrlKeyDown } = this.state;
    if (_isCtrlKeyDown) {
      this.setDateRange(dateMoment);
      return;
    }

    const _onMouseDownDate = new Date(dateMoment?.format());
    this.setState({
      _onMouseDownDate,
      _selectedRange: null,
    });
  };
  onDateMouseUp = (dateMoment) => {
    const { _isCtrlKeyDown } = this.state;
    if (_isCtrlKeyDown) return;

    if (!dateMoment) return;

    const { _onMouseDownDate, _selectedRange } = this.state;

    const currentDate = new Date(dateMoment?.format());
    if (
      _onMouseDownDate?.getTime() === currentDate.getTime() ||
      !_selectedRange ||
      !_selectedRange[1]
    ) {
      setTimeout(() => {
        this.setState({
          _selectedDate: _onMouseDownDate,
          _onMouseDownDate: null,
          _selectedRange: null,
        });
      }, 1);
    }

    setTimeout(() => {
      this.setState({
        _onMouseDownDate: null,
      });
    }, 1);
  };
  onDateMouseMove = (dateMoment) => {
    const { _isCtrlKeyDown } = this.state;
    if (_isCtrlKeyDown) return;

    const { _onMouseDownDate } = this.state;

    if (!_onMouseDownDate) return;

    const { _onMouseDownDate: startRange } = this.state;

    const endRange = new Date(dateMoment?.format());

    if (Date.parse(startRange) === Date.parse(endRange)) {
      this.setState({
        _selectedRange: [Date.parse(startRange), null],
      });
      return;
    }

    this.setState({
      _selectedRange: [Date.parse(startRange), Date.parse(endRange)],
    });
  };
  onMonthNameClick = (startMonthDateMoment) => {
    const { onMonthNameClick: cb } = this.props;

    if (cb && typeof cb === "function") {
      cb(new Date(startMonthDateMoment?.format()), startMonthDateMoment);
    }
  };
  onKeyDown = (e) => {
    switch (e.keyCode) {
      case 17:
        this.setState({ _isCtrlKeyDown: true });
        break;

      default:
        break;
    }
  };
  onKeyUp = (e) => {
    switch (e.keyCode) {
      case 17:
        const { _selectedRange } = this.state;
        this.setState({
          _onMouseDownDate: null,
          _selectedRange:
            _selectedRange && !_selectedRange[1] ? null : _selectedRange,
        });
        setTimeout(() => {
          this.setState({
            _isCtrlKeyDown: false,
          });
        }, 2);
        break;

      default:
        break;
    }
  };

  onDateRangeChange = () => {
    const { onDateRangeChange: cb } = this.props;
    const { _selectedRange } = this.state;

    console.log({ _selectedRange });

    if (cb && typeof cb === "function") {
      if (!_selectedRange) {
        cb(null, null);
        return;
      }

      if (!_selectedRange[1]) {
        cb(_selectedRange[0], null);
        return;
      }

      if (_selectedRange[0] < _selectedRange[1]) {
        cb(_selectedRange[0], _selectedRange[1]);
      } else {
        cb(_selectedRange[1], _selectedRange[0]);
      }
    }
  };
  onSelectedDateChange = () => {
    const { _selectedDate } = this.state;
    const { onSelectedDateChange: cb } = this.props;

    if (cb && typeof cb === "function") {
      cb(_selectedDate, moment(_selectedDate));
    }
  };

  componentDidMount() {
    const { events } = this.props;

    this.setState({ events });
    this.setState({ _selectedDate: new Date(moment().format()) });

    document
      .querySelector("body")
      .addEventListener("mouseup", () => this.onDateMouseUp(null));
    document
      .querySelector("body")
      .addEventListener("click", this.onDismissClick);
    document.querySelector("body").addEventListener("keydown", this.onKeyDown);
    document.querySelector("body").addEventListener("keyup", this.onKeyUp);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.events !== prevProps.events) {
      this.setState({ events: this.props.events });
    }

    if (this.state.events !== prevState.events) {
      console.log({ events: this.state.events });
    }

    //Selected Date
    if (this.state._selectedDate !== prevState._selectedDate) {
      this.onSelectedDateChange();
    }

    //Date Range
    if (this.state._selectedRange !== prevState._selectedRange) {
      this.onDateRangeChange();
    }
  }

  render() {
    const { monthDate } = this.props;

    console.log({ monthDate });

    return (
      <>
        <div className="monthView">
          {this.generateMonthCalendar({
            monthDate,
          })}
        </div>
      </>
    );
  }
}

export default KHuyamMonth;
