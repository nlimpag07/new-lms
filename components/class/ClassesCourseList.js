import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Loader from "../../components/theme-layout/loader/loader";

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
  Empty,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;
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
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const ClassesCourseList = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { courseAllList, setCourseAllList } = useCourseList();
  const [publishedCourses, setPublishedCourses] = useState("");
  const [uid, setUid] = useState(0);
  const [selectSearch, setSelectSearch] = useState({
    select: null,
    search: null,
  });
  const [categories, setCategories] = useState("");

  //console.log(courseAllList)
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));

  /*const [grid,setGrid] = useState(gridList);*/
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userDetails"));
    setUid(userData.id);
    var data = JSON.stringify({});
    var config = {
      method: "get",
      url: apiBaseUrl + "/courses",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        localStorage.setItem("courseAllList", JSON.stringify(response.data));
        setCourseAllList(response.data);
        setPublishedCourses(
          response.data.result.filter((getCourse) => getCourse.isPublished == 1)
        );
        //console.log(response.data);
      } else {
        const allCourses = JSON.parse(localStorage.getItem("courseAllList"));
        setPublishedCourses(
          allCourses.result.filter((getCourse) => getCourse.isPublished == 1)
        );
      }
      setLoading(false);
    }
    fetchData(config);
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
  categoriesOptions.push({ name: "Authored Courses", id: "authored" });
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
        courseAllList && courseAllList.result
          ? courseAllList.result.filter(
              (getCourse) => getCourse.isPublished == 1
            )
          : [];
      setPublishedCourses(allCoursesList);
    } else if (value == "authored") {
      //filter to authored courses
      let isAuthored =
        courseAllList &&
        courseAllList.result.filter(
          (course) => course.author.id === uid && course.isPublished == 1
        );
      setPublishedCourses(isAuthored.length ? isAuthored : []);
    } else {
      //filter courses to selected category
      let filteredList =
        courseAllList &&
        courseAllList.result.map((course, index) => {
          let isInCategory =
            course.courseCategory &&
            course.courseCategory.filter(
              (courseCat) => courseCat.categoryId === value
            );
          let result = null;
          if (isInCategory.length) {
            result = course;
          }
          return result;
        });
      let finalFiltered = filteredList.filter(
        (course) => course !== null && course.isPublished == 1
      );
      setPublishedCourses(finalFiltered.length ? finalFiltered : []);
    }
  }
  function searchCourse(value) {
    //console.log(val);
    const { select } = selectSearch;
    setSelectSearch({ select: select, search: value });
    //console.log(select);
    if (select == "all" || !select) {
      //select all courses
      let allCoursesList =
        courseAllList && courseAllList.result
          ? courseAllList.result.filter(
              (course) =>
                course.title.toLowerCase().includes(value.toLowerCase()) &&
                course.isPublished == 1
            )
          : [];
      setPublishedCourses(allCoursesList);
    } else if (select == "authored") {
      //filter to authored courses
      let isAuthored =
        courseAllList &&
        courseAllList.result.filter(
          (course) =>
            course.author.id === uid &&
            course.title.toLowerCase().includes(value.toLowerCase()) &&
            course.isPublished == 1
        );
      setPublishedCourses(isAuthored.length ? isAuthored : []);
    } else {
      //filter courses to selected category
      let filteredList =
        courseAllList &&
        courseAllList.result.map((course, index) => {
          let isInCategory =
            course.courseCategory &&
            course.courseCategory.filter(
              (courseCat) =>
                courseCat.categoryId === select &&
                course.title.toLowerCase().includes(value.toLowerCase()) &&
                course.isPublished == 1
            );
          let result = null;
          if (isInCategory.length) {
            result = course;
          }
          return result;
        });
      let finalFiltered = filteredList.filter(
        (course) => course !== null && course.isPublished == 1
      );
      setPublishedCourses(finalFiltered.length ? finalFiltered : []);
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
              <span>
                {publishedCourses.length ? publishedCourses.length : 0} Results
              </span>{" "}
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
              <span>
                {publishedCourses.length ? publishedCourses.length : 0} Results
              </span>{" "}
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
            className="ClassesCourses-ListItems"
            gutter={[16, 16]}
            style={{ padding: "10px 0" }}
          >
            {GridType(
              publishedCourses,
              curGridStyle,
              setModal2Visible,
              router,
              loading
            )}
          </Row>
        </Col>
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
        <style jsx global>{`
          .ant-card-actions > li {
            padding: 0;
            margin: 0;
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
            color: #e69138;
            background-color: #ffffff;
            padding: 0;
          }
          /* .widget-holder-col .widget-header-row {
          padding: 5px 0;
          color: #e69138;
        } */
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
          .widget-holder-col .ant-card-hoverable {
            cursor: default;
          }
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
        `}</style>
      </Row>
    </div>
  );
};

const GridType = (courses, gridType, setModal2Visible, router, loading) => {
  let gridClass = "";
  let gridProps = { xs: 24, sm: 24, md: 8, lg: 8, xl: 6 };
  if (gridType == "list") {
    gridProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    gridClass = "grid-list";
  }
  const descTrimmerDecoder = (desc) => {
    let d = decodeURI(desc);
    let trimmedDesc = d.substr(0, 250);
    return trimmedDesc + "...";
  };
  console.log("courses", courses);
  return courses.length ? (
    <>
      {courses.map((course) => (
        <Col
          key={course.id}
          className={`gutter-row ${gridClass}`}
          {...gridProps}
        >
          <motion.div initial="hidden" animate="visible" variants={list}>
            <Card
              className={
                course.isPublished ? "published-course" : "unpublished-course"
              }
              extra={course.isPublished ? "Published" : "Unpublished"}
              hoverable
              style={{ width: "auto" }}
              cover={
                <Link
                  href={`/${linkUrl}/[course]/[...manage]`}
                  as={`/${linkUrl}/course/view/${course.id}`}
                >
                  <a>
                    <img
                      alt="example"
                      src={`${apidirectoryUrl}/Images/Course/thumbnail/${course.featureImage}`}
                    />
                  </a>
                </Link>
              }
              actions={[
                <Tooltip title="Sessions">
                  <div
                    className="class-icon-holder"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/${linkUrl}/classes/[...manageclasses]`,
                        `/${linkUrl}/classes/sessions/${course.id}`
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["far", "clock"]}
                      size="lg"
                      key="sessions"
                    />
                  </div>
                </Tooltip>,
                <Tooltip title="Enrollments">
                  <div
                    className="class-icon-holder"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/${linkUrl}/classes/[...manageclasses]`,
                        `/${linkUrl}/classes/enrollments/${course.id}`
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "users"]}
                      size="lg"
                      key="enrollments"
                    />
                  </div>
                </Tooltip>,
                <Tooltip title="Attendance">
                  <div
                    className="class-icon-holder"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(
                        `/${linkUrl}/classes/[...manageclasses]`,
                        `/${linkUrl}/classes/attendance/${course.id}`
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["far", "calendar-check"]}
                      size="lg"
                      key="attendance"
                      //onClick={() => setModal2Visible(true)}
                    />
                  </div>
                </Tooltip>,
              ]}
            >
              <Meta
                title={
                  <Link
                    href={`/${linkUrl}/[course]/[...manage]`}
                    as={`/${linkUrl}/course/view/${course.id}`}
                  >
                    <a>{course.title}</a>
                  </Link>
                }
                description={
                  <div>
                    <div>{descTrimmerDecoder(course.description)}</div>
                    <div>Public</div>
                  </div>
                }
              />
            </Card>
          </motion.div>
        </Col>
      ))}
    </>
  ) : (
    <div style={{ margin: "0 auto", minHeight: "1vh" }}>
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

export default ClassesCourseList;
