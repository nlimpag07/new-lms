import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import BeforeAssessment from "./BeforeAssessment";
import AssessmentResult from "./AssessmentResult";
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
  const [submitIsActive, setSubmitIsActive] = useState(false);

  const [learnerAnswer, setLearnerAnswer] = useState("");
  const [isError, setIsError] = useState("");
  const [assessResult, setAssessmentResult] = useState("");
  //console.log("AssessmentModal Status", outlineAssessmentModal);
  var hasError = "";
  //reassign assessment
  const { courseAssessment } = outlineDetails;
  const outlineId = outlineDetails ? outlineDetails.id : null;
  const outlineTitle = outlineDetails ? outlineDetails.title : null;
  //console.log("Assessment Details:", courseAssessment);
  const [assessmentDetails, setAssessmentDetails] = useState(
    courseAssessment.length ? courseAssessment[0] : null
  );

  let {
    id,
    courseId,
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

  //console.log("Assessment Details:", assessmentDetails);
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

  function onSubmitAnswer(answer, isLastItem) {
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
        courseAssessmentItemId: answer.courseAssessmentItemId,
        answer: answer.answer,
        hoursTaken: 0,
        points: answer.courseAssessmentItempoints,
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
            //setSubmitAnswerSpin(false);
            //check if it is the last quest in the assessment
            if (isLastItem == 1) {
              //get the total score and display
              var configRes = {
                method: "get",
                url:
                  apiBaseUrl +
                  `/Learner/courseassessment/${learnerId}/${courseAssessmentId}`,
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                },
              };
              try {
                const response = await axios(configRes);
                if (response) {
                  //let theRes = response.data.response;
                  //console.log("Assessment Result", response.data);
                  setAssessmentResult(response.data);
                }
              } catch (error) {
                const { response } = error;
                const { request, data } = response; // take everything but 'request'
                //console.log("Error Getting Total Assessment Result", data.message);
                setAssessmentResult(data.message);
              }
              setSubmitAnswerSpin(false);
            } else {
              //continue to next question
              setAssessmentResult("");
              setCurrentStep(currentStep + 1);
              setSubmitAnswerSpin(false);
            }
            //end filtration
          } else {
            //false
            //setSubmitAnswerSpin(false);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'
        //console.log("Error Response", data.message);
      }
      //setLoading(false);
    }
    fetchData(config);
    setLearnerAnswer("");
    setSubmitIsActive(false);
    /*setSubmitAnswerSpin(false); */
  }

  const onChangeToF = (e, q_info) => {
    //console.log("Selected Question", q_info);
    //console.log("Selected Answer", e.target.value);
    let ans;
    let points;
    if (e.target.value == "True" && q_info.questionIsTrue == 1) {
      ans = 1;
      points = 10;
    } else if (e.target.value == "False" && q_info.questionIsFalse == 1) {
      ans = 0;
      points = 10;
    } else {
      ans = 0;
      points = 0;
    }

    setLearnerAnswer({
      answer: ans,
      courseAssessmentItempoints: points,
      courseAssessmentItemId: q_info.questionId,
      courseAssessmentItemType: q_info.questionTypeId,
    });
    setSubmitIsActive(true);
    //setArticulateModal2Visible(false);
    //setdrawerVisible(false);
  };
  const onBlurEssay = (e, q_info) => {
    setIsError("");
    //console.log("Selected Question", q_info);
    //console.log("Selected Answer", e.target.value.length);
    let ans = e.target.value;
    let points = 0;
    if (ans.length >= q_info.questionMinLength) {
      setLearnerAnswer({
        answer: ans,
        courseAssessmentItempoints: points,
        courseAssessmentItemId: q_info.questionId,
        courseAssessmentItemType: q_info.questionTypeId,
      });
      setSubmitIsActive(true);
    } else {
      setIsError("length must be greater than Minimum Length");
      setSubmitIsActive(false);
    }
  };
  const onMultipleChoice = (e, q_info) => {
    setIsError("");
    //console.log("Selected Question", q_info);
    //console.log("Selected Answer", e.target.value);
    let ans = e.target.value;
    let points = 0;
    if (ans) {
      let isCorrect = q_info.questionChoices.filter(
        (choice) => choice.id === ans && choice.isCorrect === 1
      );
      if (isCorrect.length) points = 10;
      setLearnerAnswer({
        answer: ans,
        courseAssessmentItempoints: points,
        courseAssessmentItemId: q_info.questionId,
        courseAssessmentItemType: q_info.questionTypeId,
        courseAssessmentItemChoices: q_info.questionChoices,
      });
      setSubmitIsActive(true);
    } else {
      setIsError("Please Select your Choice");
      setSubmitIsActive(false);
    }
  };
  const onClickReload = (e) => {
    e.preventDefault();
    window.location.reload();
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
        width="90%"
        className="outlineAssessmentModal"
        maskStyle={{ backgroundColor: "rgb(0 0 0 / 91%)" }}
      >
        {takeAssessment ? (
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
                      <b>Attempts:</b>{" "}
                      {isAttempts == 1 ? attempts : "Unlimited"}
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
              {assessResult ? (
                <Col xs={32} sm={24} md={24}>
                  <AssessmentResult
                    onClickReload={onClickReload}
                    resultInfo={assessResult ? assessResult : "error"}
                  />
                </Col>
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
                    delay={50}
                  >
                    <div className="questionContainer">
                      <div className="steps-content">
                        {stepQuestions[currentStep].questionTypeId == 3 ? (
                          <div>
                            {/*  True or False Question */}
                            <h3>
                              Question:{" "}
                              {stepQuestions[currentStep].questionName}
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
                              Question:{" "}
                              {stepQuestions[currentStep].questionName}
                            </h3>
                            <p>
                              <InfoCircleFilled /> Select your answer.
                            </p>
                            <Radio.Group
                              optionType="button"
                              buttonStyle="solid"
                              onChange={(e) =>
                                onMultipleChoice(e, stepQuestions[currentStep])
                              }
                            >
                              {stepQuestions[currentStep].questionChoices.map(
                                (choice) => (
                                  <Radio.Button
                                    key={choice.id}
                                    value={choice.id}
                                  >
                                    {choice.name}
                                  </Radio.Button>
                                )
                              )}
                            </Radio.Group>
                          </div>
                        ) : (
                          <div>
                            {/*  Essay */}
                            <h3>
                              Question:{" "}
                              {stepQuestions[currentStep].questionName}
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
                      <div
                        className="steps-action"
                        style={{ marginTop: "2rem" }}
                      >
                        {currentStep < stepQuestions.length - 1 &&
                          (submitIsActive ? (
                            <Button
                              type="primary"
                              onClick={() => onSubmitAnswer(learnerAnswer, 0)}
                            >
                              Submit
                            </Button>
                          ) : (
                            <Button type="primary" disabled>
                              Submit
                            </Button>
                          ))}
                        {currentStep === stepQuestions.length - 1 &&
                          (submitIsActive ? (
                            <Button
                              type="primary"
                              onClick={() => onSubmitAnswer(learnerAnswer, 1)}
                            >
                              Submit
                            </Button>
                          ) : (
                            <Button type="primary" disabled>
                              Submit
                            </Button>
                          ))}
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
          </div>
        ) : (
          <BeforeAssessment setTakeAssessment={() => setTakeAssessment(true)} />
        )}
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
