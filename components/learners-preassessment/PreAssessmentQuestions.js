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
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const PreAssessmentQuestions = ({ assessmentData, allAnswers }) => {
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {}, []);

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(true);
    hideModal("add");
  };
  const onFinish = (values) => {
    console.log("Values", values);
    setSpinning(true);
    setHasError("");
    var data = {};
    var checker = [];

    if (!!values.title) {
      data.title = values.title;
    } else {
      setHasError("* Please Input Question Name");
      checker.push("Error");
    }
    if (!!values.categoryId) {
      data.preassessmentCategory = [
        {
          categoryId: values.categoryId,
        },
      ];
    }

    data = JSON.stringify(data);
    if (!checker.length) {
      var config = {
        method: "post",
        url: apiBaseUrl + "/picklist/Preassessment",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          message.success(res.data.message);
          setSpinning(false);
          setRunSpin(true);
          hideModal("add");
        })
        .catch((err) => {
          console.log("err: ", err);
          message.error(
            "Network Error on Submission, Contact Technical Support"
          );
          setSpinning(false);
          setRunSpin(true);
          hideModal("add");
        });
    }
  };
  console.log("All Answers", allAnswers);
  console.log("Current Question Data", assessmentData);
  /* const ansOptionList =
    allAnswers.length &&
    allAnswers.map((option, index) => {
      let catNames = `${option.title}`;
      let optValue = option.id;
      return (
        <Radio.Button key={index} label={catNames} value={optValue}>
          {catNames}
        </Radio.Button>
      );
    }); */
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      name="AddPicklistPreassessment"
      initialValues={
        {
          /*
    colorPicker:"#ffffff",*/
        }
      }
    >
      <Form.Item
        label="Preassessment Question"
        name="title"
        style={{
          marginBottom: "1rem",
        }}
        rules={[
          {
            required: true,
            message: "Please input Preassessment Name!",
          },
        ]}
      >
        <Input placeholder="Preassessment Name" />
      </Form.Item>
      <Form.Item
        name="categoryId"
        label="Category"
        rules={[
          {
            required: true,
            message: "Please Select Category!",
          },
        ]}
      >
        <Radio.Group defaultValue="a" buttonStyle="solid">
          <Radio.Button value="a">Hangzhou</Radio.Button>
          <Radio.Button value="b">Shanghai</Radio.Button>
          <Radio.Button value="c">Beijing</Radio.Button>
          <Radio.Button value="d">Chengdu</Radio.Button>
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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>{" "}
        <Button onClick={() => onCancel(form)}>Cancel</Button>
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
    </Form>
  );
};

export default PreAssessmentQuestions;
