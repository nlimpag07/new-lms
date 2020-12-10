import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
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
  InputNumber,
  Form,
  Select,
  Radio,
  Switch,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";

/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const EnrollmentsView = ({
  course_id,
  courseDetails,
  hideModal,
  setSpin,
  courseType,
  dataProps,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {}, []);

  //console.log("enrollees", enrollees);
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

  var courseSessions = [];
  const enrolledSessions = [];
  if (courseSessions.length) {
    for (let i = 0; i < courseSessions.length; i++) {
      const sDate = moment(courseSessions[i].startDate).format(
        "YYYY/MM/DD h:mm a"
      );
      const eDate = moment(courseSessions[i].endDate).format(
        "YYYY/MM/DD h:mm a"
      );

      /*  console.log('courseSessions',element) */
      enrolledSessions.push(
        <Option
          key={i}
          value={courseSessions[i].id}
        >{`${sDate} - ${eDate}`}</Option>
      );
    }
  }
  var studentSessions;
  if (dataProps) {
    studentSessions = dataProps.learnerSession;
    console.log(studentSessions)
  }

  return (
    //GridType(gridList)

    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        layout="vertical"
        name="view-sendReminder"
        style={{ width: "100%" }}
        initialValues={{
          courseTitle: courseDetails.title,
          isAutoEnroll: false,
          isNotify: false,
          courseInstructor: "Noel Limpag",
          studentFullName: dataProps ? dataProps.studentFullName : null,
          learnerSession: "SESSION",
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
          >
            <Input readOnly />
            {/* <Select placeholder="Please select Instructor">
              {selectInstructorOptions}
            </Select> */}
          </Form.Item>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="studentFullName"
            label="Course"
            style={{ display: "inline-block", width: "calc(50% - 50px)" }}
          >
            <Input readOnly />
          </Form.Item>
          {courseType == 2 ? null : (
            <Form.Item
              name="learnerSession"
              label="Session"
              style={{
                display: "inline-block",
                width: "calc(50%)",
                margin: "0 0 0 50px",
              }}
            >
              <Select
                mode="multiple"
                disabled
                placeholder="Please select Session"
              >
                {enrolledSessions}
              </Select>
            </Form.Item>
          )}
        </Form.Item>

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
      </Form>
    </Row>
  );
};

export default EnrollmentsView;
