import React, { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Loader from "../theme-layout/loader/loader";

const OutlinesDrawerDetails = dynamic(() => import("./OutlinesDrawerDetails"));
import AssessmentProcess from "./AssessmentProcessPopup/AssessmentProcess";
import BeforeAssessment from "./AssessmentProcessPopup/BeforeAssessment";

import {
  Layout,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  Card,
  Avatar,
  Menu,
  Dropdown,
  Select,
  Input,
  Tooltip,
  Drawer,
  Progress,
  Empty,
  Spin,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
const { Meta } = Card;

const { Search } = Input;
const list = {
  visible: {
    opacity: 1,
    transition: {
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const Outlines = (props) => {
  const router = useRouter();
  const { cDetails, course_id, learnerId, listOfOutlines } = props;

  const [course, setCourse] = useState(cDetails);
  const [outlineList, setOutlineList] = useState(listOfOutlines);
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [drawer2Visible, setDrawer2Visible] = useState((drawer2Visible = false));
  var [outlineDrawerDetails, setCourseDrawerDetails] = useState(
    (outlineDrawerDetails = "")
  );
  const [outlineAssessmentModal, setOutlineAssessmentModal] = useState(false);
  const [outlineFinishModal, setOutlineFinishModal] = useState(false);
  const [startOutline, setStartOutline] = useState(false);

  var myOutlineCount = 0;
  if (outlineList) myOutlineCount = outlineList.length;

  useEffect(() => {
    //setOutlineList(listOfOutlines);
    //console.log("run SetLoading",loading)
    setLoading(true);
  }, []);
  useEffect(() => {
    if (startOutline) {
      //console.log("run Start Outline", startOutline);
      var config = {
        method: "get",
        url: apiBaseUrl + `/Learner/MyCourse/${course_id}`,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      async function fetchData(config) {
        const response = await axios(config);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data;
          //console.log("Response", response.data);
          // wait for response if the verification is true
          if (theRes.length) {
            let outlines = theRes[0].course
              ? theRes[0].course.courseOutline
              : null;
            setOutlineList(outlines);
            let cDetails = theRes[0].course ? theRes[0].course : null;
            setCourse(cDetails);
          } else {
            //false
          }
        }
      }
      fetchData(config);
      setSpinner(false);
    }
  }, [startOutline]);

  /* console.log("StartOutline", startOutline);
  console.log("My outlines", outlineList); */
  return (
    <Row
      className="widget-container learnerOutlines"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
    >
      <Col
        className="gutter-row widget-holder-col"
        xs={24}
        sm={24}
        md={24}
        lg={24}
      >        
        <Row
          className="LearnersCourses-ListItems"
          gutter={[16, 16]}
          style={{ padding: "10px 0" }}
        >
          {GridType(
            outlineList,
            curGridStyle,
            setDrawer2Visible,
            setCourseDrawerDetails,
            router,
            loading
          )}
        </Row>
      </Col>
     
      {outlineDrawerDetails && (
        <OutlinesDrawerDetails
          drawerVisible={drawer2Visible}
          setdrawerVisible={setDrawer2Visible}
          outlineDetails={outlineDrawerDetails}
          learnerId={learnerId}
          spinner={spinner}
          setSpinner={setSpinner}
          setOutlineAssessmentModal={setOutlineAssessmentModal}
          setOutlineFinishModal={setOutlineFinishModal}
          startOutline={startOutline}
          setStartOutline={setStartOutline}
        />
      )}
      {outlineAssessmentModal && (
        <AssessmentProcess
          outlineDetails={outlineDrawerDetails}
          outlineAssessmentModal={outlineAssessmentModal}
          setOutlineAssessmentModal={setOutlineAssessmentModal}
          learnerId={learnerId}
          spinner={spinner}
          setSpinner={setSpinner}
        />
      )}
      {outlineFinishModal && (
        <BeforeAssessment
          outlineFinishModal={outlineFinishModal}
          setOutlineFinishModal={setOutlineFinishModal}
          setTakeAssessment=""
          learnerId={learnerId}
        />
      )}
      <Spin
        size="large"
        /* tip="Processing..." */
        spinning={spinner}
        delay={100}
      ></Spin>
      <style jsx global>{`
        .LearnersCourses-ListItems .ant-card-cover {
          margin-right: 0;
          margin-left: 0;
        }
        .LearnersCourses-ListItems .ant-card-actions li span {
          padding: 0.5rem 0;
        }
        .LearnersCourses-ListItems .ant-card-actions li span h4 {
          margin: 0;
        }
        .ant-card-actions > li {
          padding: 0;
          margin: 0;
        }
        .LearnersCourses-ListItems .ant-progress-line {
          width: 97%;
        }
        .ant-card-actions > li:hover {
          background-color: #f0f0f0;
          margin: 0;
        }

        .widget-holder-col .widget-title {
          color: #e69138;
          margin-bottom: 0;
          text-transform: uppercase;
        }
        .widget-holder-col .widget-header-row {
          padding: 5px 0;
          color: #e69138;
          background: none !important;
        }
        .widget-holder-col .widget-header-row .widget-switchgrid-holder {
          text-align: right;
        }
        .widget-holder-col .widget-header-row .switch-grid {
          vertical-align: middle;
          font-weight: 900;
          border: none;
          outline: none;
          background: none;
        }
        .widget-holder-col .widget-header-row .switch-grid:hover,
        .widget-holder-col .widget-header-row .switch-grid:focus {
          cursor: pointer;
          outline: none;
        }
        /* .widget-holder-col .ant-card-hoverable {
          cursor: default;
        } */
        .widget-holder-col .ant-card-body {
          padding: 10px;
        }
        .widget-holder-col .ant-card-head {
          float: right;
          position: absolute;
          right: 5px;
          top: 5px;
          background-color: #62ab35bf;
          border-radius: 15px;
          padding: 0 10px;
          font-size: 12px;
          color: #ffffff;
          padding: 7px 10px;
          font-size: 12px;
          min-height: 0;
          border-bottom: none;
        }
        .widget-holder-col .ant-card-head .ant-card-extra {
          color: #ffffff;
          padding: 0 0;
          font-size: 12px;
        }
        .grid-list .ant-card-cover {
          width: 25%;
        }
        .grid-list .ant-card-cover,
        .grid-list .ant-card-body {
          float: left;
          position: relative;
        }
        .grid-list .ant-card-actions {
          float: none;
          clear: both;
          position: relative;
        }
        .widget-holder-col .published-course .ant-card-head {
          background-color: #62ab35bf;
          z-index: 1;
        }
        .widget-holder-col .published-course .ant-card-actions {
          background-color: #62ab35bf;
        }
        .widget-holder-col .unpublished-course .ant-card-head {
          background-color: #ff572294;
          z-index: 1;
        }
        .widget-holder-col .unpublished-course .ant-card-actions {
          background-color: #ff572294;
        }

        .widget-holder-col .widget-search-row {
          padding: 5px 10px;
          color: #e69138;
        }
        .widget-holder-col .widget-search-row {
          padding-left: 0;
          padding-right: 0;
        }
        .widget-holder-col .widget-search-row .choices-container {
          border-radius: 0.5rem;
          border: 1px solid #888787;
          /* padding: 0 10px; */
        }
        .widget-holder-col .widget-search-row .category-holder {
          position: relative;
        }
        .widget-holder-col
          .widget-search-row
          .category-holder
          .ant-select-single:not(.ant-select-customize-input)
          .ant-select-selector {
          background: none;
          border: none;
        }
        .widget-holder-col .widget-search-row .category-holder .ant-select,
        .widget-holder-col
          .widget-search-row
          .category-holder
          .ant-select-arrow {
          color: #e69138;
          font-size: 1rem;
        }
        .widget-holder-col
          .widget-search-row
          .category-holder
          .ant-select-arrow {
          top: 50%;
        }

        .searchbox-holder .ant-input-affix-wrapper {
          background: none;
          border: none;
          font-size: 1rem;
          color: #e69138;
        }
        .searchbox-holder .ant-input,
        .searchbox-holder .ant-input-search-icon {
          font-size: 1rem;
          color: #e69138;
        }
        .searchbox-holder .ant-input-affix-wrapper .ant-input-prefix,
        .searchbox-holder .ant-input-affix-wrapper .ant-input-suffix {
          color: #e69138;
        }
        .category-holder .ant-select-selection-placeholder,
        .searchbox-holder .ant-input::placeholder {
          color: #e69138;
          opacity: 0.5;
        }
        .widget-holder-col .ant-card-meta-title a {
          color: #000000;
        }
        .widget-holder-col .ant-card-meta-title a:hover {
          color: #e69138;
        }
        .widget-holder-col .ant-card-cover a img {
          width: 100%;
        }
        .class-icon-holder {
          padding: 12px 0;
        }
        .ant-card-actions > li > span:hover {
          color: #e69138;
        }
        .course-details,
        .selected-course-off {
          display: none;
        }
        .selected-course-open {
          display: block;
          height: 10vh;
          width: 100vh;
          position: absolute;
          transform: translateY(-100%);
        }
        .card-holder:hover {
          cursor: pointer;
        }
        .LearnersCourses-ListItems .ant-card {
          pointer-events: none;
        }
        /* .selected-c-body .ant-card-hoverable {
          border-color: transparent;
          box-shadow: 0 1px 2px -2px rgba(242, 163, 5, 0.3),
            0 3px 6px 0 rgba(242, 163, 5, 0.3),
            0 5px 12px 4px rgba(242, 163, 5, 0.3);
        } */
        .learnerOutlines .ant-spin-spinning {
          position: fixed;
          display: block;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #cccccc9e;
          z-index: 1001;
          padding: 23% 0;
        }
      `}</style>
    </Row>
  );
};

const GridType = (
  outlines,
  gridType,
  setDrawer2Visible,
  setCourseDrawerDetails,
  router,
  loading
) => {
  outlines = outlines ? outlines : null;
  //console.log("Outlines:", outlines);
  const [selectedCourse, setSelectedCourse] = useState("off");
  let gridClass = "";
  let gridProps = { xs: 24, sm: 24, md: 8, lg: 8, xl: 6 };
  if (gridType == "list") {
    gridProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    gridClass = "grid-list";
  }

  const handleAnchorClick = (e, outline) => {
    e.preventDefault();
    //console.log(e.target.nextElementSibling);

    let notCard = document.querySelectorAll(".card-holder");
    let targetCard = "selected-c-body";
    notCard.forEach((c) =>
      c.classList[e.target == c ? "toggle" : "remove"](targetCard)
    );

    var config = {
      method: "get",
      url: apiBaseUrl + `/CourseAssessment/${outline.courseId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios(config)
      .then((res) => {
        console.log("res: ", res.data);
        if (res.data.result) {
          let theNewoutline = outline;
          outline = { ...theNewoutline, courseAssessment: res.data.result };
        }
      })
      .catch((err) => {
        console.log("err: ", err.response.data);
        message.error(
          "Network Error on pulling data, Contact Technical Support"
        );
      })
      .then(() => {
        setDrawer2Visible(true);
        setCourseDrawerDetails(outline);
      });   
    
  };
  const progressPercentage = (a, b) => {
    return a + b;
  };
  return outlines ? (
    <>
      {outlines.map((outline) => {
        var outlineStatus = "";
        var outlineStatusId = 0;
        var currentPercent = 0;
        var isNotEmpty =
          outline.learnerCourseOutline && outline.learnerCourseOutline.length
            ? true
            : false;
        //console.log("isNotEmpty", isNotEmpty);
        if (isNotEmpty) {
          let lco = outline.learnerCourseOutline;
          //get the last item details
          const lco_lastItem = lco[lco.length - 1];
          //console.log("Last Item", lco_lastItem);
          if (lco_lastItem.courseStart && lco_lastItem.courseEnd) {
            outlineStatus = "Finished";
            outlineStatusId = 2;
            currentPercent = 100;
          }
          if (lco_lastItem.courseStart && !lco_lastItem.courseEnd) {
            outlineStatus = "In Progress";
            outlineStatusId = 1;

            var baseNumber = outline && outline.length ? outline.duration : 100;
            var newNumber =
              outline.learnerCourseOutline &&
              outline.learnerCourseOutline.length
                ? outline.learnerCourseOutline.hoursTaken
                : 0;
            currentPercent = Math.round((newNumber * 100) / baseNumber);
          }
        } else {
          outlineStatus = "Not Started";
          outlineStatusId = 0;
        }
        //Insert outlineStatusId to outline for Drawer Usage
        outline["outlineStatusId"] = outlineStatusId;
        return (
          <Col
            key={outline.id}
            className={`gutter-row course-holder ${gridClass}`}
            {...gridProps}

            /* onMouseEnter={handleMouseOver} 
          onMouseLeave={handleAnchorClick}*/
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={list}
              className="card-holder"
              onClick={(e) => handleAnchorClick(e, outline)}
            >
              <Card
                className={
                  outlineStatusId ? "published-course" : "unpublished-course"
                }
                extra={outlineStatus}
                hoverable
                style={{ width: "auto" }}
                cover={
                  <img
                    alt="example"
                    src={`${apidirectoryUrl}/Images/courseOutline/thumbnail/${outline.featureImage}`}
                  />
                }
                actions={[
                  <h4>
                    {outlineStatusId == 2
                      ? "Completed"
                      : outlineStatusId == 1
                      ? "Continue"
                      : "Start Lesson"}{" "}
                    {outlineStatusId != 2 && (
                      <PlayCircleFilled key="action" title="Continue" />
                    )}
                  </h4>,
                ]}
              >
                <Meta
                  title={outline.title}
                  description={
                    <div>
                      <div>Public</div>
                      <div>Lesson Duration: {outline.duration} Minutes</div>
                      <div>
                        <Progress
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                          percent={currentPercent}
                        />
                      </div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
        );
      })}
    </>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

const { Option } = Select;
function onChange(value) {
  console.log(`selected ${value}`);
}
function onBlur() {
  console.log("blur");
}
function onFocus() {
  console.log("focus");
}
function onSearch(val) {
  console.log("search:", val);
}

export default Outlines;
