import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.apiBaseUrl;

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

/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const UsersAdd = ({ hideModal, setSpin }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(true);
  const [fileList, updateFileList] = useState([]);
  const props = {
    fileList,
    beforeUpload: (file) => {
      if (file.type != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        message.error(`${file.name} is not an XLS file`);
      }
      return (file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
     /*  if (file.type !== 'application/vnd.ms-excel' || file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        message.error(`${file.name} is not an XLS file`);
      }
      return (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); */
    },
    onChange: (info) => {
      console.log(info.fileList);
      // file.status is empty when beforeUpload return false
      updateFileList(info.fileList.filter((file) => !!file.status));
    },
  };

  useEffect(() => {
    /* let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.filter((getCourse) => getCourse.id == course_id);
    setCourseDetails(theCourse[0]); */
  }, []);

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(true);
    hideModal("add");
  };
  const onFinish = (values) => {
    setHasError("");
    var data = {};
    var checker = [];
    //console.log("Received values of form: ", values);
    //console.log("Re-Evaluating UserIds====");
    if (!!values.learnersData) {
      //Standard undefined
      //console.log("Learners Data Supplied");
    } else {
      //console.log("Learners Data Undefined... Please Supply Data");
      if (selectedUserId.length) {
        let learnerUserId = [];
        //console.log("Learners Data Supplied", selectedUserId);
        selectedUserId.map((userId) => {
          learnerUserId.push({ userId: userId });
        });
        data.learner = learnerUserId;
      } else {
        setHasError("* Please add at least 1 learner");
        checker.push("Error");
      }
    }
    //Standard Entry, Static atm
    data.userGroupId = 3;

    if (!!values.isNotify) {
      values.isNotify ? (data.isNotify = 1) : (data.isNotify = 0);
    } else {
      data.isNotify = 0;
    }
    if (!!values.isAutoEnroll) {
      values.isAutoEnroll ? (data.isAutoEnroll = 1) : (data.isAutoEnroll = 0);
    } else {
      data.isAutoEnroll = 0;
    }
    if (!!values.learnerSession) {
      let l_session = [];
      learnerSession.map((session) => {
        l_session.push({
          sessionId: session,
          //date is not sure if necessary for now
          dateScheduled: now(),
        });
      });
      data.learnerSession = l_session;
    }
    if (!!values.notificationDetails) {
      data.notificationDetails = values.notificationDetails;
    }
    data = JSON.stringify(data);
    if (!checker.length) {
      var config = {
        method: "post",
        url: apiBaseUrl + "/enrollment/" + course_id,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          //console.log("res: ", res.data);
          message.success(res.data.message);
          setSpin(true);
          hideModal("add");
        })
        .catch((err) => {
          console.log("err: ", err.response.data);
          message.error(
            "Network Error on Submission, Contact Technical Support"
          );
          setSpin(true);
          //hideModal("add");
        });
    }
  };

  return (
    //GridType(gridList)
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="usersAdd"
        style={{ width: "100%" }}
        initialValues={{
          courseTitle: "hey",
          isAutoEnroll: false,
          isNotify: false,
        }}
      >
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="usersFile"
            label="Upload File"
            style={{ display: "inline-block", width: "calc(50% - 50px)" }}
          >
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Upload XLS File Only</Button>
            </Upload>
          </Form.Item>          
        </Form.Item>

        
        <Divider dashed style={{ borderColor: "#999999", marginBottom: "0" }}>
          Select Learners to Enroll
        </Divider>
        <Form.Item name="learnersData">
          {!spinning ? (
            <EnrollmentsAddSelectLearners
              setUnEnrolledLearners={setUnEnrolledLearners}
              unEnrolledLearners={unEnrolledLearners}
              course_id={course_id}
              setSelectedUserId={setSelectedUserId}
            />
          ) : (
            <Spin
              size="small"
              tip="Processing..."
              spinning={spinning}
              delay={10000}
            ></Spin>
          )}
        </Form.Item>

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
      </Form>
    </Row>
  );
};

export default UsersAdd;
