import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import moment from "moment";
import {
  Row,
  Col,
  Modal,
  Spin,
  Input,
  Form,
  Select,
  Button,
  Switch,
  Divider,
  message,
  Upload,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const list = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const CourseClone = ({ operation, hideModal, courseInfo, setSpin }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [fileList, updateFileList] = useState([]);
  const [positionOptions, setPositionOptions] = useState([]);
  const [positionData, setPositionData] = useState({
    data: [],
    value: undefined,
  });
  const [emailValidation, setEmailValidation] = useState({
    status: undefined,
    help: undefined,
    id: undefined,
  });
  const [hasError, setHasError] = useState("");
  const dateFormat = "DD-MMM-YYYY";
  useEffect(() => {}, []);

  const onCancel = (form) => {
    form.resetFields();
    hideModal(operation);
  };
  const onFinish = (values) => {
    setSpinning(true);
    setHasError("");
    var data = {};
    var errorList = [];
    console.log("Received values of form: ", values);
    let id = courseInfo && courseInfo.course_id ? courseInfo.course_id : null;
    id ? (data.id = id) : errorList.push("Cannot retrieve course details");
    !!values.courseTitle
      ? (data.title = values.courseTitle)
      : errorList.push("Missing Course Title");

    data = JSON.stringify(data);
    

    if (!errorList.length) {
      var config = {
        method: "post",
        url: apiBaseUrl + "/Courses/" + id + "/copy",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          console.log(res);
          openMessage(res.data.message, res.data.response);
        })
        .catch((error) => {
          console.log("error Response: ", error);
          error.response && error.response.data
            ? openMessage(error.response.data.message, false)
            : openMessage(`Error:${error}`, false);
        })
        .then(() => {
          setSpin(true);
        });
    }
  };
  const openMessage = (msg, resp) => {
    const key = "updatable";
    message.loading({ content: "Processing...", key });
    setTimeout(() => {
      if (resp) {
        message.success({ content: msg, key, duration: 2 });
        setSpinning(false);
        //setSpin(true);
        hideModal(operation);
      } else {
        message.error({ content: msg, key, duration: 2 });
        setSpinning(false);
        //setSpin(false);
      }
    }, 500);
  };

  return (
    //GridType(gridList)
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="CourseClone"
        style={{ width: "100%" }}
        initialValues={{
          baseCourse: courseInfo.title,
        }}
        className="cloneCourse"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item label="Course to Clone" name="baseCourse">
          <Input placeholder="Input First Name" disabled />
        </Form.Item>
        <Form.Item
          label="New Course Title"
          name="courseTitle"
          rules={[{ required: true, message: "Course Title is required" }]}
        >
          <Input placeholder="Input New Course Title" />
        </Form.Item>

        <Divider style={{ border: "none" }} />
        <Form.Item
          wrapperCol={{
            span: 24,
          }}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          <Button type="primary" htmlType="submit">
            Proceed
          </Button>{" "}
          <Button onClick={() => onCancel(form)}>Cancel</Button>
        </Form.Item>
      </Form>

      {spinning && (
        <div className="spinHolder">
          <Spin
            size="small"
            tip="Processing..."
            spinning={spinning}
            delay={100}
          ></Spin>
        </div>
      )}
      <style jsx global>{`
        .cloneCourse .ant-upload-select {
          float: left;
        }
        .cloneCourse .ant-upload-list-text {
          float: left;
        }
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          padding: 34% 0;
        }
      `}</style>
    </Row>
  );
};

export default CourseClone;
