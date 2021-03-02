import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Select, Input, Divider, Spin, Checkbox } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const list = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const ClassesAttendanceList = ({ sessionData }) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { trigger, sessionTitle, enrolleeList } = sessionData;
  const [pagination, setPagination] = useState({ skip: 0, take: 5 });

  useEffect(() => {
    //console.log("Learners List", enrolleeList);
    if (trigger) {
      var config = {
        method: "get",
        url: apiBaseUrl + "/Attendance/" + trigger,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        //data: { courseId: course_id },
      };
      async function fetchData(config) {
        try {
          const response = await axios(config);
          if (response) {
            let theRes = response.data;
            //console.log("Session Response", response.data);
            let ddata;
            if (theRes) {
              ddata = theRes.map((dataItem) => {
                let newDataSet = {
                  selected: false,
                  courseName: dataItem.course.title,
                  sessionName: sessionTitle,
                  learnerName: `${dataItem.user.firstName} ${dataItem.user.lastName}`,
                };
                return Object.assign(newDataSet, dataItem);
              });
            } else {
              ddata = [];
            }
            setData(ddata);
          }
        } catch (error) {
          const { response } = error;
          console.log("Error Response", response);
          setData([]);
        }
      }
      fetchData(config);
    }
    setLoading(false);
  }, [trigger]);
  
  var lastSelectedIndex = 0;
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  const selectionChange = (event) => {
    const theData = Data.map((item) => {
      if (item.id === event.dataItem.id) {
        item.selected = !event.dataItem.selected;
      }
      return item;
    });
    setData(theData);
  };
  const rowClick = (event) => {
    let last = lastSelectedIndex;
    const theData = [...Data];

    const current = theData.findIndex(
      (dataItem) => dataItem === event.dataItem
    );

    if (!event.nativeEvent.shiftKey) {
      lastSelectedIndex = last = current;
    }

    if (!event.nativeEvent.ctrlKey) {
      theData.forEach((item) => (item.selected = false));
    }
    const select = !event.dataItem.selected;
    for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
      theData[i].selected = select;
    }
    setData(theData);
  };

  const headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const theData = Data.map((item) => {
      item.selected = checked;
      return item;
    });
    setData(theData);
  };

  const pageChange = (event) => {
    setPagination({
      skip: event.page.skip,
      take: event.page.take,
    });
  };

  const dateFormat = (props) => {
    //console.log("DateFormat", props.dataItem);
    const dateSchedule = moment(props.dataItem.dateSchedule).format(
      "YYYY-MM-DD h:mm a"
    );
    return <td>{dateSchedule}</td>;
  };
  const changeStatusOnClick = (props, statusToChange) => {
    let dataItem = props.dataItem;
    let statusSource;
    let currentStatus = false;
    switch (statusToChange) {
      case "isPresent":
        currentStatus = dataItem.isPresent;
        statusSource = "isPresent";
        break;
      case "isLate":
        currentStatus = dataItem.isLate;
        statusSource = "isLate";
        break;
      case "isAbsent":
        currentStatus = dataItem.isAbsent;
        statusSource = "isAbsent";
        break;
      case "isExcused":
        currentStatus = dataItem.isExcused;
        statusSource = "isExcused";
        break;
    }
    //console.log("DateFormat", props.dataItem);
    const dateSchedule = moment(dataItem.dateSchedule).format(
      "YYYY-MM-DD h:mm a"
    );
    const statusOnchange = (e, c, s, d) => {
      //console.log("DataItem", d);

      const newData = Data.map((item) => {
        if (item.id === d.id) {
          item[s] = e.target.checked;
          //console.log("EQUAL",`Item ID:${item[s]}=D ID:${d.id}` )
        }
        return item;
      });
      setData(newData);

      //Now lets update the API
      let endpoint = s.substring(2).toLowerCase();
      //console.log(endpoint)
      UpdateStatus(endpoint, d);
    };
    async function UpdateStatus(endpoint, d) {
      console.log(endpoint);
      console.log("DataItem", d);
      //build the data
      const { id, isPresent, isLate, isAbsent, isExcused } = d;
      console.log("isPresent", isPresent);
      let dataToSubmit = {
        attendanceId: id,
        isPresent: isPresent,
        isLate: isLate,
        isAbsent: isAbsent,
        isExcused: isExcused,
      };
      var config = {
        method: "patch",
        url: apiBaseUrl + "/Attendance/" + endpoint,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(dataToSubmit),
      };
      //try to submit to api
      try {
        const response = await axios(config);
        if (response) {
          let theRes = response.data;
          console.log("Attendance Response", response.data);
        }
      } catch (error) {
        const { response } = error;
        console.log("Error Response", response);
      }
    }
    return (
      <td>
        <Checkbox
          checked={currentStatus}
          onChange={(e) =>
            statusOnchange(e, currentStatus, statusSource, dataItem)
          }
        />{/* {`${statusToChange} ${currentStatus}`}</Checkbox> */}
      </td>
    );
  };
  return (
    <>
      <Grid
        data={orderBy(
          Data.slice(pagination.skip, pagination.take + pagination.skip),
          theSort.sort
        )}
        /* style={{ height: "550px" }} */
        selectedField="selected"
        onSelectionChange={selectionChange}
        /* onHeaderSelectionChange={headerSelectionChange} */
        onRowClick={rowClick}
        sortable
        sort={theSort.sort}
        onSortChange={(e) => {
          setTheSort({
            sort: e.sort,
          });
        }}
        skip={pagination.skip}
        take={pagination.take}
        total={Data.length}
        pageable={true}
        onPageChange={pageChange}
      >
        <Column field="learnerName" title="Name" />
        <Column field="sessionName" title="Session Name" />
        <Column field="dateSchedule" title="Attendace Date" cell={dateFormat}  width="200px" />
        <Column
          field="isPresent"
          title="Present"
          cell={(e) => changeStatusOnClick(e, "isPresent")}
          width="150px"
        />
        <Column
          field="isLate"
          title="Late"
          cell={(e) => changeStatusOnClick(e, "isLate")}
          width="150px"
        />
        <Column
          field="isAbsent"
          title="Absent"
          cell={(e) => changeStatusOnClick(e, "isAbsent")}
          width="150px"
        />
        <Column
          field="isExcused"
          title="Excused"
          cell={(e) => changeStatusOnClick(e, "isExcused")}
          width="150px"
        />
      </Grid>

      <Modal
        title="Publish Properties"
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>

      <style jsx global>{`
        .ClassesAttendanceList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ClassesAttendanceList .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .searchResultSeparator.ant-divider-horizontal.ant-divider-with-text {
          margin: 2rem 0;
        }
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: relative;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          padding: 34vh 0;
          width: 100%;
        }
      `}</style>
    </>
  );
};

const ActionRender = () => {
  return (
    <td>
      <button
        className="k-primary k-button k-grid-edit-command"
        /* onClick={() => {
          edit(this.props.dataItem);
        }} */
      >
        <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
      </button>
    </td>
  );
};

export default ClassesAttendanceList;
