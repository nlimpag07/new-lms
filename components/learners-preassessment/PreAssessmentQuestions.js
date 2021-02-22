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
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const PreAssessmentQuestions = ({
  assModalOperation,
  setAssessmentData,
  assessmentData,
  allQuestions,
  allAnswers,
}) => {
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

    if (!!values.preassessmentId) {
      data.preassessmentId = values.preassessmentId;
    } else {
      setHasError("* No Question Data Generated, Please Contact Support");
      checker.push("Error");
    }
    if (!!values.answer) {
      data.answerId = values.answer.answerId;
      data.score = values.answer.answerScore;
    } else {
      setHasError("* Please select an answer from the options given.");
      checker.push("Error");
    }

    data = JSON.stringify(data);
    if (!checker.length) {
      var config = {
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
          message.success(res.data.message);
          let newQNum = assessmentData.qNum + 1;
          let nextQData = allQuestions[newQNum];
          if (newQNum <= allQuestions.length) {
            setAssessmentData({
              ...assessmentData,
              qNum: newQNum,
              data: nextQData,
            });
            setSpinning(false);
          } else {
            
          }
        })
        .catch((err) => {
          console.log("err: ", err);
          message.error(
            "Network Error on Submission, Contact Technical Support"
          );
          setSpinning(false);
        });
    }
  };
  console.log("All Answers", allAnswers);
  console.log("Current Question Data", assessmentData);
  const onChangeOptionList = (e) => {
    console.log("checked", e.target.value);
  };
  const ansOptionList =
    allAnswers.length &&
    allAnswers.map((option, index) => {
      let catNames = `${option.name}`;
      let optValue = { answerId: option.id, answerScore: option.score };
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
      name="learnerSubmitPreassessment"
      initialValues={{
        preassessmentId: assessmentData.data.id,
      }}
    >
      <p style={{ color: "#cccbcb" }}>{`Survey ${assessmentData.qNum + 1} of ${
        assessmentData.qTotal
      }`}</p>
      <h2 style={{ marginBottom: "1.5rem" }}>{assessmentData.data.title}</h2>
      <Form.Item
        label="Survey Question"
        name="preassessmentId"
        style={{
          marginBottom: "1rem",
        }}
        hidden
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="answer"
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
        #learnerSubmitPreassessment .radioVertical {
          display: block;
          height: 30px;
          line-height: 30px;
        }
        #learnerSubmitPreassessment .spinHolder {
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

export default PreAssessmentQuestions;
