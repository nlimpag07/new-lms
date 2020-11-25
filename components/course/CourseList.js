import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

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
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
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

const CourseList = (props) => {
  //const { courselist } = props;

  const router = useRouter();
  //console.log(router);
  const { courseAllList, setCourseAllList } = useCourseList();
  //console.log(courseAllList)
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));

  useEffect(() => {
    /* var data = JSON.stringify({});
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
        //console.log(response.data);
      } else {
        const allCourses = JSON.parse(localStorage.getItem("courseAllList"));
        setCourseAllList(allCourses);
      }
    }
    fetchData(
      config
    );  */
    /* 
    if (!courseAllList) {
      const courselist = JSON.parse(localStorage.getItem("courseAllList"));
      //console.log(userData);
      setCourseAllList(courselist);
    } else {
      //put additional Filtration here
    } */
  }, []);
  return (
    <Row
      className="widget-container"
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
            <span>
              {courseAllList.length ? courseAllList.length : 0} Results
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
          className="AuthoredCourses-ListItems"
          gutter={[16, 16]}
          style={{ padding: "10px 0" }}
        >
          {GridType(
            courseAllList,
            curGridStyle,
            setModal2Visible,
            router,
            linkUrl
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

      <CourseCircularUi />
      <style jsx global>{`
        .ant-card-actions > li {
          padding: 0;
          margin: 0;
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
      `}</style>
    </Row>
  )/*  : (
    <Col>
      <div style={{ textAlign: "center" }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    </Col>
  ) */;
};

const GridType = (courses, gridType, setModal2Visible, router) => {
  let gridClass = "";
  let gridProps = { xs: 24, sm: 24, md: 8, lg: 8, xl: 6 };
  if (gridType == "list") {
    gridProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    gridClass = "grid-list";
  }
  courses = courses.result;

  return courses ? (
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
                      src={`${apidirectoryUrl}/Images/Course/${course.featureImage}`}
                    />
                  </a>
                </Link>
              }
              actions={[
                /* course.isPublished ? (
                  <Tooltip title="Unpublish">
                    <div
                      className="class-icon-holder"
                      onClick={() => setModal2Visible(true)}
                    >
                      <CloudDownloadOutlined
                        key="unpublish"                       
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <Tooltip title="Publish">
                    <div
                      className="class-icon-holder"
                      onClick={() => setModal2Visible(true)}
                    >
                      <CloudUploadOutlined key="publish" />
                    </div>
                  </Tooltip>
                ), */
                <Tooltip title="Edit">
                  <div
                    className="class-icon-holder"
                    onClick={() =>
                      router.push(
                        `/${linkUrl}/[course]/[...manage]`,
                        `/${linkUrl}/course/edit/${course.id}`
                      )
                    }
                  >
                    <EditOutlined key="edit" />
                  </div>
                </Tooltip>,
                <Tooltip title="View">
                  <div
                    className="class-icon-holder"
                    onClick={() =>
                      router.push(
                        `/${linkUrl}/[course]/[...manage]`,
                        `/${linkUrl}/course/view/${course.id}`
                      )
                    }
                  >
                    <EyeOutlined
                      key="View"
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
                    <a>{decodeURI(course.title)}</a>
                  </Link>
                }
                description={
                  <div>
                    <div>{decodeURI(course.description)}</div>
                    <div>Public</div>
                  </div>
                }
              />
            </Card>
          </motion.div>
        </Col>
      ))}
    </>
  ) : null;
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

export default CourseList;
