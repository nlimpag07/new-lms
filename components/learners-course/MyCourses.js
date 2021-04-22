import React, { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Loader from "../theme-layout/loader/loader";

const MyCoursesDrawerDetails = dynamic(() =>
  import("./MyCoursesDrawerDetails")
);

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
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
const { Option } = Select;
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

const MyCourses = ({ mycourses }) => {
  const router = useRouter();
  //console.log("My COURSES", mycourses);
  const [allCourses, setAllCourses] = useState(
    mycourses && mycourses.result ? mycourses.result : []
  );
  const [uid, setUid] = useState(0);
  const [selectSearch, setSelectSearch] = useState({
    select: null,
    search: null,
  });
  const [categories, setCategories] = useState("");
  const [loading, setLoading] = useState(true);
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [drawer2Visible, setDrawer2Visible] = useState((drawer2Visible = false));
  var [courseDrawerDetails, setCourseDrawerDetails] = useState(
    (courseDrawerDetails = "")
  );

  /* var myCourseCount = 0;
  if (mycourses && mycourses.result) myCourseCount = mycourses.result.length; */
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userDetails"));
    setUid(userData.id);
    setLoading(false);
  }, []);
  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/Picklist/category",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          let theRes = response.data.result;
          //console.log("Session Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            setCategories(theRes);
          } else {
            setCategories("");
          }
        }
      } catch (error) {
        console.log("Error Response", error);
        let errContent;
        error.response && error.response.data
          ? (errContent = error.response.data.message)
          : (errContent = `${error}, Please contact Technical Support`);
        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: errContent,
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
    }
    fetchData(config);
  }, []);

  //Processing Select dropdown Options
  let categoriesOptions = [];
  categoriesOptions.push({ name: "All Courses", id: "all" });
  let catOptions =
    categories.length &&
    categories.map((option, index) => {
      categoriesOptions.push({ name: option.name, id: option.id });
    });
  categoriesOptions = categoriesOptions.map((opt, index) => {
    return (
      <Option key={index} label={opt.name} value={opt.id}>
        {opt.name}
      </Option>
    );
  });

  //Catching the value of selected Option and change accordingly
  function onChange(value) {
    setSelectSearch({ select: value });
    if (value == "all") {
      //select all courses
      let allCoursesList =
        mycourses && mycourses.result ? mycourses.result : [];
      setAllCourses(allCoursesList);
    } else {
      //filter courses to selected category
      let filteredList =
        mycourses &&
        mycourses.result.map((course, index) => {
          let isInCategory =
            course.course.courseCategory &&
            course.course.courseCategory.filter(
              (courseCat) => courseCat.categoryId === value
            );
          let result = null;
          if (isInCategory.length) {
            result = course;
          }
          return result;
        });
      let finalFiltered = filteredList.filter((course) => course !== null);
      setAllCourses(finalFiltered.length ? finalFiltered : []);
    }
  }
  function searchCourse(value) {
    //console.log(val);
    const { select } = selectSearch;
    setSelectSearch({ select: select, search: value });
    console.log(select);
    if (select == "all" || !select) {
      //select all courses
      let allCoursesList =
        mycourses && mycourses.result
          ? mycourses.result.filter((course) =>
              course.course.title.toLowerCase().includes(value.toLowerCase())
            )
          : [];
      setAllCourses(allCoursesList);
    } else {
      //filter courses to selected category
      let filteredList =
        mycourses &&
        mycourses.result.map((course, index) => {
          let isInCategory =
            course.course.courseCategory &&
            course.course.courseCategory.filter(
              (courseCat) =>
                courseCat.categoryId === select &&
                course.course.title.toLowerCase().includes(value.toLowerCase())
            );
          let result = null;
          if (isInCategory.length) {
            result = course;
          }
          return result;
        });
      let finalFiltered = filteredList.filter((course) => course !== null);
      setAllCourses(finalFiltered.length ? finalFiltered : []);
    }
  }

  return (
    <div className="common-holder">
      <Row className="widget-container">
        <Col
          className="gutter-row widget-holder-col"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <Row className="widget-header-row" justify="start">
            <Col xs={14} sm={18} md={18}>
              <h3 className="widget-title">Latest First</h3>
            </Col>
            <Col
              xs={10}
              sm={6}
              md={6}
              lg={0}
              xl={0}
              xxl={0}
              className="widget-switchgrid-holder"
            >
              <span>{allCourses ? allCourses.length : 0} Results</span>{" "}
            </Col>
            <Col
              xs={0}
              sm={0}
              md={0}
              lg={6}
              xl={6}
              xxl={6}
              className="widget-switchgrid-holder"
            >
              <span>{allCourses ? allCourses.length : 0} Results</span>{" "}
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
          <Row className="widget-search-row" justify="start" gutter={[16, 16]}>
            <Col xs={24} sm={10} md={8}>
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
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {categoriesOptions}
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={14} md={16} className="widget-switchgrid-holder">
              <div className="choices-container searchbox-holder">
                <Search
                  placeholder="Search Course"
                  onSearch={(value) => searchCourse(value)}
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
              allCourses,
              curGridStyle,
              setDrawer2Visible,
              setCourseDrawerDetails,
              router,
              loading
            )}
          </Row>
        </Col>
        {courseDrawerDetails && (
          <MyCoursesDrawerDetails
            drawerVisible={drawer2Visible}
            setdrawerVisible={setDrawer2Visible}
            mycourseDetails={courseDrawerDetails}
          />
        )}

        {/* <CourseCircularUi /> */}
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
            background-color: #ffffff;
            padding: 0;
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
            z-index: 1;
          }
          .widget-holder-col .unpublished-course .ant-card-head {
            background-color: #ff572294;
            z-index: 1;
          }
          .widget-holder-col .widget-search-row {
            padding: 5px 10px;
            color: #e69138;
          }
          .widget-holder-col .widget-search-row {
            padding-left: 0;
            padding-right: 0;
          }

          .widget-holder-col .widget-search-row .category-holder {
            position: relative;
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

          /* .searchbox-holder .ant-input-affix-wrapper {
          background: none;
          border: none;
          font-size: 1rem;
          color: #e69138;
        } */
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
        `}</style>
      </Row>
    </div>
  );
};

const GridType = (
  courses,
  gridType,
  setDrawer2Visible,
  setCourseDrawerDetails,
  router,
  loading
) => {
  //courses = courses ? courses.result : null;
  //console.log("Courses:", courses);
  const [selectedCourse, setSelectedCourse] = useState("off");
  let gridClass = "";
  let gridProps = { xs: 24, sm: 24, md: 8, lg: 8, xl: 6 };
  if (gridType == "list") {
    gridProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    gridClass = "grid-list";
  }

  const handleAnchorClick = (e, course) => {
    e.preventDefault();
    //console.log(e.target.nextElementSibling);

    let notCard = document.querySelectorAll(".card-holder");
    let targetCard = "selected-c-body";
    notCard.forEach((c) =>
      c.classList[e.target == c ? "toggle" : "remove"](targetCard)
    );
    setDrawer2Visible(true);
    setCourseDrawerDetails(course);
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
  const descTrimmerDecoder = (desc) => {
    let d = decodeURI(desc);
    let trimmedDesc = d.substr(0, 250);
    return trimmedDesc + "...";
  };
  return courses && courses.length ? (
    <>
      {courses.map((mycourse) => {
        //console.log("My Course", mycourse);
        var baseNumber =
          mycourse.course.courseOutline && mycourse.course.courseOutline.length
            ? mycourse.course.courseOutline.length
            : 100;
        var newNumber =
          mycourse.learnerCourseOutline && mycourse.learnerCourseOutline.length
            ? mycourse.learnerCourseOutline.length
            : 0;
        var currentPercent = Math.round((newNumber * 100) / baseNumber);
        //console.log(currentPercent);
        //course status identifier
        if (mycourse.startDate && mycourse.statusId == 8) {
          mycourse.cbStatus = "In Progress";
          mycourse.cbbStatus = "In Progress";
        } else if (
          mycourse.startDate &&
          mycourse.endDate &&
          mycourse.statusId == 9
        ) {
          mycourse.cbStatus = "Completed";
          mycourse.cbbStatus = "Completed";
        } else {
          mycourse.cbStatus = "Not Started";
          mycourse.cbbStatus = "Start";
        }

        return (
          <Col
            key={mycourse.course.id}
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
              onClick={(e) => handleAnchorClick(e, mycourse)}
            >
              <Card
                className={
                  mycourse.startDate ? "published-course" : "unpublished-course"
                }
                extra={mycourse.cbStatus}
                hoverable
                style={{ width: "auto" }}
                cover={
                  <img
                    alt="example"
                    src={`${apidirectoryUrl}/Images/course/thumbnail/${mycourse.course.featureImage}`}
                  />
                }
                actions={[
                  <h4>
                    {mycourse.cbStatus}{" "}
                    <PlayCircleFilled key="action" title="Continue" />
                  </h4>,
                ]}
              >
                <Meta
                  title={mycourse.course.title}
                  description={
                    <div>
                      <div>
                        {descTrimmerDecoder(mycourse.course.description)}
                      </div>
                      <div>Public</div>
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
    <div style={{ margin: "0 auto" }}>
      <Loader loading={loading}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Loader>
    </div>
  );
};

function onBlur() {
  console.log("blur");
}
function onFocus() {
  console.log("focus");
}
function onSearch(val) {
  console.log("search:", val);
}

export default MyCourses;
