import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import TranscriptDetails from "./TranscriptDetails";

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

const TranscriptList = ({ listOfTranscripts }) => {
  var transcripts = listOfTranscripts;
  const router = useRouter();
  console.log("transcripts", transcripts);

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [transcriptDetails, setTranscriptDetails] = useState("");

  const newTranscripts =
    transcripts && transcripts.length
      ? transcripts.map((transcript, index) => {
          //console.log("Course", transcript.course);
          let totalSteps = transcript.course.courseOutline.length;
          let takenSteps = transcript.course.courseOutline.filter(
            (outline) => outline.learnerCourseOutline.length != 0
          );
          takenSteps = takenSteps.length ? takenSteps.length : 0;
          const reArraytranscripts = {
            id: transcript.id,
            courseTitle: transcript.course.title,
            result: "-",
            steps: `${takenSteps} / ${totalSteps}`,
            avg: 0,
            totalHoursTaken: transcript.totalHoursTaken,
            totalHoursTakenLabel:
              transcript.totalHoursTaken == 0
                ? "-"
                : transcript.totalHoursTaken,
            finalScore: transcript.finalScore,
            finalScoreLabel:
              transcript.finalScore == 0 ? "-" : transcript.finalScore,
            num: index + 1,
            course: transcript.course,
          };
          return reArraytranscripts;
        })
      : [];

  var lastSelectedIndex = 0;
  const ddata = newTranscripts.length
    ? newTranscripts.map((dataItem) =>
        Object.assign({ selected: false }, dataItem)
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
    setTranscriptDetails(theCourse[0]); */
  }, []);

  return Data.length ? (
    <div className="common-holder">
      <Row className="widget-container">
        <motion.div initial="hidden" animate="visible" variants={list}>
          <Col
            className="gutter-row widget-holder-col TranscriptList"
            xs={24}
            sm={24}
            md={24}
            lg={24}
          >
            <h1>My Transcripts</h1>
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
                  <Column field="courseTitle" title="Course" width="300px" />
                  <Column field="result" title="Result" />
                  <Column field="steps" title="Steps" />
                  <Column field="avg" title="Avg. Score" />
                  <Column field="finalScoreLabel" title="Final Score" />
                  <Column field="totalHoursTakenLabel" title="Hours Taken" />
                  <Column
                    sortable={false}
                    cell={(props) =>
                      ActionRender(
                        props,
                        setModal2Visible,
                        setTranscriptDetails
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
        <TranscriptDetails
          modal2Visible={modal2Visible}
          setModal2Visible={setModal2Visible}
          transcriptDetails={transcriptDetails}
        />

        {/* <CourseCircularUi /> */}
        <style jsx global>{`
          .TranscriptList h1 {
            font-size: 2rem;
            font-weight: 700;
          }
          .TranscriptList .k-grid-header {
            background-color: rgba(0, 0, 0, 0.05);
          }
        `}</style>
      </Row>
    </div>
  ) : (
    <Empty></Empty>
  );
};

const ActionRender = (props, setModal2Visible, setTranscriptDetails) => {
  const setDetails = (props) => {
    setTranscriptDetails(props.dataItem);
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

export default TranscriptList;
