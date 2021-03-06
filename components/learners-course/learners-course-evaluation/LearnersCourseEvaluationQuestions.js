import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Space,
  message,
  Form,
  Radio,
  Input,
  Spin,
  Rate,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const LearnersCourseEvaluationQuestions = ({
  assModalOperation,
  setEvaluationData,
  evaluationData,
  allQuestions,
  allAnswers,
}) => {
  console.log("evaluationData", evaluationData);
  const {
    courseId,
    courseEvaluationValues,
    evaluationActionId,
    evaluationTypeId,
    isRequired,
    userGroupId,
    maxValue,
    minValue,
  } = evaluationData.data;
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {}, []);

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(true);
  };
  const onFinish = (values) => {
    console.log("Values", values);
    setSpinning(true);
    setHasError("");
    var data = {};
    var checker = [];

    if (!!values.evaluationId) {
      data.evaluationId = values.evaluationId;
    } else {
      setHasError("* No Question Data Generated, Please Contact Support");
      checker.push("Error");
    }
    if (!!values.courseEvaluationValues) {
      data.answerId = values.courseEvaluationValues.answerId;
      data.score = values.courseEvaluationValues.answerScore;
    }

    data = JSON.stringify(data);
    if (!checker.length) {
      let newQNum = evaluationData.qNum + 1;
      let nextQData = allQuestions[newQNum];
      if (newQNum < allQuestions.length) {
        setEvaluationData({
          ...evaluationData,
          qNum: newQNum,
          data: nextQData,
        });
        setSpinning(false);
      } else {
        setEvaluationData({
          started: 2,
          qNum: 0,
          data: "",
        });
      }
      /* var config = {
        method: "post",
        url: apiBaseUrl + "/learner/Preassessment",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          //message.success(res.data.message);
          let newQNum = evaluationData.qNum + 1;
          let nextQData = allQuestions[newQNum];
          if (newQNum < allQuestions.length) {
            setEvaluationData({
              ...evaluationData,
              qNum: newQNum,
              data: nextQData,
            });
            setSpinning(false);
          } else {
            setEvaluationData({
              started: 2,
              qNum: 0,
              data: "",
            });
          }
        })
        .catch((err) => {
          console.log("err: ", err);
          message.error(
            "Network Error on Submission, Contact Technical Support"
          );
          setSpinning(false);
        }); */
    }
  };
  /* console.log("All Answers", allAnswers);
  console.log("Current Question Data", evaluationData); */
  const onChangeOptionList = (e) => {
    /* console.log("checked", e.target.value); */
  };
  const ansOptionList =
    courseEvaluationValues.length &&
    courseEvaluationValues.map((option, index) => {
      let catNames = `${option.name}`;
      let optValue = {
        answerId: option.id,
        courseEvaluationId: option.courseEvaluationId,
      };
      return (
        <Radio.Button
          className="radioVertical"
          key={index}
          label={catNames}
          value={optValue}
          onChange={onChangeOptionList}
        >
          {catNames}
        </Radio.Button>
      );
    });
  return (
    <Form
      form={form}
      onFinish={onFinish}
      name="learnerSubmitEvaluation"
      initialValues={{
        evaluationId: evaluationData.data ? evaluationData.data.id : 0,
        evaluationActionId: evaluationData.data
          ? evaluationData.data.evaluationActionId
          : 0,
          courseEvaluationRate: evaluationData.data
          ? evaluationData.data.minValue
          : 0,
      }}
    >
      <p style={{ color: "#cccbcb" }}>{`Survey ${evaluationData.qNum + 1} of ${
        evaluationData.qTotal
      }`}</p>
      <h2 style={{ marginBottom: "1.5rem" }}>
        {evaluationData.data ? evaluationData.data.title : null}
      </h2>
      <Form.Item
        label="Evaluation"
        name="evaluationId"
        style={{
          marginBottom: "1rem",
        }}
        hidden
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Evaluation Action"
        name="evaluationActionId"
        style={{
          marginBottom: "1rem",
        }}
        hidden
      >
        <Input />
      </Form.Item>
      {evaluationTypeId === 1 ? (
        <Form.Item
          name="courseEvaluationRate"
          rules={[
            {
              required: true,
              message: "Please Select from the options to proceed!",
            },
          ]}
        >
          <Rate allowHalf count={maxValue} />
        </Form.Item>
      ) : evaluationTypeId === 2 ? (
        <Form.Item
          name="courseEvaluationValues"
          rules={[
            {
              required: true,
              message: "Please Select from the options to proceed!",
            },
          ]}
        >
          <Radio.Group buttonStyle="solid">
            <Space>{ansOptionList}</Space>
          </Radio.Group>
        </Form.Item>
      ) : null}

      {hasError ? (
        <p
          style={{
            color: "#ff4d4f",
            textAlign: "right",
            marginBottom: "0",
            minHeight: "25px",
          }}
        >
          {hasError}
        </p>
      ) : (
        <p
          style={{
            color: "#ff4d4f",
            textAlign: "right",
            marginBottom: "0",
            minHeight: "25px",
          }}
        >
          {""}
        </p>
      )}
      <Form.Item
        wrapperCol={{
          span: 24,
        }}
        style={{ textAlign: "center", marginBottom: 0 }}
      >
        <Button type="primary" shape="round" size="medium" htmlType="submit">
          Next
        </Button>{" "}
      </Form.Item>
      {spinning && (
        <div className="spinHolder">
          <Spin
            size="small"
            tip="Processing..."
            spinning={spinning}
            delay={0}
          ></Spin>
        </div>
      )}
      <style jsx global>{`
        #learnerSubmitEvaluation .radioVertical {
          display: block;
          height: 30px;
          line-height: 30px;
        }
        #learnerSubmitEvaluation .spinHolder {
          text-align: center;
          z-index: 100;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Form>
  );
};

export default LearnersCourseEvaluationQuestions;
