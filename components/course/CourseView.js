import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import RadialUI from "../theme-layout/course-circular-ui/radial-ui";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
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
  InputNumber,
  Form,
  Cascader,
  Collapse,
  Typography,
  List,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  VideoCameraFilled,
  ProfileOutlined,
} from "@ant-design/icons";
import { useCourseList } from "../../providers/CourseProvider";
import Error from "next/error";

const { Meta } = Card;
/**TextArea declaration */
const { TextArea } = Input;
/*menulists used by radial menu */
const menulists = [
  {
    title: "Save",
    icon: "&#xf055;",
    active: true,
    url: "/instructor/[course]/edit",
    urlAs: "/instructor/course/edit",
    callback: "Save",
  },
];
/**Panel used by collapsible accordion */
const { Panel } = Collapse;

const framerEffect = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const CourseView = ({ courseId }) => {
  const { courseAllList } = useCourseList();
  const [course, setCourse] = useState("");
  var courseData = "";
  if (courseAllList) {
    courseData = courseAllList.filter((getCourse) => getCourse.id == courseId);
  }
  console.log("Default getting CourseData ", courseData);
  useEffect(() => {
    if (!courseData) {
      let allCourse = JSON.parse(localStorage.getItem("courseAllList"));
      //console.log(userData);
      setCourse(allCourse.filter((getCourse) => getCourse.id == courseId));
    } else {
      //put additional Filtration here
      setCourse(courseData);
    }
  }, []);

  let courseDetails = course[0] || "";
  console.log("CourseDetails ", courseDetails);
  let { courseLanguage } = courseDetails;
  let courselanguage = [];
  if (courseLanguage) {

    courseLanguage.map((lang, index) => {      
      //console.log(lang.language)
      return {...courselanguage, lang}
      });
      console.log(courselanguage)
  }
  
  const listData = [
    {
      title: "Ant Design Title 1",
      avatar: <FontAwesomeIcon icon={["fas", "video"]} size="3x" />,
    },
    {
      title: "Ant Design Title 2",
      avatar: <FontAwesomeIcon icon={["far", "list-alt"]} size="3x" />,
    },
    {
      title: `${courseDetails.durationTime} ${courseDetails.durationType}`,
      avatar: <FontAwesomeIcon icon={["far", "clock"]} size="3x" />,
    },
    {
      title: "Ant Design Title 4",
      avatar: <FontAwesomeIcon icon={["far", "keyboard"]} size="3x" />,
    },
    {
      title: `${courseLanguage}`,
      avatar: <FontAwesomeIcon icon={["fas", "globe-americas"]} size="3x" />,
    },
    {
      title: `${courseDetails.passingGrade}% passing grade`,
      avatar: <FontAwesomeIcon icon={["fas", "chart-line"]} size="3x" />,
    },
    {
      title: "Ant Design Title 4",
      avatar: <FontAwesomeIcon icon={["fas", "star"]} size="3x" />,
    },
  ];

  return course.length ? (
    <Row
      className="widget-container Course-View"
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
          <Col xs={24}>
            <h1 className="widget-title">{courseDetails.title}</h1>
          </Col>
        </Row>
        <Row
          className="Course-View-Details"
          gutter={[16, 16]}
          style={{ padding: "10px 0" }}
        >
          {/* Left Side */}
          <Col xs={6}>
            <Row className="ImageWrapper">
              <Col>
                <img
                  alt={`${courseDetails.title} Featured Image`}
                  src={courseDetails.featureImage}
                />
              </Col>
            </Row>
            <Row className="">
              <Col xs={24}>
                <List
                  itemLayout="horizontal"
                  dataSource={listData}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.avatar}
                        title={<a href="https://ant.design">{item.title}</a>}
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Col>
          {/* Right Side */}
          <Col xs={18}>
            <h1 className="widget-title">{courseDetails.title}</h1>
          </Col>
          {/* {GridType(courseAllList, curGridStyle, setModal2Visible, router)} */}
        </Row>
      </Col>
      {/* <Modal
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
      </Modal> */}

      <CourseCircularUi />
      <style jsx global>{`
        .Course-View .ImageWrapper img {
          width: 100%;
          height: 100%;
        }
        .Course-View h1 {
          font-size: 1.5rem;
        }
        .AuthoredCourses-ListItems .ant-card-actions > li {
          padding: 12px 0;
          margin: 0;
        }
        .AuthoredCourses-ListItems .ant-card-actions > li:hover {
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
      `}</style>
    </Row>
  ) : (
    <Error statusCode={404} />
  );
};

export default CourseView;
