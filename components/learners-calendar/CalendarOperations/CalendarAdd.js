import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import moment from "moment";
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
  DatePicker,
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

const CalendarAdd = ({
  course_id,
  spin,
  setSpin,
  setCalSessionModal,
  calSessionModal,
  instructorsList,
}) => {
  //console.log('calSessionModal',calSessionModal)
  const router = useRouter();
  const [form] = Form.useForm();
  const [courseSession, setCourseSession] = useState([]);
  const [unEnrolledLearners, setUnEnrolledLearners] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);

  //console.log(instructorsList);
  const selectInstructorOptions =
    instructorsList.length &&
    instructorsList.map((option, index) => {
      let insFullName = `${option.user.firstName} ${option.user.lastName}`;
      let insValue = option.id;
      return (
        <Option key={index} value={insValue}>
          {insFullName}
        </Option>
      );
    });
  useEffect(() => {
    
  }, []);

  //console.log("selectInstructor", selectInstructor);
  const onCancel = (form) => {
    form.resetFields();
    let sessModalArr = calSessionModal;
    setCalSessionModal({
      ...sessModalArr,
      title: "Sessions List",
      modalOperation: "general",
      width: "70%",
    });
  };
  const onFinish = (values) => {
    setSpinning(true);
    setHasError("");
    var data = {};
    var checker = [];

    data.courseId = course_id;
    if (!!values.sessionType) {
      data.sessionTypeId = values.sessionType;
    } else {
      setHasError("* ERROR: On Session Type, Please review the field.");
      checker.push("Error");
    }
    if (!!values.location) {
      data.sessionLocation = values.location;
    } else {
      setHasError("* ERROR: On Session Location, Please review the field.");
      checker.push("Error");
    }
    if (!!values.userGroup) {
      data.userGroupId = values.userGroup;
    } else {
      setHasError("* ERROR: On Session User Group, Please review the field.");
      checker.push("Error");
    }
    if (!!values.capacity) {
      data.capacity = values.capacity;
    } else {
      setHasError("* ERROR: On Capacity, Please review the field.");
      checker.push("Error");
    }
    if (!!values.startDate) {
      data.startDate = values.startDate.format("YYYY-MM-DD HH:mm");
    } else {
      setHasError("* ERROR: On Capacity, Please review the field.");
      checker.push("Error");
    }
    if (!!values.endDate) {
      data.endDate = values.endDate.format("YYYY-MM-DD HH:mm");
    } else {
      setHasError("* ERROR: On Capacity, Please review the field.");
      checker.push("Error");
    }
    if (!!values.duration) {
      data.duration = values.duration;
    } else {
      setHasError("* ERROR: On Duration, Please review the field.");
      checker.push("Error");
    }
    if (!!values.sessionInstructorId) {
      data.courseInstructorId = values.sessionInstructorId;
    } else {
      setHasError("* ERROR: On Duration, Please review the field.");
      checker.push("Error");
    }
    if (!!values.sessionTitle) {
      data.title = values.sessionTitle;
    } else {
      setHasError("* ERROR: On Session title, Please review the field.");
      checker.push("Error");
    }
    if (!!values.description) {
      data.description = values.description;
    } else {
      setHasError("* ERROR: On Description, Please review the field.");
      checker.push("Error");
    }
    data = JSON.stringify(data);
    //console.log(data);
    if (!checker.length) {
      var config = {
        method: "post",
        url: apiBaseUrl + "/CourseSession",
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
          setCalSessionModal({
            title: "",
            date: "",
            visible: false,
            modalOperation: "general",
            width: 0,
          });
          setSpin(true);
        })
        .catch((err) => {
          console.log("err: ", err.response.data);
          message.error(
            "Network Error on Submission, Contact Technical Support"
          );
          setSpin(true);
        });
      setSpinning(false);
    } else {
      setSpinning(false);
    }
  };

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="sessionAdd"
        style={{ width: "100%" }}
        initialValues={{
          /*  courseTitle: courseDetails.title, */
          startDate: moment(calSessionModal.date),
        }}
      >
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50%)",
              margin: "0 8px 0 0",
            }}
            name="sessionType"
            label="Type"
            rules={[
              {
                required: true,
                message: "Please select Session Type!",
              },
            ]}
          >
            <Select placeholder="Please select Type">
              <Option value={1}>Webinar</Option>
              <Option value={2}>Classroom</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Input placeholder="Please Indicate Location" />
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(70%)",
              margin: "0 8px 0 0",
            }}
            name="userGroup"
            label="User Group"
            rules={[
              {
                required: true,
                message: "Please select User Group!",
              },
            ]}
          >
            <Select placeholder="Please select User Group">
              <Option value="1">Administrator</Option>
              <Option value="2">Human Resources</Option>
              <Option value="3">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            style={{ display: "inline-block", width: "calc(30% - 8px)" }}
            rules={[
              {
                required: true,
                message: "Please Indicate Capacity!",
              },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Numbers Only"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(40%)",
              margin: "0 8px 0 0",
            }}
            name="startDate"
            label="Start Date"
            rules={[
              {
                required: true,
                message: "Please select Start Date!",
              },
            ]}
            /* valuePropName="value" */
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{
                format: "HH:mm",
              }}
              defaultPickerValue={moment(calSessionModal.date)}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            style={{
              display: "inline-block",
              width: "calc(40% - 8px)",
              margin: "0 8px 0 0",
            }}
            rules={[
              {
                required: true,
                message: "Please select End Date!",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{
                format: "HH:mm",
              }} /* onChange={onChange} onOk={onOk} */
            />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration"
            style={{ display: "inline-block", width: "calc(20% - 8px)" }}
            rules={[
              {
                required: true,
                message: "Please Indicate Duration!",
              },
            ]}
          >
            <InputNumber
              min={1}
              placeholder="Duration"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(100%)",
          }}
          name="sessionInstructorId"
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
        <Form.Item
          style={{
            display: "inline-block",
            width: "calc(100%)",
          }}
          name="sessionTitle"
          label="Session Title"
          rules={[
            {
              required: true,
              message: "Please Add Session Title!",
            },
          ]}
        >
          <Input
            placeholder="Please Add Session Title"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Session Description"
          style={{
            display: "inline-block",
            width: "calc(100%)",
          }}
          rules={[
            {
              required: true,
              message: "Please Add Session Description!",
            },
          ]}
        >
          <TextArea rows={3} placeholder="Session Description" />
        </Form.Item>
        {hasError ? (
          <p
            style={{
              color: "#ff4d4f",
              textAlign: "center",
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
              textAlign: "center",
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
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          padding: 45% 0;
        }
      `}</style>
    </Row>
  );
};

export default CalendarAdd;
