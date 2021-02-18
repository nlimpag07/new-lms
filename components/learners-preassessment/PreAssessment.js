import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Card, Modal, Button, Space, message } from "antd";
import PreAssessmentQuestions from "./PreAssessmentQuestions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const PreAssessment = ({ learner }) => {
  const [assessmentModal, setAssessmentModal] = useState(false);
  const [assessmentData, setAssessmentData] = useState({
    started: 0,
    qNum: 0,
    data: null,
  });
  const [allQuestions, setAllquestions] = useState([]);
  const [allAnswers, setAllanswers] = useState([]);
  //console.log("Learner", learner);
  const [uType, setUtype] = useState("");
  const [sc, setSc] = useState({
    ac: 0,
    oc: 0,
    cc: 0,
  });

  useEffect(() => {}, []);
  //Display the modal and the initial contents
  //optional: if v is true then data should be displayed,otherwise set setAssessmentData should be resetted
  const assModalOperation = (e, v, data) => {
    e.preventDefault();
    setAssessmentData({ ...assessmentData, data: data });
    setAssessmentModal(v);
  };
  //pull assessments data from api
  const GetAssessments = (v) => {
    var config = {
      /*  method: "get",
      url: apiBaseUrl + `/picklist/preassessment`, */
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "text/plain",
      },
    };
    axios
      .all([
        axios.get(apiBaseUrl + "/picklist/preassessment", config),
        axios.get(apiBaseUrl + "/Picklist/preassessmentAnswers/", config),
      ])
      .then(
        axios.spread((preQList, preAList) => {
          if (preQList.data.result) {
            setAllquestions(preQList.data.result);
            setAssessmentData({
              started: v,
              qNum: 0,
              data: preQList.data.result[0],
            });
          } else {
            setAllquestions([]);
            setAssessmentData({
              started: 0,
              qnum: 0,
              data: "No Data Retrieved",
            });
          }
          if (preAList.data.result) {
            setAllanswers(preAList.data.result);
          } else {
            setAllanswers([]);
          }
        })
      )
      .catch((err) => {
        console.log("err: ", err.response.data);
        message.error(
          "Network Error on pulling data, Contact Technical Support"
        );
      });
  };

  //Begin the preassessment
  //condition: if istrue is 1, run GetAssessments otherwise means already started and should be NEXT.
  const beginPreassessment = (e, istrue) => {
    e.preventDefault();
    GetAssessments(istrue);
  };
  return (
    <StatusContent
      beginPreassessment={beginPreassessment}
      assModalOperation={assModalOperation}
      assessmentModal={assessmentModal}
      setAssessmentModal={setAssessmentModal}
      assessmentData={assessmentData}
      setAssessmentData={setAssessmentData}
      allQuestions={allQuestions}
      allAnswers={allAnswers}
    />
  );
};

const StatusContent = ({
  beginPreassessment,
  assModalOperation,
  assessmentModal,
  setAssessmentModal,
  assessmentData,
  setAssessmentData,
  allQuestions,
  allAnswers,
}) => {
  console.log("All Questions", allQuestions);
  

  let preText =
    "This assessment will help you choose from the different learning programs that we offer. We are here to help you choose from the wide variety of courses that could help you in your career.";
  return (
    <Col
      className="widget-holder-col learner-pre"
      xs={24}
      sm={24}
      md={24}
      lg={24}
    >
      <div className="common-holder preassessment-holder">
        <Row
          gutter={[16]}
          className="preassessment-container"
          onClick={(e) => assModalOperation(e, true, preText)}
        >
          <Col xs={24} sm={24} md={24} lg={24} className="pre-holder">
            <h2>Take this free pre-assessment exam</h2>
            <span>and learn more about our training programs</span>
          </Col>
        </Row>
      </div>
      <Modal
        title="Learner's Pre-Assessment"
        centered
        visible={assessmentModal}
        maskClosable={false}
        destroyOnClose={true}
        onOk={(e) => assModalOperation(e, false, "")}
        onCancel={(e) => assModalOperation(e, false, "")}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="preassessmentModal"
      >
        <Space direction="vertical">
          <div className="description">
            {assessmentData.started === 1 ? (
              <PreAssessmentQuestions
                assessmentData={assessmentData}
                allAnswers={allAnswers}
              />
            ) : (
              <p>{assessmentData.data}</p>
            )}
          </div>
          <div className="buttonHolder">
            {assessmentData.started === 1 ? (
              <Button
                type="primary"
                shape="round"
                size="medium"
                onClick={(e) => beginPreassessment(e, 0)}
              >
                Next
              </Button>
            ) : (
              <Button
                type="primary"
                shape="round"
                size="medium"
                onClick={(e) => beginPreassessment(e, 1)}
              >
                Begin
              </Button>
            )}
          </div>
        </Space>
      </Modal>
      <style jsx global>{`
        .preassessmentModal .buttonHolder {
          text-align: center;
        }
        .preassessmentModal .ant-modal-footer {
          display: none;
        }
        .learner-pre .common-holder {
          background-color: none;
        }
        .learner-pre .preassessment-holder {
          background-color: #0078d4;
        }
        .preassessment-holder .preassessment-container:hover {
          cursor: pointer;
        }
        .preassessment-container .pre-holder {
          text-align: center;
          padding: 1rem;
          color: #ffffff;
        }
        .preassessment-container .pre-holder h2 {
          margin-bottom: 0px;
          font-size: 1.7rem;
          color: #ffffff;
        }
        .preassessment-container .status-col h1 {
          font-size: 5rem;
          font-weight: 700;
          margin: 0 auto;
          padding: 0;
          text-align: right;
          line-height: 5rem;
        }
        .preassessment-container .current-rank h1 {
          font-size: 3rem;
        }
        .preassessment-container .current-rank svg {
          margin-right: 1rem;
        }
        .preassessment-container .status-col span {
          /* padding-left: 15px; */
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-col {
          background: #ffffff;
          padding: 20px 15px 0 15px;
          min-height: 150px;
          box-shadow: 1px 0px 5px #333333;
        }
        .status-col .borderIdentifier {
          height: auto;
        }
        .assigned {
          box-shadow: 1px 0px 5px #e6505038;
        }
        .inprogress {
          box-shadow: 1px 0px 5px #ffbc1c38;
        }
        .completed {
          box-shadow: 1px 0px 5px #85d87138;
        }
        .rank {
          box-shadow: 1px 0px 5px #7cb7ea38;
        }

        .status-col.assigned .borderIdentifier > div {
          background-color: #e65050;
        }
        .status-col.inprogress .borderIdentifier > div {
          background-color: #ffbc1c;
        }
        .status-col.completed .borderIdentifier > div {
          background-color: #85d871;
        }
        .status-col.rank .borderIdentifier > div {
          background-color: #7cb7ea;
        }

        .status-col .topThird {
          width: 45%;
          height: 7px;
        }
        .status-col .botFull {
          width: 100%;
          height: 5px;
        }
      `}</style>
    </Col>
  );
};

export default PreAssessment;
