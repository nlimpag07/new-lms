import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Card, Modal, Button, Space } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");

const PreAssessment = ({ learner }) => {
  const [assessmentModal, setAssessmentModal] = useState(false);
  const [assessmentData, setAssessmentData] = useState("");
  //console.log("Learner", learner);
  const [uType, setUtype] = useState("");
  const [sc, setSc] = useState({
    ac: 0,
    oc: 0,
    cc: 0,
  });

  useEffect(() => {}, []);
  const assModalOperation = (v, data) => {
    setAssessmentData(data);
    setAssessmentModal(v);
  };
  return (
    <StatusContent
      assModalOperation={assModalOperation}
      assessmentModal={assessmentModal}
      setAssessmentModal={setAssessmentModal}
      assessmentData={assessmentData}
      setAssessmentData={setAssessmentData}
    />
  );
};

const StatusContent = ({
  assModalOperation,
  assessmentModal,
  setAssessmentModal,
  assessmentData,
  setAssessmentData,
}) => {
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
          onClick={() => assModalOperation(true, preText)}
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
        onOk={() => setAssessmentModal(false)}
        onCancel={() => setAssessmentModal(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="preassessmentModal"
      >
        <Space direction="vertical">
          <div className="description">
            <p>{assessmentData}</p>
          </div>
          <div className="buttonHolder">
            <Button
              type="primary"
              shape="round"
              size="medium"
              onClick={() => assModalOperation(false, "")}
            >
              Begin
            </Button>
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
