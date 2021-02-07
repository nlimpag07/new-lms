import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import RadialUI from "../theme-layout/course-circular-ui/RadialUI";
import axios from "axios";
import Link from "next/link";
import Loader from "../../components/theme-layout/loader/loader";

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
  Tabs,
  Empty,
  Alert,
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
import ReactPlayer from "react-player/lazy";
import CourseOverviewWidget from "./courseview-widgets/Course-Overview-Widget";
import CourseOutlineviewWidget from "./courseview-widgets/Course-Outlineview-Widget";
import CourseLearninOutcomesviewWidget from "./courseview-widgets/Course-LearningOutcomesview-Widget";
import CourseCompetenciesviewWidget from "./courseview-widgets/Course-Competenciesview-Widget";
import CourseEnrollmentsviewWidget from "./courseview-widgets/Course-Enrollmentsview-Widget";
import CourseReviewViewWidget from "./courseview-widgets/Course-Reviewview-Widget";
import CourseClone from "./courseview-widgets/Course-Clone-Widget";
import CourseDelete from "./courseview-widgets/Course-Delete-Widget";
import CoursePublish from "./course-publish/CoursePublish";
import Cookies from "js-cookie";

const { Meta } = Card;
/**TabPane declaration */
const { TabPane } = Tabs;

/**Panel used by collapsible accordion */
const { Panel } = Collapse;

const framerEffect = {
  visible: {
    opacity: 1,
    transition: {
      ease: "easeIn",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeIn",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};
const apidirectoryUrl = process.env.directoryUrl;
const homeUrl = process.env.homeUrl;
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

const CourseView = ({ course_id }) => {
  var [courseId, setCourseId] = useState(course_id);

  const { courseAllList } = useCourseList();
  const [course, setCourse] = useState("");
  const [modal2Visible, setModal2Visible] = useState("");
  const [pubmodal2Visible, setPubModal2Visible] = useState("");

  const [loading, setLoading] = useState(true);

  const [course_outline, setCourse_outline] = useState("");
  const [course_outcome, setCourse_outcome] = useState("");
  const [course_competencies, setCourse_competencies] = useState("");
  const [course_enrollments, setCourse_enrollments] = useState("");
  const [course_reviews, setCourse_reviews] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  var [courseActionModal, setCourseActionModal] = useState({
    StateModal: false,
    modalOperation: "",
  });
  const showModal = (modalOperation) => {
    setCourseActionModal({
      StateModal: true,
      modalOperation: modalOperation,
    });
  };

  const hideModal = () => {
    setCourseActionModal({
      StateModal: false,
      modalOperation: "",
    });
  };
  /*menulists used by radial menu */
  const menulists = [
    {
      title: "Edit",
      icon: "&#xf044;",
      url: `"/${linkUrl}/[course]/edit"`,
      urlAs: `/${linkUrl}/course/edit/${course_id}`,
    },
    {
      title: "Delete",
      icon: "&#xf056;",
      url: `#`,
      urlAs: `#`,
      callback: "delete",
    },

    {
      title: "Print",
      icon: "&#xf02f;",
      url: `/${linkUrl}/dashboard`,
      urlAs: `/${linkUrl}/course/add`,
      callback: "print",
    },
    {
      title: "Clone",
      icon: "&#xf0c5;",
      url: `/${linkUrl}/course`,
      urlAs: `/${linkUrl}/course/add`,
      callback: "clone",
    },
    {
      title: "Export",
      icon: "&#xf019;",
      url: `/${linkUrl}/course`,
      urlAs: `/${linkUrl}/course/add`,
      callback: "export",
    },
  ];

  useEffect(() => {
    setCourseId(course_id);
    let allCourse = JSON.parse(localStorage.getItem("courseAllList"));
    setCourse(
      allCourse.result.filter((getCourse) => getCourse.id == course_id)
    );

    var config = {
      /* method: "get",
      url: apiBaseUrl + "/courseoutline/" + course_id, */
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios
      .all([
        axios.get(apiBaseUrl + "/courseoutline/" + course_id, config),
        axios.get(apiBaseUrl + "/courseoutcome/" + course_id, config),
        axios.get(apiBaseUrl + "/coursecompetencies/" + course_id, config),
        axios.get(apiBaseUrl + "/enrollment/" + course_id, config),
      ])
      .then(
        axios.spread(
          (courseoutline, courseoutcome, competencies, enrollments) => {
            /* console.log('Course Outline: ',!!courseoutline.data.response)
            console.log('Course Outline: ',courseoutline.data) */
            courseoutline.data.result
              ? setCourse_outline(courseoutline.data)
              : setCourse_outline(null);
            courseoutcome.data.result
              ? setCourse_outcome(courseoutcome.data)
              : setCourse_outcome(null);
            competencies.data.result
              ? setCourse_competencies(competencies.data)
              : setCourse_competencies(null);
            enrollments.data.result
              ? setCourse_enrollments(enrollments.data)
              : setCourse_enrollments(null);
            enrollments.data.result
              ? setCourse_reviews(enrollments.data)
              : setCourse_reviews(null);
          }
        )
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
    /* async function fetchData(config) {      
      const response = await axios(config);
      if (response) {
        //localStorage.setItem("courseAllList", JSON.stringify(response.data));
        //setCourseAllList(response.data);
        console.log(response.data);
      } else {
        //const userData = JSON.parse(localStorage.getItem("courseAllList"));
        //setCourseAllList(userData);
      }
    }
    fetchData(config); */

    setLoading(false);
  }, [course_id]);

  let courseDetails = course[0] || [];
  let {
    id,
    featureImage,
    featureVideo,
    courseLanguage,
    courseCategory,
    title,
    description,
    courseInstructor,
    courseOutline,
    courseType,
    courseLevel,
    courseTag,
    relatedCourse,
    isPublished,
  } = courseDetails;
  featureImage = `${apidirectoryUrl}/Images/Course/thumbnail/${featureImage}`;
  featureVideo = `${apidirectoryUrl}/Video/Course/${featureVideo}`;
  //console.log("courseDetails", courseDetails);
  let lessons = course_outline ? course_outline.totalRecords : 0;
  const listData = [
    {
      title: `${
        courseType &&
        courseType.map((type, index) => {
          return type.courseType.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "video"]} size="3x" />,
    },
    {
      title: lessons > 1 ? `${lessons} Lessons` : `${lessons} Lesson`,
      avatar: <FontAwesomeIcon icon={["far", "list-alt"]} size="3x" />,
    },
    {
      title: `${courseDetails.durationTime} ${courseDetails.durationType}`,
      avatar: <FontAwesomeIcon icon={["far", "clock"]} size="3x" />,
    },
    {
      title: `${
        courseCategory &&
        courseCategory.map((ctgry, index) => {
          return ctgry.category.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["far", "keyboard"]} size="3x" />,
    },
    {
      title: `${
        courseLanguage &&
        courseLanguage.map((lang, index) => {
          return lang.language.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "globe-americas"]} size="3x" />,
    },
    {
      title: `${courseDetails.passingGrade}% passing grade`,
      avatar: <FontAwesomeIcon icon={["fas", "chart-line"]} size="3x" />,
    },
    {
      title: `${
        courseLevel &&
        courseLevel.map((clevel, index) => {
          return clevel.level.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "star"]} size="3x" />,
    },
  ];
  function onShareClick(e) {
    e.preventDefault();
    var copyText = document.getElementById("shareCourse");
    //document.getElementById("shareCourse").innerText;
    copyText.select();
    document.execCommand("copy");
    setCopySuccess("Copied!");
    //console.log("The text:", copyText);
  }
  function onShareMouseOut(e) {
    e.preventDefault();
    setCopySuccess("");
    //console.log("The text:", copyText);
  }

  return course.length ? (
    <motion.div initial="hidden" animate="visible" variants={framerEffect}>
      <div className="common-holder">
        <Row
          className="widget-container Course-View"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          /* style={{ margin: "1rem 0px 4rem 0" }} */
        >
          <Col
            className="gutter-row widget-holder-col"
            xs={24}
            sm={24}
            md={24}
            lg={24}
          >
            <Row align="middle">
              <Col className="h1-titles" xs={24} sm={24} md={24} lg={16} xl={18}>
                <h1>{title}</h1>
              </Col>
              {linkUrl != "learner" && (
                <CoursePublish
                  isPublished={isPublished}
                  title={title}
                  course_id={course_id}
                />
              )}
            </Row>
            <Row
              className="Course-View-Details"
              gutter={[16, 16]}
              style={{ padding: "10px 0" }}
            >
              {/* Left Side */}
              <Col xs={24} sm={24} md={12} lg={6}>
                <Row className="ImageWrapper">
                  <Col xs={24}>
                    <img
                      alt={`${title} Featured Image`}
                      src={featureImage}
                      onClick={() => setModal2Visible(true)}
                    />
                  </Col>
                </Row>
                <Row className="Icon-Listed-Data">
                  <Col xs={24}>
                    <List
                      itemLayout="horizontal"
                      dataSource={listData}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={item.avatar}
                            title={item.title}
                          />
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
                <Row className="Course-Tags">
                  <Col xs={24}>
                    <h3>TAGS</h3>
                    {courseTag &&
                      courseTag.map((tags, index) => (
                        <button key={index} className="tag-button">
                          {tags.tag.name}
                        </button>
                      ))}
                  </Col>
                </Row>
                <Row className="Course-Tags">
                  <Col xs={24}>
                    <h3>SHARE</h3>
                    {
                      <div>
                        <Input
                          id="shareCourse"
                          value={`${homeUrl}/course/view/${id}`}
                          readOnly
                          style={{ maxWidth: "150px" }}
                        />
                        <Button
                          onClick={onShareClick}
                          onMouseOut={onShareMouseOut}
                        >
                          Copy
                        </Button>{" "}
                        {copySuccess}
                      </div>
                    }
                  </Col>
                </Row>
                <Row className="Course-Tags">
                  <Col xs={24}>
                    <h3>DEMOS</h3>
                    <Col xs={24} sm={12} className="ImageWrapper demo-thumb">
                      <img
                        alt={`${title} Featured Image`}
                        src={featureImage}
                        onClick={() => setModal2Visible(true)}
                      />
                    </Col>
                  </Col>
                </Row>
              </Col>
              {/* Right Side */}
              <Col xs={24} sm={24} md={12} lg={18} className="Course-Tabs">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="OVERVIEW" key="1">
                    <CourseOverviewWidget course_details={courseDetails} />
                  </TabPane>
                  <TabPane tab="COURSE OUTLINE" key="2">
                    <CourseOutlineviewWidget course_outline={course_outline} />
                  </TabPane>
                  <TabPane tab="LEARNING OUTCOMES" key="3">
                    <CourseLearninOutcomesviewWidget
                      course_outcome={course_outcome}
                    />
                  </TabPane>
                  <TabPane tab="COMPETENCIES" key="4">
                    <CourseCompetenciesviewWidget
                      course_competencies={course_competencies}
                    />
                  </TabPane>
                  {linkUrl != "learner" && (
                    <TabPane tab="ENROLLMENTS" key="5">
                      <CourseEnrollmentsviewWidget
                        course_id={course_id}
                        course_enrollments={course_enrollments}
                      />
                    </TabPane>
                  )}
                  <TabPane tab="REVIEWS" key="6">
                    <CourseReviewViewWidget
                      course_id={course_id}
                      course_reviews={course_reviews}
                    />
                  </TabPane>
                </Tabs>
              </Col>
              {/* {GridType(courseAllList, curGridStyle, setModal2Visible, router)} */}
            </Row>
          </Col>
          <Modal
            title={title}
            centered
            visible={modal2Visible}
            onOk={() => setModal2Visible(false)}
            onCancel={() => setModal2Visible(false)}
            maskClosable={false}
            destroyOnClose={true}
            width="70%"
            className="videoModal"
          >
            <div className="demoModalBody">
              <ReactPlayer
                playing={true}
                url={featureVideo}
                controls={true}
                width="100%"
                height="auto"
                config={{
                  youtube: {
                    playerVars: { showinfo: 0 },
                  },
                }}
              />
            </div>
          </Modal>
          {linkUrl !== "learner" && (
            <Modal
              title={`${courseActionModal.modalOperation.toUpperCase()}: ${title.toUpperCase()}`}
              centered
              visible={courseActionModal.StateModal}
              onOk={() => hideModal(courseActionModal.modalOperation)}
              onCancel={() => hideModal(courseActionModal.modalOperation)}
              maskClosable={false}
              destroyOnClose={true}
              width="50%"
              cancelButtonProps={{ style: { display: "none" } }}
              okButtonProps={{ style: { display: "none" } }}
              className="CVModalOperations"
            >
              {courseActionModal.modalOperation == "clone" ? (
                <CourseClone
                  operation={courseActionModal.modalOperation}
                  hideModal={hideModal}
                  courseInfo={{ course_id: course_id, title: title }}
                  setLoading={setLoading}
                />
              ) : courseActionModal.modalOperation == "add" ? (
                "Hello Add"
              ) : courseActionModal.modalOperation == "approve" ? (
                "Hello Approve"
              ) : courseActionModal.modalOperation == "delete" ? (
                <CourseDelete
                  operation={courseActionModal.modalOperation}
                  hideModal={hideModal}
                  courseInfo={{ course_id: course_id, title: title }}
                  setLoading={setLoading}
                />
              ) : (
                "Default"
              )}
            </Modal>
          )}
          {linkUrl !== "learner" && (
            <RadialUI
              listMenu={menulists}
              position="bottom-right"
              iconColor="#8998BA"
              toggleModal={showModal}
            />
          )}
          {/* <CourseCircularUi /> */}
        </Row>
      </div>
      <style jsx global>{`
        .CVModalOperations .ant-modal-footer {
          border-top: none !important;
        }
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
        .Course-View h2,
        .Course-View h3,
        .Course-View h5 {
          color: #e69138;
        }
        .Course-View .ant-list-items {
          margin: 1rem 0 0 0;
        }
        .Course-View .ant-list-item-meta {
          align-items: center;
        }
        .Course-View .ant-list-item {
          border-bottom: none;
          padding: 1rem 0;
        }
        .Course-Tags h3 {
          margin: 2rem 0 0.5rem 0;
        }
        .Course-Tags .tag-button {
          border-radius: 5px;
          border: 1px solid #333333;
          padding: 5px;
          margin-right: 15px;
          background-color: #ffffff;
        }
        .videoModal .ant-modal-header,
        .videoModal .ant-modal-footer {
          display: none;
        }
        .videoModal .ant-modal-body {
          padding: 0;
        }
        .videoModal .ant-modal-close {
          top: -3.5rem;
          right: -3.5rem;
        }
        .Course-View img:hover {
          cursor: pointer;
        }
        .Course-Tabs .ant-tabs-nav-wrap {
          background-color: #eeeeee;
        }
        .Course-Tabs .ant-tabs-tab:hover {
          color: #e69138;
        }
        .Course-Tabs .ant-tabs-ink-bar {
          background: #e69138;
        }

        .Course-Tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #e69138;
        }
        .Course-Tabs .ant-tabs-tab-btn {
          font-weight: 500;
        }
        .Course-Tabs .ant-tabs-tab-btn:focus,
        .Course-Tabs .ant-tabs-tab-remove:focus,
        .Course-Tabs .ant-tabs-tab-btn:active,
        .Course-Tabs .ant-tabs-tab-remove:active {
          color: #e69138;
        }
        .tab-content .related-courses a {
          margin-right: 1rem;
        }
        .viewStatusReq {
          color: #666666;
          text-aling: right;
        }
        /* .viewStatusReq-button {
          padding-right: 4rem !important;
          padding-left: 4rem !important;
        } */
      `}</style>
    </motion.div>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default CourseView;
