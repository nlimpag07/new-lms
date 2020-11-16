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
  Button,
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

const EnrollmentsAdd = ({ course_id, courseDetails, hideModal }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [courseSession, setCourseSession] = useState([]);

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
          console.log("Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            //there are enrollees
            setCourseSession(theRes);
          } else {
            //no enrollees
            setCourseSession([]);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'

        console.log("Error Response", data.message);

        Modal.error({
          title: "Error: Unable to Start Lesson",
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
    fetchData(config);
  }, []);

  console.log("courseDetails", courseDetails);
  const courseTypes = courseDetails.courseType.length
    ? courseDetails.courseType.filter(
        (courseType) => courseType.courseTypeId === 2
      )
    : [];
  //console.log("CourseTypes", courseTypes.length?"True":"False");
  //If filtered courseTypes has Data
  var isCourseType = courseTypes.length ? true : false;
  console.log(isCourseType);
  const selectInstructor = courseDetails.courseInstructor.length
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
  console.log("selectInstructor", selectInstructor);
  const onCancel = (form) => {
    form.resetFields();
    hideModal("add");
  };
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        layout="vertical"
        name="enrollAdd"
        style={{ width: "100%" }}
        initialValues={{
          modifier: { valuePropName: "checked" },
          courseTitle: courseDetails.title,
        }}
      >
        <Form.Item
          name="courseTitle"
          label="Course"
          /* rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]} */
        >
          <Input readOnly />
        </Form.Item>
        <Form.Item
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
        {isCourseType ? null : (
          <Form.Item
            name="learnerSession"
            label="Session"
            rules={[
              {
                required: true,
                message: "Please select Session!",
              },
            ]}
          >
            <Select
              mode="multiple"
              options={courseSession}
              placeholder="Please select Session"
            ></Select>
          </Form.Item>
        )}
        <Form.Item>
          <Form.Item
            noStyle
            name="modifier"
            className="collection-create-form_last-form-item"
          >
            <Switch size="small" />
          </Form.Item>
          <p>Auto-enroll to the next session</p>
        </Form.Item>
        <Form.Item
          name="modifier"
          className="collection-create-form_last-form-item"
          label="Notify by Email"
          valuePropName="checked"
        >
          <Switch size="small" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 24,
            offset: 12,
          }}
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
