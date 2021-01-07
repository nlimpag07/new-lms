import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Spin, Button, Popconfirm, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../../theme-layout/course-circular-ui/course-circular-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";
import { color } from "d3";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";

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

const ClassesEnrollmentsList = ({
  enrollees_list,
  showModal,
  hideModal,
  setSpin,
  courseType,
}) => {
  const router = useRouter();
  const [Data, setData] = useState([]);

  useEffect(() => {
    //console.log("learners List", enrollees_list);
    enrollees_list =
      enrollees_list && enrollees_list.length ? enrollees_list : [];
    const newEnrolleesData = enrollees_list.map((dataItem) => {
      let learnerInfo = dataItem.learner ? dataItem.learner[0] : null;
      let enrollmentDate = learnerInfo
        ? moment(learnerInfo.createdAt).format("YYYY/MM/DD")
        : "None";
      //console.log("dataItem", dataItem);
      let newEnrollee = {
        id: learnerInfo ? learnerInfo.id : null,
        courseId: learnerInfo ? learnerInfo.courseId : null,
        studentFullName: `${dataItem.firstName} ${dataItem.lastName}`,
        enrollmentType:
          learnerInfo && learnerInfo.enrollmentType == 1
            ? "Manual"
            : "Self-Enrolled",
        enrollmentDate: enrollmentDate,
        status: learnerInfo ? learnerInfo.statusId : 0,
        isApproved: learnerInfo ? learnerInfo.isApproved : 0,
        learnerId: learnerInfo ? learnerInfo.id : 0,
        userId: learnerInfo ? learnerInfo.userId : 0,
        learnerSession: dataItem.learnerSession,
      };
      return newEnrollee;
    });

    const ddata = newEnrolleesData.map((dataItem) =>
      Object.assign({ selected: false }, dataItem)
    );
    //console.log('ddata',ddata)
    setData(ddata);
  }, []);

  //console.log("Enrollees", enrollees_list);

  var lastSelectedIndex = 0;

  const [theSort, setTheSort] = useState({
    sort: [{ field: "studentFullName", dir: "asc" }],
  });
  //console.log(Data);

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

  return (
    <Grid
      data={orderBy(Data, theSort.sort)}
      style={{ height: "550px" }}
      selectedField="selected"
      onSelectionChange={selectionChange}
      onHeaderSelectionChange={headerSelectionChange}
      onRowClick={rowClick}
      sortable
      sort={theSort.sort}
      onSortChange={(e) => {
        setTheSort({
          sort: e.sort,
        });
      }}
    >
      <Column
        field="selected"
        width="65px"
        headerSelectionValue={
          Data.findIndex((dataItem) => dataItem.selected === false) === -1
        }
      />
      <Column field="studentFullName" title="Name" width="300px" />
      <Column field="enrollmentType" title="Enrollment Type" />
      <Column field="enrollmentDate" title="Enrollment Date" />
      <Column field="status" title="Status" cell={StatusRender} />
      <Column
        sortable={false}
        cell={(props) =>
          ActionRender(props, showModal, hideModal, setSpin, courseType)
        }
        field="action"
        title="Action"
      />
    </Grid>
  );
};

const StatusRender = (props) => {
  //console.log("props", props);
  const wasApproved = props.dataItem.isApproved === 1 ? true : false;

  return wasApproved ? (
    <td>
      <span
        style={{
          border: "1px solid #85D871",
          padding: "5px 15px",
          borderRadius: "3px",
          color: "#85D871",
          fontWeight: "500",
        }}
      >
        Enrolled
      </span>
    </td>
  ) : (
    <td>
      <span
        style={{
          border: "1px solid #FFBC1C",
          padding: "5px 15px",
          borderRadius: "3px",
          color: "#FFBC1C",
          fontWeight: "500",
        }}
      >
        For Approval
      </span>
    </td>
  );
};

//Deleting for Courses enrollees
function deleteConfirm(e, data, setSpin) {
  //console.log(e);
  //console.log("PopConfirm", data);
  //setSpin(true);
  var config = {
    method: "delete",
    url: apiBaseUrl + "/enrollment/" + data.learnerId,
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
            title: "Enrollment Application successfully rejected",
            content: "You have successfully rejected the selected application",
            centered: true,
            width: 450,
            onOk: () => {
              visible: false;
              setSpin(true);
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
        title: "Error: Unable to Start Lesson",
        content: data.message + " Please contact Technical Support",
        centered: true,
        width: 450,
        onOk: () => {
          //setdrawerVisible(false);
          setSpin(true);
          visible: false;
        },
      });
    }
    //setLoading(false);
  }
  fetchData(config);
}

//Approval for Self-Paced Courses enrollees
const approveConfirm = (e, values, setSpin) => {
  //console.log("PopConfirm", values);
  var data = {};
  //Standard Entry, Static atm
  data.userGroupId = 3;
  data.isAutoEnroll = 1;
  data.isNotify = 1;
  data.notificationDetails =
    "Your Enrollment has been Approved. You may now take the course";
  data.learner = [{ userId: values.userId }];
  data = JSON.stringify(data);
  //console.log('data',data)
  var config = {
    method: "put",
    url: apiBaseUrl + "/enrollment/" + values.courseId,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then((res) => {
      //console.log("res: ", res.data);
      message.success(res.data.message);
      setSpin(true);
    })
    .catch((err) => {
      console.log("err: ", err.response.data);
      message.error("Network Error on Submission, Contact Technical Support");
      setSpin(true);
    });
};

function deleteCancel(e) {
  /* console.log(e);
  message.error('Click on No'); */
}
function approveCancel(e) {
  /* console.log(e);
  message.error('Click on No'); */
}
const ActionRender = (props, showModal, hideModal, setSpin, courseType) => {
  const wasApproved = props.dataItem.isApproved === 1 ? true : false;
  const enrollDate = props.dataItem.enrollmentDate;
  return wasApproved ? (
    <td>
      <Button
        type="link"
        shape="circle"
        icon={<FontAwesomeIcon icon={["fas", `eye`]} size="lg" />}
        onClick={() => showModal("view", props.dataItem)}
      />
    </td>
  ) : (
    <td>
      {courseType == 2 ? (
        <Popconfirm
          title="Approve this enrollment?"
          onConfirm={(e) => approveConfirm(e, props.dataItem, setSpin)}
          onCancel={approveCancel}
          okText="Confirm"
          cancelText="Not Now"
        >
          <Button
            shape="circle"
            icon={<CheckOutlined />}
            /* onClick={() => showModal("delete")} */
          />
        </Popconfirm>
      ) : (
        <Button
          shape="circle"
          icon={<CheckOutlined />}
          onClick={() => showModal("approve", props.dataItem)}
        />
      )}
      &nbsp;
      <Popconfirm
        title="Reject this enrollment?"
        onConfirm={(e) => deleteConfirm(e, props.dataItem, setSpin)}
        onCancel={deleteCancel}
        okText="Confirm"
        cancelText="Not Now"
      >
        <Button
          shape="circle"
          icon={<CloseOutlined />}
          /* onClick={() => showModal("delete")} */
        />
      </Popconfirm>
    </td>
  );
};

export default ClassesEnrollmentsList;
