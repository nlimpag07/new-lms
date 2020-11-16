import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Spin, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../../theme-layout/course-circular-ui/course-circular-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";
import { color } from "d3";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
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

const ClassesEnrollmentsList = ({ enrollees_list, showModal, hideModal }) => {
  const router = useRouter();

  useEffect(() => {}, []);

  console.log("Enrollees", enrollees_list);

  const newEnrolleesData = enrollees_list.map((dataItem) => {
    let ItemLearner = dataItem.learner.length
      ? dataItem.learner[0].createdAt
      : null;
    let rawDate = new Date(ItemLearner);
    let newDate =
      rawDate.getFullYear() +
      "/" +
      (rawDate.getMonth() + 1) +
      "/" +
      rawDate.getDate();
    let newEnrollee = {
      id: dataItem.id,
      studentFullName: `${dataItem.firstName} ${dataItem.lastName}`,
      enrollmentType:
        dataItem.learner[0].enrollmentType == 1 ? "Manual" : "Self-Enrolled",
      userGroup: dataItem.groups.length ? dataItem.groups[0].name : "None",
      enrollmentDate: ItemLearner ? newDate : "None",
      status: dataItem.learner[0].statusId,
      isApproved: dataItem.learner[0].isApproved,
    };
    return newEnrollee;
  });

  var lastSelectedIndex = 0;
  const ddata = newEnrolleesData.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "studentFullName", dir: "asc" }],
  });
  console.log(Data);

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
      <Column field="userGroup" title="User Group" />
      <Column field="enrollmentDate" title="Enrollment Date" />
      <Column field="status" title="Status" cell={StatusRender} />
      <Column
        sortable={false}
        cell={(props) => ActionRender(props, showModal, hideModal)}
        field="action"
        title="Action"
      />
    </Grid>
  );
};

const StatusRender = (props) => {
  console.log("props", props);
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
const ActionRender = (props, showModal, hideModal) => {
  //console.log("props", props);
  const wasApproved = props.dataItem.isApproved === 1 ? true : false;
  const enrollDate = props.dataItem.enrollmentDate;
  return wasApproved ? (
    <td>
      <Button
        type="link"
        shape="circle"
        icon={<FontAwesomeIcon icon={["fas", `eye`]} size="lg" />}
        onClick={() => showModal("view")}
      />
    </td>
  ) : (
    <td>
      <Button
        shape="circle"
        icon={<CheckOutlined />}
        onClick={() => showModal("approve")}
      />
      &nbsp;
      <Button
        shape="circle"
        icon={<CloseOutlined />}
        onClick={() => showModal("delete")}
      />
    </td>
  );
};

export default ClassesEnrollmentsList;
