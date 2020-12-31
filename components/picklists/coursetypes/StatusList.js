import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Row,
  Col,
  Modal,
  Select,
  Input,
  Divider,
  Spin,
  Checkbox,
  Avatar,
  Button,
  Popconfirm,
  message,
} from "antd";
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

const StatusList = ({
  statusData,
  page,
  setPage,
  setRunSpin,
  spin,
  showModal,
  hideModal,
}) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  //const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(true);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  //console.log(statusData);
  useEffect(() => {
    setLoading(false);
  }, []);
  /* useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseSession/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { courseId: course_id },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data.result;
          console.log("Session Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            //console.log(theRes)
            setSessionSelect(theRes);
            const ddata = theRes.length
              ? theRes.map((dataItem) =>
                  Object.assign({ selected: false }, dataItem)
                )
              : [];
            setData(ddata);
            setSpin(false);
          } else {
            setData([]);
            setSpin(false);
          }
        }
      } catch (error) {
        const { response } = error;
        console.log("Error Response", response);
        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: response + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
      //setLoading(false);
    }
    fetchData(config);
  }, []); */
  var lastSelectedIndex = 0;
  const the_data = statusData && statusData.length ? statusData : [];
  const ddata = the_data.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "desc" }],
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
      "YYYY/MM/DD h:mm a"
    );
    return (
      <td>
        <Avatar
          shape="square"
          size="small"
          style={{
            backgroundColor: props.dataItem.color,
          }}
        />
      </td>
    );
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
      "YYYY/MM/DD h:mm a"
    );
    const statusOnchange = (e, c, s, d) => {
      //console.log("DataItem", d);
      /*console.log("OnChange Status:", e.target.checked);
      console.log("Old Status:", c);
      console.log("statusSource:", s); */
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
          /* let ddata;
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
          } */
        }
      } catch (error) {
        const { response } = error;
        console.log("Error Response", response);
      }
      /*async function fetchData(config) {
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
      fetchData(config); */
    }
    return (
      <td>
        <Checkbox
          checked={currentStatus}
          onChange={(e) =>
            statusOnchange(e, currentStatus, statusSource, dataItem)
          }
        />
        {/* {`${statusToChange} ${currentStatus}`}</Checkbox> */}
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
        <Column field="name" title="Name" />
        <Column field="category" title="Category" />
        <Column field="color" title="Color" cell={dateFormat} />
        <Column
          sortable={false}
          cell={(props) => ActionRender(props, showModal, hideModal, setRunSpin)}
          field="SupplierID"
          title="Action"
        />
      </Grid>    

      <style jsx global>{`
        .StatusList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .StatusList .k-grid-header {
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
//Deleting Status
function deleteConfirm(e, data, setRunSpin) {
  //console.log(e);
  //console.log("PopConfirm", data);
  //setSpin(true);
  var config = {
    method: "delete",
    url: apiBaseUrl + "/settings/status/" + data.id,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
  async function fetchData(config) {
    try {
      const response = await axios(config);
      if (response) {
        //setOutcomeList(response.data.result);
        let theRes = response.data.response;
        //console.log("Response", response.data);
        // wait for response if the verification is true
        if (theRes) {
          Modal.success({
            title: "Deletion Success",
            content: "You have successfully deleted the status!",
            centered: true,
            width: 450,
            onOk: () => {
              visible: false;
              setRunSpin(true);              
              /* router.push(
                "/administrator/picklists/status",
                `/administrator/picklists/status`
              ); */
              //console.log("Should hide modal")
            },
          });
        } else {
        }
      }
    } catch (error) {
      const { response } = error;
      const { request, data } = response; // take everything but 'request'

      console.log("Error Response", data.message);

      Modal.error({
        title: "Error: Unable to delete",
        content: data.message,
        centered: true,
        width: 450,
        onOk: () => {
          //setdrawerVisible(false);
          setRunSpin(true);
          visible: false;
        },
      });
    }
    //setLoading(false);
  }
  fetchData(config);
}

const ActionRender = (props, showModal, hideModal, setRunSpin) => {
  return (
    <td>
      <Button
        icon={<FontAwesomeIcon icon={["fas", `pencil-alt`]} size="lg" />}
        onClick={() => showModal("edit", props.dataItem)}
      />{" "}
      <Popconfirm
        title="Delete this Status?"
        onConfirm={(e) => deleteConfirm(e, props.dataItem, setRunSpin)}
        /*onCancel={deleteCancel} */
        okText="Confirm"
        cancelText="Not Now"
      >
        <Button
          icon={<FontAwesomeIcon icon={["far", `trash-alt`]} size="lg" />}
          /* onClick={() => {
          edit(this.props.dataItem);
        }} */
        />
      </Popconfirm>
    </td>
  );
};

export default StatusList;
