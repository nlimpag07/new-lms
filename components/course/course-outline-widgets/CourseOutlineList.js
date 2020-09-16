import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";

const apiBaseUrl = process.env.apiBaseUrl;

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

const userlist = [
  /* {
    empId: 1,
    firstName: "Noel",
    lastName: "Limpag",
    email: "nlimpag@ams.global",
    isActive: 1,
  },
  {
    empId: 2,
    firstName: "Noel2",
    lastName: "Limpag2",
    email: "nlimpag2@ams.global",
    isActive: 1,
  },
  {
    empId: 3,
    firstName: 'Noel3',
    lastName:'Limpag3',
    email: 'nlimpag@ams.global',
    isActive: 0,
    }, */
];

const CourseOutlineList = (props) => {
  /* userlist = userlist.result; */
  const router = useRouter();
  const {    
    curOutlineId,
    setcurOutlineId,
    outlineList,
  } = props;

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [courseDetails, setCourseDetails] = useState("");
  var dataList = [];
  if (outlineList) {
    outlineList.map((dataItem) => {
      //dataItem.
      let theoutline = {
        id: dataItem.id,
        title: dataItem.title,
        userGroup: dataItem.userGroup.name,
        visibility: dataItem.visibility === 1 ? "Private" : "Public",
      };
      dataList.push(theoutline);
      //console.log('Data Items: ',outline);
    });
    //console.log('Data List: ',dataList);
  }

  var lastSelectedIndex = 0;
  const ddata = dataList.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  //console.log(Data)

  const selectionChange = (event) => {    
    const theData = Data.map((item) => {
      if (item.id === event.dataItem.id) {
        item.selected = !event.dataItem.selected;
        //setOutline(item);
      } else {
        item.selected = false;
      }
      return item;
    });
    setData(theData);
    
    let isSelected = theData.filter((newdata) => newdata.selected === true);
    setcurOutlineId(isSelected);
    //console.log("The Data: ", isSelected);
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
    console.log("The RowClick: ", theData);
  };

  /* const headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const theData = Data.map((item) => {
      item.selected = checked;
      return item;
    });
    setData(theData);
  }; */

  useEffect(() => {
    /* let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.filter((getCourse) => getCourse.id == course_id);
    setCourseDetails(theCourse[0]); */
  }, []);

  return (
    //GridType(gridList)
    <Row className="widget-container">
      <motion.div initial="hidden" animate="visible" variants={list}>
        <div>
          <Row className="Course-Enrollments">
            <Col xs={24}>
              <Grid
                data={orderBy(Data, theSort.sort)}
                style={{ height: "auto" }}
                selectedField="selected"
                onSelectionChange={selectionChange}
                /* onHeaderSelectionChange={headerSelectionChange} */
                onRowClick={selectionChange}
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
                    Data.findIndex(
                      (dataItem) => dataItem.selected === false
                    ) === -1
                  }
                />
                <Column field="title" title="Title" width="300px" />
                <Column field="userGroup" title="User Group" />
                <Column field="visibility" title="Visibility" />
                <Column
                  width="150px"
                  sortable={false}
                  cell={ActionRender}
                  field="isActive"
                  title="Action"
                />
              </Grid>
            </Col>
          </Row>
        </div>
      </motion.div>
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

      {/* <CourseCircularUi /> */}
      <style jsx global>{`
        .CourseOutlineList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .CourseOutlineList .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Row>
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
        ✔
      </button>
      &nbsp;
      <button
        className="k-button k-grid-remove-command"
        /* onClick={() => {
          confirm("Confirm deleting: " + this.props.dataItem.ProductName) &&
            remove(this.props.dataItem);
        }} */
      >
        ✖
      </button>
    </td>
  );
};

export default CourseOutlineList;
