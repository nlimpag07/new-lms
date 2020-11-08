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
  const { course_id, learnerId, outlineList } = props;
  //console.log("My outlines", outlineList);
  const { courseAllList, setCourseAllList } = useCourseList();
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [drawer2Visible, setDrawer2Visible] = useState((drawer2Visible = false));
  var [outlineDrawerDetails, setCourseDrawerDetails] = useState(
    (outlineDrawerDetails = "")
  );

  var myCourseCount = 0;
  if (outlineList) myCourseCount = outlineList.length;
  useEffect(() => {
    setLoading(false);
  }, []);
  //console.log(courseAllList)
  return (
    <Row
      className="widget-container learnerOutlines"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      <Col
        className="gutter-row widget-holder-col"
        xs={24}
        sm={24}
        md={24}
        lg={24}
      >
        <Row className="widget-header-row" justify="start">
          <Col xs={20}>
            <h3 className="widget-title">Latest First</h3>
          </Col>
          <Col xs={4} className="widget-switchgrid-holder">
            <span>{myCourseCount} Results</span>{" "}
            <button
              className="switch-grid"
              key="Switch"
              onClick={() =>
                setCurGridStyle(curGridStyle == "grid" ? "list" : "grid")
              }
            >
              <FontAwesomeIcon
                icon={[
                  "fas",
                  `th-${curGridStyle == "grid" ? "list" : "large"}`,
                ]}
                size="lg"
              />
            </button>
          </Col>
        </Row>
        <Row
          className="widget-search-row"
          justify="start"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        >
          <Col xs={8}>
            <div className="choices-container category-holder">
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select View"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="Authored Courses">Authored Courses</Option>
                <Option value="Categories">Categories</Option>
              </Select>
            </div>
          </Col>
          <Col xs={16} className="widget-switchgrid-holder">
            <div className="choices-container searchbox-holder">
              <Search
                placeholder="Search Course"
                onSearch={(value) => console.log(value)}
              />
            </div>
          </Col>
        </Row>
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
      {/* <Modal
        title="Publish Properties"
        centered
        visible={drawer2Visible}
        onOk={() => setDrawer2Visible(false)}
        onCancel={() => setDrawer2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={`90vw`}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal> */}
      {outlineDrawerDetails && (
        <OutlinesDrawerDetails
          drawerVisible={drawer2Visible}
          setdrawerVisible={setDrawer2Visible}
          outlineDetails={outlineDrawerDetails}
          learnerId={learnerId}
          setSpinner={setSpinner}
        />
      )}

      <Spin
        size="large"
        tip="Processing..."
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
        .widget-holder-col:nth-child(even) {
          padding-right: 0px !important;
          padding-left: 10px !important;
        }

        .widget-holder-col:nth-child(odd) {
          padding-left: 0px !important;
          padding-right: 10px !important;
        }
        .widget-holder-col .widget-title {
          color: #e69138;
          margin-bottom: 0;
          text-transform: uppercase;
        }
        .widget-holder-col .widget-header-row {
          padding: 5px 0;
          color: #e69138;
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
        }
        .widget-holder-col .unpublished-course .ant-card-head {
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
        .ant-card-bordered {
          border: 1px solid #f0f0f0;
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
        .card-holder:hover .ant-card-bordered {
          border: 1px solid #f9c48e61;
        }
        .LearnersCourses-ListItems .ant-card {
          pointer-events: none;
        }
        .selected-c-body .ant-card-bordered {
          border: 1px solid #ff9d3761;
        }
        /*.selected-c-body .ant-card-body::after {
          display: table;
          clear: both;
          content: "";
          height: 2rem;
          background-color: #e2e2e2;
          z-index: 100;
          position: absolute;
          top: 100%;
          width: 100%;
          left: 0;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
         .course-details-content {
          width: 70vw;
    position: absolute;
    margin: 0 auto;
    left: 30%;
          background-color: #666666;
        } */
        .selected-c-body .ant-card-hoverable {
          border-color: transparent;
          box-shadow: 0 1px 2px -2px rgba(242, 163, 5, 0.3),
            0 3px 6px 0 rgba(242, 163, 5, 0.3),
            0 5px 12px 4px rgba(242, 163, 5, 0.3);
        }
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
    setDrawer2Visible(true);
    setCourseDrawerDetails(outline);
    /* let notTarget = document.querySelectorAll(".course-details");
    let targetdiv = "selected-course-open";
    notTarget.forEach((c) =>
      c.classList[e.target.nextElementSibling == c ? "toggle" : "remove"](
        targetdiv
      )
    ); */

    /* let targetdiv = document.querySelector(".course-details");
    let classes = targetdiv.classList;
    classes.toggle("selected-course-open"); */
    /*//setSelectedCourse("open");*/
  };
  const progressPercentage = (a, b) => {
    return a + b;
  };
  return outlines ? (
    <>
      {outlines.map((outline) => {
        var outlineStatus = "";
        var outlineStatusId = 0;
        var isNotEmpty =
          outline.learnerCourseOutline && outline.learnerCourseOutline.length
            ? true
            : false;
        //console.log(isNotEmpty);
        if (isNotEmpty) {
          let lco = outline.learnerCourseOutline;
          //get the last item details
          const lco_lastItem = lco[lco.length - 1];
          if (lco_lastItem.courseStart && lco_lastItem.courseEnd)
            outlineStatus = "Finished";
          outlineStatusId = 2;
          if (lco_lastItem.courseStart && !lco_lastItem.courseEnd)
            outlineStatus = "In Progress";
          outlineStatusId = 1;
        } else {
          outlineStatus = "Not Started";
          outlineStatusId = 0;
        }
        //Insert outlineStatusId to outline for Drawer Usage
        outline["outlineStatusId"] = outlineStatusId;
        /*  var baseNumber =
          outline && outline.length
            ? outline.length
            : 100;
        var newNumber =
          outline.learnerCourseOutline && outline.learnerCourseOutline.length
            ? outline.learnerCourseOutline.length
            : 0;
        var currentPercent = Math.round((newNumber * 100) / baseNumber); */
        var currentPercent = 0;
        //console.log(currentPercent);
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
                  outline.id ? "published-course" : "unpublished-course"
                }
                extra={outlineStatus}
                hoverable
                style={{ width: "auto" }}
                cover={
                  <img
                    alt="example"
                    src={`${apidirectoryUrl}/Images/courseOutline/${outline.featureImage}`}
                  />
                }
                actions={[
                  <h4>
                    {outline.startDate ? "Continue" : "Start This Lesson"}{" "}
                    <PlayCircleFilled key="action" title="Continue" />
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
