import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";

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
  Drawer,
  Rate,
  List,
  Steps,
  message,
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

const { Step } = Steps;

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

const AssessmentProcess = ({
  assessment,
  outlineAssessmentModal,
  setOutlineAssessmentModal,
  learnerId,
  spinner,
  setSpinner,
}) => {
  const router = useRouter();
  console.log("AssessmentModal Status", outlineAssessmentModal);
  //reassign assessment
  const { courseAssessment } = assessment;
  const outlineId = assessment ? assessment.id : null;
  const outlineTitle = assessment ? assessment.title : null;
  //console.log("Assessment Details:", courseAssessment);
  const assessmentDetails = courseAssessment.length
    ? courseAssessment[0]
    : null;
  let {
    id,
    title,
    assessmentTypeId,
    attempts,
    basedType,
    isAttempts,
    isImmediate,
    isShuffle,
    passingGrade,
    duration,
    fromDate,
    toDate,
  } = assessmentDetails;
  console.log("Assessment Details:", assessmentDetails);
  const stepQuestions = assessmentDetails.courseAssessmentItem.map(
    (question, index) => {
      let questionData = {
        questionAssessmentId:question.assessmentId?question.assessmentId:0,
        questionId:question.id?question.id:null,
        questionTypeId: question.assessmentItemTypeId?question.assessmentItemTypeId:null,
        questionTypeName: question.assessmentItemType?question.assessmentItemType.name:null,
        questionName: question.name?question.name:null,
        questionChoices:question.courseAssessmentItemChoices?question.courseAssessmentItemChoices:null,
        questionIsFalse: question.isFalse?question.isFalse:0,
        questionIsTrue: question.isTrue?question.isTrue:0,
        questionDuration:question.duration?question.duration:0,
        questionIsShuffle:question.isShuffle?question.isShuffle:0,
        questionLearnerCourseAssessment:question.learnerCourseAssessment?question.learnerCourseAssessment:null,
        questionMaxLength:question.maxLength?question.maxLength:0,
        questionMinLength:question.minLength?question.minLength:0,

      };
      return questionData;
    }
  );
  console.log(stepQuestions)
  const steps = [
    {
      title: "First Question",
      content: "First-content",
    },
    {
      title: "Second",
      content: "Second-content",
    },
    {
      title: "Last",
      content: "Last-content",
    },
    {
      title: "First",
      content: "First-content",
    },
    {
      title: "Second",
      content: "Second-content",
    },
    {
      title: "Last",
      content: "Last-content",
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    setSpinner(false);
  }, [outlineAssessmentModal]);

  function onStartOrContinueLesson(e) {
    e.preventDefault();
    setSpinner(true);
    //if approved and has not started
    //Check if the Learner has not started this lesson
    if (!learnerCourseOutline.length) {
      //Learner has not started the lesson
      //Update lesson enrollment for data tracking
      var config = {
        method: "get",
        url: apiBaseUrl + "/Picklist/AssessmentItemType" + id,
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
              setSpinner(false);
              setdrawerVisible(false);
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

      setArticulateModal2Visible(true);
      setSpinner(false);
    }
  }

  const OnAssessmentModalClose = () => {
    /* let statusButtons = "";
    
    return statusButtons; */
    setSpinner(true);

    console.log("Submit Assessment");
    //setArticulateModal2Visible(false);
    //setdrawerVisible(false);
  };

  return (
    <Row>
      <Modal
        title={`Assessment: ${title}`}
        centered
        visible={outlineAssessmentModal}
        onOk={() => setOutlineAssessmentModal(false)}
        /* onCancel={OnAssessmentModalClose} */
        onCancel={() => setOutlineAssessmentModal(false)}
        maskClosable={false}
        destroyOnClose={true}
        width="70%"
        className="outlineAssessmentModal"
        maskStyle={{ backgroundColor: "rgb(0 0 0 / 91%)" }}
      >
        <div className="assessmentModalBody">
          <h1>Assessment</h1>
          <Row style={{ border: "1px dashed #999999", padding: "20px" }}>
            <Col xs={32} sm={24} md={24}>
              <Row>
                <Col xs={24} sm={10} md={10}>
                  <p>
                    <b>Assessment Title:</b> {title}
                  </p>
                  <p>
                    <b>Assessment Type:</b>{" "}
                    {assessmentTypeId == 1
                      ? "Assignment"
                      : assessmentTypeId == 2
                      ? "Exam"
                      : "Quiz"}
                  </p>
                  <p>
                    <b>Attempts:</b> {isAttempts == 1 ? attempts : "Unlimited"}
                  </p>
                </Col>
                <Col xs={24} sm={10} md={10}>
                  <p>
                    <b>Lesson Link:</b> {outlineTitle}
                  </p>
                  <p>
                    <b>Assessment Duration:</b>{" "}
                    {duration == 1 ? duration : "No Time Limit"}
                  </p>
                  <p>
                    <b>To be Taken:</b>{" "}
                    {isImmediate == 1
                      ? "Immediately"
                      : fromDate + " - " + toDate}
                  </p>
                </Col>
                <Col xs={24} sm={4} md={4} style={{ textAlign: "center" }}>
                  <h2 style={{ fontSize: "3rem", marginBottom: "0" }}>
                    {passingGrade}
                  </h2>
                  <p>
                    <b>Passing Grade:</b>
                  </p>
                </Col>
              </Row>
            </Col>
            <Divider orientation="left" plain></Divider>
            <Col xs={32} sm={24} md={24}>
              <Steps current={currentStep}>
                {stepQuestions.map((item) => (
                  <Step key={item.questionTypeName} title={item.questionTypeName} />
                ))}
              </Steps>
              <div className="steps-content">{stepQuestions[currentStep].content}</div>
              <div className="steps-action">
                {currentStep < stepQuestions.length - 1 && (
                  <Button type="primary" onClick={() => next()}>
                    Next
                  </Button>
                )}
                {currentStep === stepQuestions.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => message.success("Processing complete!")}
                  >
                    Done
                  </Button>
                )}
                {currentStep > 0 && (
                  <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                    Previous
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
      <style jsx global>{`
        .outlineAssessmentModal .ant-modal-header,
        .outlineAssessmentModal .ant-modal-footer {
          display: none;
        }
        .outlineAssessmentModal .ant-modal-body {
          padding: 0;
        }
        .outlineAssessmentModal .ant-modal-close {
          top: -0.5rem;
          right: -0.5rem;
          display: none;
        }
        .outlineAssessmentModal .assessmentModalBody {
          padding: 2rem 3rem;
          color: #4d4d4d !important;
        }
        .assessmentModalMask {
          background-color: rgb(0 0 0 / 91%);
        }
      `}</style>
    </Row>
  );
};

export default AssessmentProcess;
