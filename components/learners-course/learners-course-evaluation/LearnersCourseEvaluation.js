import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Card, Modal, Button, Space, message, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import LearnersCourseEvaluationQuestions from "./LearnersCourseEvaluationQuestions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const LearnersCourseEvaluation = ({
  courseId,
  modalStatus,
  setIsEvaluationActive,
}) => {
  const [evaluationModal, setEvaluationModal] = useState(modalStatus);
  const [evaluationData, setEvaluationData] = useState({
    started: 0,
    qNum: 0,
    qTotal: 0,
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
  //console.log("CourseId from MyCoursesDrawerDetails",courseId)
  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + `/CourseEvaluation/${courseId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        //setOutcomeList(response.data.result);
        let theRes = response.data;
        console.log("Response", response.data);
        // wait for response if the verification is true
        if (theRes) {
          setAllquestions(theRes.result);
        } else {
          setAllquestions([]);
        }
      }
    }
    fetchData(config);
    //setSpinner(false);
  }, []);
  //Display the modal and the initial contents
  //optional: if v is true then data should be displayed,otherwise set setEvaluationData should be resetted
  const showModal = (e, v, data) => {
    e.preventDefault();
    setEvaluationData({ ...evaluationData, data: data });
    setEvaluationModal(v);
  };
  const hideModal = (e, v) => {
    setIsEvaluationActive(false);
    e.preventDefault();
    setEvaluationData({
      started: 0,
      qnum: 0,
      qTotal: 0,
      data: "No Data Retrieved",
    });
    setEvaluationModal(v);
  };
  //pull evaluations data from api
  const GetAssessments = (v) => {
    var config = {
      /*  method: "get",
      url: apiBaseUrl + `/picklist/preevaluation`, */
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "text/plain",
      },
    };
    axios
      .all([
        axios.get(apiBaseUrl + "/picklist/preevaluation", config),
        axios.get(apiBaseUrl + "/Picklist/preevaluationAnswers/", config),
      ])
      .then(
        axios.spread((preQList, preAList) => {
          if (preQList.data.result) {
            setAllquestions(preQList.data.result);
            setEvaluationData({
              started: v,
              qNum: 0,
              qTotal: preQList.data.result.length,
              data: preQList.data.result[0],
            });
          } else {
            setAllquestions([]);
            setEvaluationData({
              started: 0,
              qnum: 0,
              qTotal: 0,
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

  //Begin the preevaluation
  //condition: if istrue is 1, run GetAssessments otherwise means already started and should be NEXT.
  const beginEvaluation = (e, istrue) => {
    e.preventDefault();
    setEvaluationData({
      started: istrue,
      qNum: 0,
      qTotal: allQuestions.length,
      data: allQuestions[0],
    });
  };
  return (
    <StatusContent
      beginEvaluation={beginEvaluation}
      hideModal={hideModal}
      showModal={showModal}
      evaluationModal={evaluationModal}
      setEvaluationModal={setEvaluationModal}
      evaluationData={evaluationData}
      setEvaluationData={setEvaluationData}
      allQuestions={allQuestions}
      allAnswers={allAnswers}
    />
  );
};

const StatusContent = ({
  beginEvaluation,
  hideModal,
  showModal,
  evaluationModal,
  setEvaluationModal,
  evaluationData,
  setEvaluationData,
  allQuestions,
  allAnswers,
}) => {
  console.log("All Questions", allQuestions);

  return (
    <Modal
      title="Course Post Evaluation"
      centered
      visible={evaluationModal}
      maskClosable={false}
      destroyOnClose={true}
      onOk={(e) => hideModal(e, false)}
      onCancel={(e) => hideModal(e, false)}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      className="preevaluationModal"
      width="600px"
    >
      <div className="description">
        {evaluationData.started === 1 ? (
          <LearnersCourseEvaluationQuestions
            showModal={showModal}
            setEvaluationData={setEvaluationData}
            evaluationData={evaluationData}
            allQuestions={allQuestions}
            allAnswers={allAnswers}
          />
        ) : evaluationData.started === 2 ? (
          <Result
            icon={<SmileOutlined />}
            title="All done, thank you for participating!"
            extra={
              <Button
                type="primary"
                shape="round"
                size="medium"
                onClick={(e) => hideModal(e, false)}
              >
                Close
              </Button>
            }
          />
        ) : (
          <p>
            In order for us to improve our service, your feedback is of the
            utmost importance. We'd like to know what you think about the
            course.
          </p>
        )}
      </div>
      <div className="buttonHolder">
        {evaluationData.started === 1 || evaluationData.started === 2 ? null : (
          <>
            <Button
              type="danger"
              shape="round"
              size="medium"
              onClick={(e) => hideModal(e, false)}
            >
              No Thanks
            </Button>{" "}
            <Button
              type="primary"
              shape="round"
              size="medium"
              onClick={(e) => beginEvaluation(e, 1)}
            >
              Begin Evaluation
            </Button>
          </>
        )}
      </div>
      <style jsx global>{`
        .ant-modal-close {
          display: none;
        }
        .preevaluationModal .buttonHolder {
          text-align: center;
        }
        .preevaluationModal .ant-modal-footer {
          display: none;
        }
        .learner-pre .common-holder {
          background-color: none;
        }
        .learner-pre .preevaluation-holder {
          background-color: #0078d4;
        }
        .preevaluation-holder .preevaluation-container:hover {
          cursor: pointer;
        }
        .preevaluation-container .pre-holder {
          text-align: center;
          padding: 1rem;
          color: #ffffff;
        }
        .preevaluation-container .pre-holder h2 {
          margin-bottom: 0px;
          font-size: 1.7rem;
          color: #ffffff;
        }
        .preevaluation-container .status-col h1 {
          font-size: 5rem;
          font-weight: 700;
          margin: 0 auto;
          padding: 0;
          text-align: right;
          line-height: 5rem;
        }
        .preevaluation-container .current-rank h1 {
          font-size: 3rem;
        }
        .preevaluation-container .current-rank svg {
          margin-right: 1rem;
        }
        .preevaluation-container .status-col span {
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
    </Modal>
  );
};

export default LearnersCourseEvaluation;
