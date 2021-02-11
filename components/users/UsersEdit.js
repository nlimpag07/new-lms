import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
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

/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const UsersEdit = ({ dataProps, hideModal, setSpin }) => {
  console.log("dataProps", dataProps);
  const {
    id,
    empId,
    firstName,
    middleInitial,
    lastName,
    birthday,
    gender,
    /* username,
    password, */
    isActive,
    isAdministrator,
    isInstructor,
    isLearner,
    userType,
    departmentId,
    email,
    positionId,
  } = dataProps;
  const router = useRouter();
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
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
  const dateFormat = "DD-MMM-YYYY";
  useEffect(() => {}, []);

  const onCancel = (form) => {
    form.resetFields();
    hideModal("edit");
  };
  const onFinish = (values) => {
    setSpinning(true);
    setHasError("");
    var data = {};
    var errorList = [];
    console.log("Received values of form: ", values);
    //console.log("Re-Evaluating UserIds====");
    data.id = id;
    !!values.firstName
      ? (data.firstName = values.firstName)
      : data.firstName = firstName;
    !!values.middleInitial
      ? (data.middleInitial = values.middleInitial)
      : (data.middleInitial = middleInitial);
    !!values.lastName
      ? (data.lastName = values.lastName)
      : (data.lastName = lastName);
    !!values.gender
      ? (data.gender = values.gender)
      : (data.gender = gender);
    !!values.birthday
      ? (data.birthday = values.birthday.format("YYYY-MM-DD"))
      : (data.birthday = birthday.format("YYYY-MM-DD"));

    /* !!values.username
      ? (data.username = values.username)
      : errorList.push("Missing Username");
    !!values.password
      ? (data.password = values.password)
      : errorList.push("Missing Password"); */
    !!values.email
      ? (data.email = values.email)
      : (data.email = email);

    !!values.positionId
      ? (data.positionId = values.positionId)
      : (data.positionId = positionId);
    /* if (!!values.userRole) {
      switch (values.userRole) {
        case "1":
          data.isLearner = 1;
          data.isInstructor = 0;
          data.isAdministrator = 0;
          break;
        case "2":
          data.isInstructor = 1;
          data.isLearner = 0;
          data.isAdministrator = 0;
          break;
        case "3":
          data.isInstructor = 0;
          data.isLearner = 0;
          data.isAdministrator = 1;
          break;
        default:
          data.isInstructor = 0;
          data.isLearner = 1;
          data.isAdministrator = 0;
          break;
      }
    } else {
      errorList.push("Missing User Role");
    } */

    data = JSON.stringify(data);
    console.log(data);

    if (!errorList.length) {
      var config = {
        method: "put",
        url: apiBaseUrl + "/Users/" + id,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
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
    }else{
      console.log('errorList',errorList)
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
        hideModal("edit");
      } else {
        message.error({ content: msg, key, duration: 2 });
        setSpinning(false);
        setSpin(false);
      }
    }, 500);
  };

  //For Update: emailCheck // THis needs a new API endpoint
  const emailCheck = (form) => {
    var ev = form.getFieldValue("email");
    if (ev) {
      var config1 = {
        method: "get",
        url: apiBaseUrl + "/Users",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      async function fetchEmail(config1) {
        try {
          const response = await axios(config1);
          if (response) {
            let theRes = response.data.result;
            console.log(theRes);
            if (theRes) {
              let isExisting = theRes.filter((res) => res.email == ev);
              if (isExisting.length) {
                setEmailValidation({
                  status: "error",
                  help: "This email is already in use",
                  id: "error",
                });
              } else {
                setEmailValidation({
                  status: "success",
                  help: "This email is available.",
                  id: "success",
                });
              }
              //console.log(isExisting);
              //setPositionOptions(theRes);
            } else {
              setEmailValidation({
                status: undefined,
                help: undefined,
                id: undefined,
              });
            }
          }
        } catch (error) {
          console.log("Error Response", error);
          error.response && error.response.data
            ? openMessage(error.response.data.message, false)
            : openMessage(`Error:${error}`, false);
        }
      }
      fetchEmail(config1);
    }
  };

  //POSITION FILTERS AND GENERATOR
  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/Picklist/position",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          let theRes = response.data.result;
          //console.log(theRes)
          if (theRes) {
            setPositionOptions(theRes);
          } else {
            setPositionOptions([]);
          }
        }
      } catch (error) {
        console.log("Error Response", error);
        error.response && error.response.data
          ? openMessage(error.response.data.message, false)
          : openMessage(`Error:${error}`, false);
      }
    }
    fetchData(config);
  }, []);
  const handleSearch = (value) => {
    //console.log("handleSearch", value);
    if (value) {
      value = value.toLowerCase();
      let searchOf = positionOptions.filter((position) =>
        position.name.toLowerCase().includes(value)
      );
      //console.log("Results", searchOf);
      if (searchOf.length) {
        setPositionData({ data: searchOf });
      } else {
        setPositionData({ data: [{ id: 0, name: "--No Result--" }] });
      }
      //setPositionData({ data:searchOf });
    } else {
      setPositionData({ data: [] });
    }
  };

  const handleChange = (value) => {
    setPositionData({ ...positionData, value: value });
  };
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf("day");
  }
  const options = positionData.data.length
    ? positionData.data.map((d) => (
        <Option label={d.name} key={d.id} value={d.id}>
          {d.name}
        </Option>
      ))
    : positionOptions.map((d) => (
        <Option label={d.name} key={d.id} value={d.id}>
          {d.name}
        </Option>
      ));
  return (
    //GridType(gridList)
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="usersEdit"
        style={{ width: "100%" }}
        initialValues={{
          firstName: firstName,
          middleInitial: middleInitial,
          lastName: lastName,
          birthday: moment(birthday),
          gender: gender,
          /* username: username,
          password: password, */
          email: email,
          userRole: userType,
          positionId: positionId,
        }}
        className="addUsers"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "First Name is required" }]}
        >
          <Input placeholder="Input First Name" />
        </Form.Item>
        <Form.Item
          label="Middle Name"
          name="middleInitial"
          rules={[{ required: true, message: "Middle Name is required" }]}
        >
          <Input placeholder="Input Middle Name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Last Name is required" }]}
        >
          <Input placeholder="Input Last Name" />
        </Form.Item>
        <Form.Item label="Other Details" style={{ marginBottom: "0" }} required>
          <Form.Item
            name="gender"
            rules={[{ required: true, message: "Gender is required" }]}
            style={{ display: "inline-block", width: "calc(30%)" }}
          >
            <Select placeholder="Gender" optionLabelProp="label">
              <Option value={2} label="Female">
                Female
              </Option>
              <Option value={1} label="Male">
                Male
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="birthday"
            rules={[{ required: true, message: "Date of Birth is required" }]}
            style={{
              display: "inline-block",
              width: "calc(70% - 8px)",
              margin: "0 0 0 8px",
            }}
          >
            <DatePicker
              placeholder="Date of Birth"
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              format={dateFormat}
              defaultPickerValue={moment(birthday)}
              allowClear={false}
            />
          </Form.Item>
        </Form.Item>
        <Divider dashed style={{ marginTop: "0" }} />
        {/* <Form.Item label="Login Details" style={{ marginBottom: 0 }} required>
          <Form.Item
            name="username"
            
            style={{ display: "inline-block", width: "calc(50%)" }}
          >
            <Input placeholder="Input Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
            style={{
              display: "inline-block",
              width: "calc(50% - 8px)",
              margin: "0 0 0 8px",
            }}
          >
            <Input.Password placeholder="Input Password" />
          </Form.Item>
        </Form.Item> */}
        <Form.Item label="Email Address" style={{ marginBottom: 0 }} required>
          <Form.Item
            name="email"
            id="email"
            hasFeedback
            validateStatus={emailValidation.status}
            help={emailValidation.help}
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
            style={{
              display: "inline-block",
              width: "calc(80%)",
            }}
          >
            <Input placeholder="Input Email" />
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(20% - 8px)",
              margin: "0 0 0 8px",
            }}
          >
            <Button
              htmlType="submit"
              onClick={(e) => {
                e.preventDefault();
                emailCheck(form);
              }}
              style={{ width: "100%" }}
            >
              Check
            </Button>
          </Form.Item>
        </Form.Item>
        {/* <Form.Item name="usersFile" label="Upload File">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Upload XLS File Only</Button>
          </Upload>
        </Form.Item> */}
        <Form.Item name="positionId" label="Position">
          <Select
            showSearch
            value={positionData.value}
            placeholder="Input Position"
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            optionLabelProp="label"
          >
            {options}
          </Select>
        </Form.Item>
        <Form.Item name="userRole" label="User Role">
          {/* <Select placeholder="User Role">
            <Option value="3">Administrator</Option>
            <Option value="2">Instructor</Option>
            <Option value="1">learner</Option>
          </Select> */}
          <Input disabled />
        </Form.Item>
        <Divider style={{ border: "none" }} />
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
        .addUsers .ant-upload-select {
          float: left;
        }
        .addUsers .ant-upload-list-text {
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

export default UsersEdit;
