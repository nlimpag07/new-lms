import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import EnrollmentsAddSelectLearners from "./EnrollmentsAddSelectLearners";
import {
  Row,
  Col,
  Modal,
  Spin,
  Input,
  InputNumber,
  Form,
  Select,
  Radio,
  Button,
  Switch,
  Divider,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import moment from "moment";

/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const EnrollmentsAdd = ({
  course_id,
  courseDetails,
  hideModal,
  setSpin,
  courseType,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [courseSessions, setCourseSessions] = useState([]);
  const [unEnrolledLearners, setUnEnrolledLearners] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseSession/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data.result;
          // wait for response if the verification is true
          if (theRes) {
            //there are enrollees
            setCourseSessions(theRes);
          } else {
            //no enrollees
            setCourseSessions([]);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'

        console.log("Error Response", data.message);

        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: data.message + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
        setCourseSessions([]);
      }
      //setLoading(false);
    }
    fetchData(config);

    //Fetching unenrolled learners
    var config1 = {
      method: "get",
      url: apiBaseUrl + "/Enrollment/GetUnenrolledLearners/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchUnEnrolled(config1) {
      try {
        const response = await axios(config1);
        if (response) {
          //setOutcomeList(response.data.result);
          let theRes = response.data;
          // wait for response if the verification is true
          if (theRes) {
            //there are enrollees
            setUnEnrolledLearners(theRes);
            setSpinning(false);
          } else {
            //no enrollees
            setUnEnrolledLearners([]);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'

        console.log("Error Response", data.message);

        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: data.message + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
      //setLoading(false);
    }
    fetchUnEnrolled(config1);
  }, []);

  const selectInstructor =
    courseDetails && courseDetails.courseInstructor.length
      ? courseDetails.courseInstructor.map((instructor) => instructor)
      : [];
  const selectInstructorOptions = selectInstructor.length
    ? selectInstructor.map((option, index) => {
        let insFullName = `${option.user.firstName} ${option.user.lastName}`;
        let insValue = option.id;
        return (
          <Option key={index} value={insValue}>
            {insFullName}
          </Option>
        );
      })
    : [];
  //Generating Course Sessions
  const sessionOptions = [];
  if (courseSessions.length) {
    for (let i = 0; i < courseSessions.length; i++) {
      const sTitle = courseSessions[i].title;
      const sDate = moment(courseSessions[i].startDate).format(
        "DD-MMM-YYYY h:mm a"
      );
      const eDate = moment(courseSessions[i].endDate).format(
        "DD-MMM-YYYY h:mm a"
      );

      sessionOptions.push(
        <Option
          key={i}
          value={courseSessions[i].id}
        >{`${sTitle} : (${sDate}) - (${eDate})`}</Option>
      );
    }
  }

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(true);
    hideModal("add");
    setUnEnrolledLearners([]);
    setCourseSessions([]);
    setSelectedUserId([]);
  };
  const onFinish = (values) => {
    setHasError("");
    var data = {};
    var checker = [];
    if (!!values.learnersData) {
      //Standard undefined
    } else {
      if (selectedUserId.length) {
        let learnerUserId = [];
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
    //data.userGroupId = 3;

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
      values.learnerSession.map((session) => {
        l_session.push({
          sessionId: session,
          //date is not sure if necessary for now
          //dateScheduled: null,
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
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="enrollAdd"
        style={{ width: "100%" }}
        initialValues={{
          courseTitle: courseDetails.title,
          isAutoEnroll: false,
          isNotify: false,
        }}
      >
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="courseTitle"
            label="Course"
            style={{ display: "inline-block", width: "calc(50% - 50px)" }}
          >
            <Input readOnly />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50%)",
              margin: "0 0 0 50px",
            }}
            name="courseInstructor"
            label="Instructor"
            rules={[
              {
                required: true,
                message: "Please select Instructor!",
              },
            ]}
          >
            <Select placeholder="Please select Instructor">
              {selectInstructorOptions}
            </Select>
          </Form.Item>
        </Form.Item>
        {courseType == 2 ? null : (
          <Form.Item
            name="learnerSession"
            label="Session"
            style={{
              display: "inline-block",
              width: "calc(100%)",
            }}
            rules={[
              {
                required: true,
                message: "Please select Session!",
              },
            ]}
          >
            <Select mode="multiple" placeholder="Please select Session">
              {sessionOptions}
            </Select>
          </Form.Item>
        )}
        <Form.Item>
          {courseType == 2 ? null : (
            <Form.Item
              style={{
                marginBottom: 0,
                width: "calc(50%)",
                display: "inline-block",
              }}
            >
              <Form.Item noStyle name="isAutoEnroll" valuePropName="checked">
                <Switch size="small" />
              </Form.Item>
              <p
                style={{
                  display: "inline",
                  marginLeft: "15px",
                  verticalAlign: "middle",
                }}
              >
                Auto-enroll to the next session
              </p>
            </Form.Item>
          )}
          <Form.Item
            style={{
              marginBottom: 0,
              width: "calc(50%)",
              display: "inline-block",
            }}
          >
            <Form.Item noStyle name="isNotify" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
            <p
              style={{
                display: "inline",
                marginLeft: "15px",
                verticalAlign: "middle",
              }}
            >
              Notify by Email
            </p>
          </Form.Item>
        </Form.Item>
        <Divider dashed style={{ borderColor: "#999999", marginBottom: "0" }}>
          Select Learners to Enroll
        </Divider>
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

export default EnrollmentsAdd;
