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

const CalendarView = ({
  course_id,
  spin,
  setSpin,
  setCalSessionModal,
  calSessionModal,
  instructorsList,
  selectedRecord,
  setSelectedRecord,
}) => {
  console.log("selectedRecord", selectedRecord);
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
        <Option key={index} label={insFullName} value={insValue}>
          {insFullName}
        </Option>
      );
    });
  useEffect(() => {
    /* var config = {
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
          //console.log("Session Response", response.data);
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
    fetchData(config); */
  }, []);

  //console.log("selectInstructor", selectInstructor);
  const onCancel = (form) => {
    form.resetFields();
    let sessModalArr = calSessionModal;
    setSelectedRecord("");
    setCalSessionModal({
      ...sessModalArr,
      title: "Sessions List",
      modalOperation: "general",
      width: "70%",
    });
  };
  const onFinish = (values) => {
    console.log("Submitted values", values);
    setSpinning(true);
    setHasError("");
    var data = {};
    var checker = [];
    let id = selectedRecord ? selectedRecord.id : values.id;
    data.courseId = course_id;
    data.id = id;
    if (!!values.sessionType) {
      data.sessionTypeId = values.sessionType;
    } else {
      data.sessionTypeId = selectedRecord && selectedRecord.sessionTypeId;
    }
    if (!!values.sessionLocation) {
      data.sessionLocation = values.sessionLocation;
    }
    if (!!values.userGroup) {
      data.userGroupId = values.userGroup;
    } else {
      data.userGroupId = selectedRecord && selectedRecord.userGroupId;
    }
    if (!!values.capacity) {
      data.capacity = values.capacity;
    }
    if (!!values.startDate) {
      data.startDate = values.startDate.format("YYYY-MM-DD HH:mm");
    } else {
      data.startDate = selectedRecord && selectedRecord.startDate;
    }
    if (!!values.endDate) {
      data.endDate = values.endDate.format("YYYY-MM-DD HH:mm");
    } else {
      data.endDate = selectedRecord && selectedRecord.endDate;
    }
    if (!!values.duration) {
      data.duration = values.duration;
    }
    if (!!values.sessionInstructorId) {
      data.courseInstructorId = values.sessionInstructorId;
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
        method: "put",
        url: apiBaseUrl + "/CourseSession/" + id,
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

  //Used only for PlaceHolders
  function sessionTypeSwitch(id) {
    let typeWord;
    switch (id) {
      case 1:
        typeWord = "Webinar";
        break;
      case 2:
        typeWord = "Classroom";
        break;
    }
    return typeWord;
  }
  function userGroupSwitch(id) {
    let groupWord;
    switch (id) {
      case 1:
        groupWord = "Administrator";
        break;
      case 2:
        groupWord = "Human Resources";
        break;
      case 3:
        groupWord = "Manager";
        break;
    }
    return groupWord;
  }
  const placeHolders = {
    sessionType: selectedRecord
      ? sessionTypeSwitch(selectedRecord.sessionTypeId)
      : "Session Type",
    startDate: selectedRecord
      ? moment(selectedRecord.startDate).format("YYYY-MM-DD HH:mm")
      : "Select Date",
    sessionLocation: selectedRecord
      ? selectedRecord.sessionLocation
      : "Please Indicate Location",
    userGroup: selectedRecord
      ? userGroupSwitch(selectedRecord.userGroupId)
      : "Please select User Group",
    capacity: selectedRecord ? selectedRecord.capacity : "",
    endDate: selectedRecord
      ? moment(selectedRecord.endDate).format("YYYY-MM-DD HH:mm")
      : "Select Date",
    duration: selectedRecord ? selectedRecord.duration : "Duration",
  };
  //End of Used only for PlaceHolders

  return (
    <Row
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "0" }}
      className="sessionViewFormHolder"
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="sessionView"
        style={{ width: "100%" }}
        initialValues={{
          id: selectedRecord ? selectedRecord.id : "",
          sessionInstructorId: selectedRecord
            ? selectedRecord.courseInstructorId
            : "",
          sessionTitle: selectedRecord ? selectedRecord.title : "",
          description: selectedRecord ? selectedRecord.description : "",
          /* sessionType: selectedRecord ? selectedRecord.sessionTypeId : "",
          startDate: selectedRecord
            ? moment(selectedRecord.startDate, "YYYY-MM-DD HH:mm")
            : moment().format("YYYY-MM-DD HH:mm"),
          sessionLocation: selectedRecord ? selectedRecord.sessionLocation : "",
          userGroup: selectedRecord ? selectedRecord.userGroupId : "",
          capacity: selectedRecord ? selectedRecord.capacity : "",
          endDate: selectedRecord
            ? moment(selectedRecord.endDate, "YYYY-MM-DD HH:mm")
            : moment().format("YYYY-MM-DD HH:mm"),
          duration: selectedRecord ? selectedRecord.duration : "",
          sessionInstructorId: selectedRecord
            ? selectedRecord.courseInstructorId
            : "",
          sessionTitle: selectedRecord ? selectedRecord.title : "",
          description: selectedRecord ? selectedRecord.description : "", */
        }}
      >
        <Form.Item
          style={{
            display: "none",
            width: "calc(50%)",
            margin: "0 8px 0 0",
          }}
          name="id"
        >
          <Input />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(50%)",
              margin: "0 8px 0 0",
            }}
            name="sessionType"
            label="Type"
          >
            <Select
              placeholder={placeHolders.sessionType}
              optionLabelProp="label"
            >
              <Option label="Webinar" value={1}>
                Webinar
              </Option>
              <Option label="Classroom" value={2}>
                Classroom
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="sessionLocation"
            label="Location"
            style={{ display: "inline-block", width: "calc(50% - 8px)" }}
          >
            <Input placeholder={placeHolders.sessionLocation} />
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
          >
            <Select
              placeholder={placeHolders.userGroup}
              optionLabelProp="label"
            >
              <Option label="Administrator" value={1}>
                Administrator
              </Option>
              <Option label="Human Resources" value={2}>
                Human Resources
              </Option>
              <Option label="Manager" value={3}>
                Manager
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            style={{ display: "inline-block", width: "calc(30% - 8px)" }}
          >
            <InputNumber
              min={1}
              placeholder={placeHolders.capacity}
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
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{
                format: "HH:mm",
              }}
              placeholder={placeHolders.startDate}
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
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{
                format: "HH:mm",
              }}
              placeholder={placeHolders.endDate}
            />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration"
            style={{ display: "inline-block", width: "calc(20% - 8px)" }}
          >
            <InputNumber
              min={1}
              placeholder={placeHolders.duration}
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
        .sessionViewFormHolder .ant-input::placeholder {
          opacity: 1 !important;
          color: #666666 !important;
        }
        .sessionViewFormHolder .ant-picker-input input::placeholder,
        .sessionViewFormHolder .ant-input-number input::placeholder {
          opacity: 1 !important;
          color: #666666 !important;
        }
        .sessionViewFormHolder .ant-select-selection-placeholder {
          opacity: 1 !important;
          color: #666666 !important;
        }
      `}</style>
    </Row>
  );
};

export default CalendarView;
