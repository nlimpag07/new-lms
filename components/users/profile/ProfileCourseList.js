import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Empty, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import CourseAssessmentDetails from "./ProfileCourseDetails";
import TranscriptDetails from "../../learners-transcript/TranscriptDetails";

import moment from "moment";
import { FileTextTwoTone } from "@ant-design/icons";

const apiBaseUrl = process.env.apiBaseUrl;

const ProfileCourseList = ({ myCourses, coursePage }) => {
  var courseList = myCourses;
  const router = useRouter();
  console.log("myCourses", myCourses);
  console.log("Page", coursePage);
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [courseDetails, setCourseDetails] = useState("");
  const [Data, setData] = useState([]);

  useEffect(() => {
    const newCourseList = [];
    const newCourses =
      courseList && courseList.length
        ? courseList.map((cl, index) => {
            if (cl.course) {
              let c = cl.course;
              //console.log("assessment", cl.courseAssessment);
              const reArrayAss = {
                key: index,
                id: cl.id,
                title: c.title,
                course: c,
                instructor: c.courseInstructor,
                startDate: moment(cl.startDate).format("YYYY-MM-DD h:mm a"),
                endDate: cl.endDate
                  ? moment(cl.endDate).format("YYYY-MM-DD h:mm a")
                  : "-",
                totalHoursTaken: cl.totalHoursTaken,
                finalScore: cl.finalScore,
                status: cl.status,
                statusId: cl.statusId,
                resultStatus: cl.statusId,
              };
              newCourseList.push(reArrayAss);
            }
          })
        : [coursePage];

    //console.log("newCourseList", newCourseList);
    const ddata = newCourseList.length
      ? newCourseList.map((dataItem, index) =>
          Object.assign({ selected: false, num: index + 1 }, dataItem)
        )
      : [];
    setData(ddata);
  }, []);

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

  useEffect(() => {
    /* let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.filter((getCourse) => getCourse.id == course_id);
    setCourseDetails(theCourse[0]); */
  }, []);
  //console.log("Data", Data);
  return (
    //GridType(gridList)
    <Row
    /* className="widget-container"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }} */
    >
      <Col
        className="gutter-row widget-holder-col ProfileCourseList"
        xs={24}
        sm={24}
        md={24}
        lg={24}
      >
        <Row className="Course-Enrollments">
          <Col xs={24}>
            <Grid
              data={orderBy(Data, theSort.sort)}
              /* style={{ height: "550px" }} */
              selectedField="selected"
              onSelectionChange={selectionChange}
              onHeaderSelectionChange={headerSelectionChange}
              /* onRowClick={rowClick} */
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
              <Column field="title" title="Course" />
              <Column
                field="instructor"
                title="Instructor"
                width="300px"
                cell={InstructorRender}
              />
              <Column field="startDate" title="Start Date" />
              <Column field="endDate" title="End Date" />
              <Column field="totalHoursTaken" title="Hourse Taken" />
              <Column field="finalScore" title="Score (%)" />

              <Column field="resulStatus" title="Result" cell={ResultRender} />
              <Column
                sortable={false}
                cell={(props) =>
                  ActionRender(props, setModal2Visible, setCourseDetails)
                }
                field=""
                title="Action"
              />
            </Grid>
          </Col>
        </Row>
      </Col>
      <CourseAssessmentDetails
        modal2Visible={modal2Visible}
        setModal2Visible={setModal2Visible}
        courseDetails={courseDetails}
      />

      {/* <CourseCircularUi /> */}
      <style jsx global>{`
        .ProfileCourseList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ProfileCourseList .k-grid-header {
          background-color: #4e4e4e;
          color: #e9ebee;
        }
        .ProfileCourseList .k-grid-header th {
          font-weight: 400;
        }
        .ProfileCourseList .k-grid-header .k-sorted,
        .ProfileCourseList .k-grid-header .k-link:hover {
          color: #d3d3d5;
        }
      `}</style>
    </Row>
  );
};

const InstructorRender = (props) => {
  let dataItem = props.dataItem;
  let instructors =
    dataItem.instructor && dataItem.instructor.length
      ? dataItem.instructor.map((i, index) => {
          let insName = `${i.user.firstName} ${i.user.lastName}`;
          return (
            <Tag color={`geekblue`} key={index}>
              {insName}
            </Tag>
          );
        })
      : "-";
  return <td>{instructors}</td>;
};
const ResultRender = (props) => {
  let dataItem = props.dataItem;
  let resultStatus = dataItem.resultStatus ? (
    <Tag color={`green`} key={dataItem.key}>
      {dataItem.resultStatus}
    </Tag>
  ) : (
    <Tag color={`volcano`} key={dataItem.key}>
      {dataItem.resultStatus}
    </Tag>
  );
  return <td>{resultStatus}</td>;
};
const ActionRender = (props, setModal2Visible, setCourseDetails) => {
  const setDetails = (props) => {
    console.log("Props", props.dataItem);
    setCourseDetails(props.dataItem);
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
        <FileTextTwoTone
          style={{ fontSize: "1.3rem", verticalAlign: "middle" }}
        />
      </button>
    </td>
  );
};

export default ProfileCourseList;
