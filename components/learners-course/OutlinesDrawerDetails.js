import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import { useAuth } from "../../providers/Auth";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import AssessmentProcess from "./AssessmentProcessPopup/AssessmentProcess";
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
  Rate,
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

const OutlinesDrawerDetails = ({
  outlineDetails,
  setdrawerVisible,
  drawerVisible,
  learnerId,
  spinner,
  setSpinner,
  setOutlineAssessmentModal,
  setOutlineFinishModal,
  setStartOutline,
  startOutline
}) => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const [reviewDetails, setReviewDetails] = useState([]);
  const [outlineStatus, setOutlineStatus] = useState(0);
  const [articulateModal2Visible, setArticulateModal2Visible] = useState(false);

  //console.log("Outline Details:", outlineDetails);
  //console.log("startOutline:", startOutline);

  let { isApproved, startDate, endDate } = outlineDetails;
  //const outlineId = outlineDetails.id;
  let {
    id,
    description,
    title,
    duration,
    courseId,
    featureImage,
    interactiveVideo,
    courseAssessment,
    courseOutlineMedia,
    courseOutlineMilestone,
    courseOutlinePrerequisite,
    courseSessionOutline,
    learnerCourseOutline,
    outlineStatusId,
  } = outlineDetails;

  useEffect(() => {}, [drawerVisible]);
  useEffect(() => {
    if(startOutline){
      setArticulateModal2Visible(true)
    }
  }, [startOutline]);

  function onStartOrContinueLesson(e) {
    e.preventDefault();
    setSpinner(true);
    //if approved and has not started
    //Check if the Learner has not started this lesson
    if (!learnerCourseOutline.length) {
      //Learner has not started the lesson
      //Update lesson enrollment for data tracking
      var config = {
        method: "post",
        url: apiBaseUrl + "/learner/StartCourseOutline",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: {
          courseOutlineId: id,
          learnerId: learnerId,
          hoursTaken: 0,
          score: 0,
        },
      };
      async function fetchData(config) {
        try {
          const response = await axios(config);
          if (response) {
            //setOutcomeList(response.data.result);
            let theRes = response.data.response;
            //console.log("Response", response.data);
            // wait for response if the verification is true
            if (theRes) {
              //true
              //setSpinner(true);
              setdrawerVisible(true);
              setStartOutline(true)
              //console.log()
              //Redirect to Course Outline
              /* router.push(
                `/${linkUrl}/my-courses/[courseId]/[outlines]`,
                `/${linkUrl}/my-courses/${id}/learning-outlines`
              ); */
            } else {
              //false
              setSpinner(false);
              Modal.error({
                title: "Error: Unable to Start Lesson",
                content:
                  response.data.message + " Please contact Technical Support",
                centered: true,
                width: 450,
                onOk: () => {
                  //setdrawerVisible(false);
                  visible: false;
                },
              });
            }
          }
        } catch (error) {
          const { response } = error;
          const { request, data } = response; // take everything but 'request'

          //console.log('Error Response',data.message);
          setSpinner(false);
          Modal.error({
            title: "Error: Unable to Start Lesson",
            content: data.message + " Please contact Technical Support",
            centered: true,
            width: 450,
            onOk: () => {
              //setdrawerVisible(false);
              visible: false;
            },
          });
        }
        //setLoading(false);
      }
      fetchData(config);
    } else {
      //The learner already started this lesson, just
      //show the lesson
      //setdrawerVisible(false);
      setStartOutline(false)
      setArticulateModal2Visible(true);
      setSpinner(false);
      /* router.push(
        `/${linkUrl}/my-courses/[courseId]/[outlines]`,
        `/${linkUrl}/my-courses/${id}/learning-outlines`
      ); */
    }
  }

  //console.log(interactiveVideo);
  const ResourcesList = courseOutlineMedia.map((outlinemedia, index) => {
    var resoureIcon = "";
    switch (outlinemedia.fileType) {
      case "PDF":
        resoureIcon = <FontAwesomeIcon icon={["fas", "file-pdf"]} size="lg" />;
        break;

      case "DOCX":
        resoureIcon = <FontAwesomeIcon icon={["fas", "file-word"]} size="lg" />;
        break;

      case "ZIP":
        resoureIcon = (
          <FontAwesomeIcon icon={["fas", "file-archive"]} size="lg" />
        );
        break;

      default:
        resoureIcon = "";
        break;
    }
    return (
      <div key={index} style={{ marginTop: "5px" }}>
        <Link
          href={`${outlinemedia.resourceFile}`}
          as={`${outlinemedia.resourceFile}`}
        >
          <a>
            {resoureIcon} {outlinemedia.fileName}
          </a>
        </Link>
      </div>
    );
  });
  //for Drawer Control buttons
  const DrawerButtons = (outlineStatusId) => {
    let statusButtons = "";
    switch (outlineStatusId) {
      case 0:
        statusButtons = (
          <Button
            type="primary"
            shape="round"
            size="large"
            danger
            onClick={onStartOrContinueLesson}
          >
            Start Lesson
          </Button>
        );
        break;

      case 1:
        statusButtons = (
          <Button
            type="primary"
            shape="round"
            size="large"
            onClick={onStartOrContinueLesson}
          >
            Continue Lesson
          </Button>
        );
        break;

      case 2:
        statusButtons = (
          <>
            <Button type="dashed" shape="round" size="large">
              Completed
            </Button>
            <Button type="default" shape="round" size="large">
              Next
            </Button>
          </>
        );
        break;

      default:
        //statements;
        break;
    }
    return statusButtons;
  };

  /* const learningOutcomeData = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ]; */

  const OnArticulateModalClose = () => {
    /* let statusButtons = "";
    
    return statusButtons; */
    setSpinner(true);
    //console.log("Articulate Modal Status: Closed");
    //console.log("Run assessments:", courseAssessment);

    var postConfig = {
      method: "post",
      url: apiBaseUrl + "/learner/courseoutline",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        courseOutlineId: id,
        learnerId: learnerId,
        hoursTaken: 0,
        score: 100,
      },
    };
    async function postData(postConfig) {
      try {
        const response = await axios(postConfig);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data.response;
          console.log("Successfully Posted Data", response.data);
          // wait for response if the verification is true
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'

        //console.log('Error Response',data.message);
        setSpinner(false);
        Modal.error({
          title: "Error: Unable to Start Lesson",
          content: data.message + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
    }
    postData(postConfig);

    setArticulateModal2Visible(false);
    setdrawerVisible(false);

    if (courseAssessment.length) {
      //Run the Assessment
      setOutlineAssessmentModal(true);
    } else {
      setSpinner(false);
      //Don't run assessment, refresh the outlineList instead
      //setOutlineAssessmentModal(false);
      setOutlineFinishModal(true);
      //window.location.reload();
      //router.push(`/learner/my-courses/${courseId}/learning-outlines`);
    }
  };

  return (
    <Drawer
      //title={title} /* {`${courseDetails != "" ? courseDetails.title : ""}`} */
      height={`60vh`}
      onClose={() => setdrawerVisible(false)}
      visible={drawerVisible}
      bodyStyle={{ paddingBottom: 0 }}
      placement={`bottom`}
      maskClosable={false}
      destroyOnClose={true}
      className="drawer-course-details"
    >
      <motion.div initial="hidden" animate="visible" variants={list}>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          <Col xs={24} sm={24} md={6} offset={2}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
              <Col xs={24} sm={12} md={24}>
                <h1>{title}</h1>
                <img
                  alt="example"
                  src={`${apidirectoryUrl}/Images/courseOutline/${featureImage}`}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24}></Col>
            </Row>
            <Row>
              <Col xs={24} sm={12} md={12}>
                <h2 style={{ marginTop: "10px" }}>Resources</h2>
              </Col>
              <Col xs={24} sm={12} md={12} style={{ textAlign: "end" }}>
                <Button
                  size="middle"
                  /* onClick={onStartOrContinueLesson} */
                  style={{ marginTop: "10px" }}
                >
                  Download All
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>{ResourcesList}</Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={14}>
            <Row>
              <Col xs={24} sm={24} md={24} style={{ textAlign: "end" }}>
                <div xs={24} className="drawerActionButtons">
                  {DrawerButtons(outlineStatusId)}
                  {/* {outlineStatus ? (
                    <Button
                      type="primary"
                      shape="round"
                      size="large"
                      danger
                      onClick={onStartOrContinueLesson}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      shape="round"
                      size="large"
                      onClick={onStartOrContinueLesson}
                    >
                      Start Course
                    </Button>
                  )} */}
                  {/*  <Button
                    shape="round"
                    size="large"
                    onClick={() =>
                      router.push(
                        `/${linkUrl}/course-catalogue/[...manage]`,
                        `/${linkUrl}/course-catalogue/view/${id}`
                      )
                    }
                  >
                    Course Details
                  </Button> */}
                </div>
              </Col>
            </Row>
            <Row>
              <h2>In this lesson</h2>
              <div className="course-desc">
                <p>
                  {decodeURI(description)}
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                  ea commodo consequat.
                </p>
              </div>
              {/* <div style={{marginTop:"16px"}} className="outlineDrawerLearningOutcomes">
                <h2>Learning Outcome</h2>
                <div>
                  <List
                    size="small"                    
                    dataSource={learningOutcomeData}
                renderItem={(item) => <List.Item><FontAwesomeIcon icon={["far", "check-circle"]} size="lg" style={{color:"e69138"}} /> {" "}{item}</List.Item>}
                  />
                </div>
              </div> */}
            </Row>
          </Col>
        </Row>
      </motion.div>
      <Modal
        title={title}
        centered
        visible={articulateModal2Visible}
        onOk={() => setArticulateModal2Visible(false)}
        onCancel={OnArticulateModalClose}
        maskClosable={false}
        destroyOnClose={true}
        width="95%"
        className="articulateVideoModal"
      >
        <div className="demoModalBody">
          <iframe
            src={`${apidirectoryUrl}/Video/courseOutline/${interactiveVideo}/story.html`}
            width="100%"
            height="850"
            frameBorder="0"
          ></iframe>
        </div>
      </Modal>
      {/*  {outlineAssessmentModal && (
        <AssessmentProcess
          assessment={courseAssessment}
          outlineAssessmentModal={outlineAssessmentModal}
          setOutlineAssessmentModal={setOutlineAssessmentModal}
          learnerId={learnerId}
          spinner={spinner}
          setSpinner={setSpinner}
        />
      )} */}
      <style jsx global>{`
        .drawer-course-details .ant-drawer-title {
          font-size: 1.2rem;
        }
        .drawer-course-details .ant-drawer-content {
          background-color: #f9f9f9;
        }
        .drawer-course-details .ant-drawer-content h1,
        .drawer-course-details .ant-drawer-content h2 {
          color: #e69138;
        }
        .drawer-course-details .ant-drawer-content a.drawer-related-course {
          margin-right: 1rem;
        }
        .drawer-course-details .ant-drawer-content .course-desc {
          min-height: 150px;
        }
        .drawer-course-details .ant-drawer-content .course-desc p {
          font-size: 16px;
        }
        .star-rating {
          font-size: 1.2rem;
          text-align: right;
        }
        .star-rating .ant-rate {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        .star-rating .ant-rate-star:not(:last-child) {
          margin-right: 15px;
        }
        .drawer-course-details .ant-drawer-content .Course-Tags {
          margin-top: 2rem;
        }
        .drawer-course-details .ant-drawer-content .Course-Tags .tag-button {
          border-radius: 5px;
          border: 1px solid #333333;
          padding: 5px;
          margin-right: 15px;
          background-color: #ffffff;
        }
        .drawer-course-details .ant-drawer-content .drawerActionButtons {
          margin-bottom: 1rem;
        }
        .drawer-course-details .ant-drawer-content .drawerActionButtons button {
          margin-right: 1rem;
          font-size: 1rem;
        }
        .outlineDrawerLearningOutcomes .ant-list-sm .ant-list-item {
          padding: 8px 0px !important;
        }
        .outlineDrawerLearningOutcomes .ant-list-split .ant-list-item {
          border-bottom: 0px solid #f0f0f0 !important;
        }
        .articulateVideoModal .ant-modal-header,
        .articulateVideoModal .ant-modal-footer {
          display: none;
        }
        .articulateVideoModal .ant-modal-body {
          padding: 0;
        }
        .articulateVideoModal .ant-modal-close {
          top: -0.5rem;
          right: -0.5rem;
        }
      `}</style>
    </Drawer>
  );
};

export default OutlinesDrawerDetails;
