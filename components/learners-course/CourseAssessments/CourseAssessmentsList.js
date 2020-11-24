import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import CourseAssessmentDetails from "./CourseAssessmentDetails";

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

const AssessmentsList = ({ listOfOutlines }) => {
  var outlineList = listOfOutlines;
  const router = useRouter();
  //console.log("outlineList", outlineList);

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [transcriptDetails, setCourseAssessmentDetails] = useState("");
  const newAssessmentList = [];
  const newTranscripts =
    outlineList && outlineList.length
      ? outlineList.map((otl, index) => {
          
          if (otl.courseAssessment.length) {
            let a = otl.courseAssessment;
            //console.log("assessment", otl.courseAssessment);
            a.map((at, index) => {              
              const reArrayAss = {
                outlineId: otl.id,
                courseId: otl.courseId,
                outlineTitle: otl.title,
                id: at.id,
                assessmentTypeId: at.assessmentTypeId,
                title:at.title,
                totalItems: at.courseAssessmentItem
                  ? at.courseAssessmentItem.length
                  : 0,
                due: at.isImmediate == 1 ? "immediately" : toDate,
              };
              newAssessmentList.push(reArrayAss)
            });            
          }          
        })
      : [];
  console.log("assessments", newAssessmentList);
  const ddata = newAssessmentList.length
    ? newAssessmentList.map((dataItem,index) =>
        Object.assign({ selected: false,num:index+1 }, dataItem)
      )
    : [];
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  //console.log(Data)

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

  useEffect(() => {
    /* let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.filter((getCourse) => getCourse.id == course_id);
    setCourseAssessmentDetails(theCourse[0]); */
  }, []);
console.log(Data)
  return Data.length ? (
    //GridType(gridList)
    <Row
      className="widget-container"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      <motion.div initial="hidden" animate="visible" variants={list}>
        <Col
          className="gutter-row widget-holder-col AssessmentsList"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >          
          <Row className="Course-Enrollments">
            <Col xs={24}>
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
                {/* <Column
                  field="selected"
                  width="65px"
                  headerSelectionValue={
                    Data.findIndex(
                      (dataItem) => dataItem.selected === false
                    ) === -1
                  }
                /> */}
                <Column field="num" width="65px" title="#" />
                <Column field="title" title="Assessment" />
                <Column field="outlineTitle" title="Source Lesson" width="300px" />
                <Column field="totalItems" title="Total Items" />
                <Column field="assessmentTypeId" title="Type" />
                <Column field="due" title="Due On" cell={DueTypeRender} />
                <Column
                  sortable={false}
                  cell={(props) =>
                    ActionRender(
                      props,
                      setModal2Visible,
                      setCourseAssessmentDetails
                    )
                  }
                  field=""
                  title="Action"
                />
              </Grid>
            </Col>
          </Row>
        </Col>
      </motion.div>
      <CourseAssessmentDetails
        modal2Visible={modal2Visible}
        setModal2Visible={setModal2Visible}
        transcriptDetails={transcriptDetails}
      />

      {/* <CourseCircularUi /> */}
      <style jsx global>{`
        .AssessmentsList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .AssessmentsList .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Row>
  ) : (
    <Empty></Empty>
  );
};

const DueTypeRender = (props) => {
  //console.log("props", props);
  const wasApproved = props.dataItem.due === 1 ? true : false;

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

const ActionRender = (props, setModal2Visible, setCourseAssessmentDetails) => {
  const setDetails = (props) => {
    setCourseAssessmentDetails(props.dataItem);
    setModal2Visible(true);
  };
  return (
    <td>
      <button
        className="k-grid-edit-command"
        onClick={() => setDetails(props)}
        /* onClick={() => {
          edit(this.props.dataItem);
        }} */
      >
        <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
      </button>
    </td>
  );
};

export default AssessmentsList;
