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
  Radio,
  Spin,
  Result,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  InfoCircleFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const { Step } = Steps;
const { TextArea } = Input;
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
  outlineDetails,
  outlineAssessmentModal,
  setOutlineAssessmentModal,
  learnerId,
  spinner,
  setSpinner,
}) => {
  const router = useRouter();
  const [takeAssessment, setTakeAssessment] = useState(false);
  const [submitAnswerSpin, setSubmitAnswerSpin] = useState(false);
  const [learnerAnswer, setLearnerAnswer] = useState("");
  const [isError, setIsError] = useState("");
  const [assessmentResult, setAssessmentResult] = useState("");
  //console.log("AssessmentModal Status", outlineAssessmentModal);
  var hasError = "";
  //reassign assessment
  const { courseAssessment } = outlineDetails;
  const outlineId = outlineDetails ? outlineDetails.id : null;
  const outlineTitle = outlineDetails ? outlineDetails.title : null;
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
  const courseAssessmentId = id;

  console.log("Assessment Details:", assessmentDetails);
  const stepQuestions = assessmentDetails.courseAssessmentItem.map(
    (question, index) => {
      let questionData = {
        courseAssessmentId: question.courseAssessmentId
          ? question.courseAssessmentId
          : 0,
        questionId: question.id ? question.id : null,
        questionTypeId: question.assessmentItemTypeId
          ? question.assessmentItemTypeId
          : null,
        questionTypeName: question.assessmentItemType
          ? question.assessmentItemType.name
          : null,
        questionName: question.name ? question.name : null,
        questionChoices: question.courseAssessmentItemChoices
          ? question.courseAssessmentItemChoices
          : null,
        questionIsFalse: question.isFalse ? question.isFalse : 0,
        questionIsTrue: question.isTrue ? question.isTrue : 0,
        questionDuration: question.duration ? question.duration : 0,
        questionIsShuffle: question.isShuffle ? question.isShuffle : 0,
        questionLearnerCourseAssessment: question.learnerCourseAssessment
          ? question.learnerCourseAssessment
          : null,
        questionMaxLength: question.maxLength ? question.maxLength : 0,
        questionMinLength: question.minLength ? question.minLength : 0,
      };
      return questionData;
    }
  );
  //console.log(stepQuestions);
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
  const next = (ans) => {
    //console.log("Submitted Answer", ans);
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    setSpinner(false);
  }, [outlineAssessmentModal]);

  function onSubmitAnswer(ans, isLastItem) {
    //e.preventDefault();
    setSubmitAnswerSpin(true);

    var config = {
      method: "post",
      url: apiBaseUrl + "/Learner/courseassessment",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: {
        learnerId: learnerId,
        courseAssessmentId: courseAssessmentId,
        courseAssessmentItemId: ans.courseAssessmentItemId,
        answer: ans.answer,
        hoursTaken: 0,
        points: 0,
      },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data.response;
          console.log("Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            //true
            //setSubmitAnswerSpin(false);
          } else {
            //false
            //setSubmitAnswerSpin(false);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'
        console.log("Error Response", data.message);
      }
      //setLoading(false);
    }
    fetchData(config);
    setLearnerAnswer("");

    //check if it is the last quest in the assessment
    if (isLastItem == 1) {
      //get the total score and display
      setAssessmentResult("is done");
    } else {
      //continue to next question
      setAssessmentResult("");
      setCurrentStep(currentStep + 1);
    }
    setSubmitAnswerSpin(false);
  }

  const OnAssessmentModalClose = () => {
    /* let statusButtons = "";
    
    return statusButtons; */
    setSpinner(true);

    console.log("Submit Assessment");
    //setArticulateModal2Visible(false);
    //setdrawerVisible(false);
  };

  const onChangeToF = (e, q_info) => {
    //console.log("Selected Question", q_info);
    //console.log("Selected Answer", e.target.value);
    let ans = e.target.value == "True" ? 1 : 0;
    setLearnerAnswer({
      answer: ans,
      courseAssessmentItemId: q_info.questionId,
    });
    //setArticulateModal2Visible(false);
    //setdrawerVisible(false);
  };
  const onBlurEssay = (e, q_info) => {
    setIsError("");
    console.log("Selected Question", q_info);
    console.log("Selected Answer", e.target.value.length);
    let ans = e.target.value;
    if (ans.length >= q_info.questionMinLength) {
      setLearnerAnswer({
        answer: ans,
        courseAssessmentItemId: q_info.questionId,
      });
    } else {
      setIsError("length must be greater than Minimum Length");
    }

    //setArticulateModal2Visible(false);
    //setdrawerVisible(false);
  };
  const onClickReload =(e)=>{
    e.preventDefault();
    window.location.reload();
  }
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
        width="90%"
        className="outlineAssessmentModal"
        maskStyle={{ backgroundColor: "rgb(0 0 0 / 91%)" }}
      >
        {takeAssessment?(<div className="assessmentModalBody">
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
            {assessmentResult ? (
              <Spin
                size="small"
                /* tip="Processing..." */
                spinning={submitAnswerSpin}
                delay={100}
              >
                <Result
                  status="error"
                  title="Assessment Result: Failed"
                  subTitle="We are sad that you didn't pass the assessment and is not allowed to proceed to the next lesson."
                  extra={[
                    <Button type="primary" key="console" onClick={onClickReload}>
                      Retake this Assessment
                    </Button>,
                  ]}
                ></Result>
              </Spin>
            ) : (
              <Col xs={32} sm={24} md={24}>
                <Steps current={currentStep}>
                  {stepQuestions.map((item) => (
                    <Step
                      key={item.questionTypeName}
                      title={item.questionTypeName}
                    />
                  ))}
                </Steps>
                <Spin
                  size="small"
                  /* tip="Processing..." */
                  spinning={submitAnswerSpin}
                  delay={100}
                >
                  <div className="questionContainer">
                    <div className="steps-content">
                      {stepQuestions[currentStep].questionTypeId == 3 ? (
                        <div>
                          {/*  True or False Question */}
                          <h3>
                            Question: {stepQuestions[currentStep].questionName}
                          </h3>
                          <p>
                            <InfoCircleFilled /> Select your answer.
                          </p>
                          <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            onChange={(e) =>
                              onChangeToF(e, stepQuestions[currentStep])
                            }
                          >
                            <Radio.Button value="True">True</Radio.Button>
                            <Radio.Button value="False">False</Radio.Button>
                          </Radio.Group>
                        </div>
                      ) : stepQuestions[currentStep].questionTypeId == 2 ? (
                        <div>
                          {/*  Multiple Choice Question */}
                          <h3>
                            Question: {stepQuestions[currentStep].questionName}
                          </h3>
                          <p>
                            <InfoCircleFilled /> Select your answer.
                          </p>
                          <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            onChange={(e) =>
                              onChangeToF(e, stepQuestions[currentStep])
                            }
                          >
                            <Radio.Button value="True">True</Radio.Button>
                            <Radio.Button value="False">False</Radio.Button>
                          </Radio.Group>
                        </div>
                      ) : (
                        <div>
                          {/*  Essay */}
                          <h3>
                            Question: {stepQuestions[currentStep].questionName}
                          </h3>
                          <p>
                            <InfoCircleFilled /> Minimum length of{" "}
                            {stepQuestions[currentStep].questionMinLength} and
                            Maximum of{" "}
                            {stepQuestions[currentStep].questionMaxLength}.
                          </p>
                          <TextArea
                            showCount
                            rows="5"
                            minLength={
                              stepQuestions[currentStep].questionMinLength
                            }
                            maxLength={
                              stepQuestions[currentStep].questionMaxLength
                            }
                            onBlur={(e) =>
                              onBlurEssay(e, stepQuestions[currentStep])
                            }
                            onFocus={() => setIsError("")}
                          />
                          {isError && (
                            <p style={{ color: "#f00000" }}>{isError}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="steps-action" style={{ marginTop: "2rem" }}>
                      {currentStep < stepQuestions.length - 1 && (
                        <Button
                          type="primary"
                          onClick={() => onSubmitAnswer(learnerAnswer, 0)}
                        >
                          Submit
                        </Button>
                      )}
                      {currentStep === stepQuestions.length - 1 && (
                        <Button
                          type="primary"
                          onClick={() => onSubmitAnswer(learnerAnswer, 1)}
                          /* onClick={() => message.success("Processing complete!")} */
                        >
                          Submit
                        </Button>
                      )}
                      {currentStep > 0 && (
                        <Button
                          style={{ margin: "0 8px" }}
                          onClick={() => prev()}
                        >
                          Previous
                        </Button>
                      )}
                    </div>
                  </div>
                </Spin>
              </Col>
            )}
          </Row>
        </div>):(<Result
    status="success"
    title="Congratulations! You have successfully completed the lesson."
    subTitle="Please take the assessment exam to proceed to the next lesson."
    extra={[
      <Button type="primary" shape="round" key="console" size="large" onClick={()=>setTakeAssessment(true)}>
        Take the Assessment
      </Button>,
    ]}
  />)}
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
          padding: 2rem 3rem 3rem;
          color: #4d4d4d !important;
        }
        .assessmentModalMask {
          background-color: rgb(0 0 0 / 91%);
        }
        .assessmentModalBody .ant-spin-blur {
          opacity: 0 !important;
        }
      `}</style>
    </Row>
  );
};

export default AssessmentProcess;
