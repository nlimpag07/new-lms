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
  Divider,
  message,
  Popover,
  Avatar,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import moment from "moment";
import { CompactPicker, AlphaPicker, CirclePicker } from "react-color";
/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const StatusAdd = ({
  course_id,
  courseDetails,
  hideModal,
  setSpin,
  courseType,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [statusCategories, setStatusCategories] = useState([]);
  const [unEnrolledLearners, setUnEnrolledLearners] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [pOVisible, setPOVisible] = useState(false);
  const [cPVisible, setCPVisible] = useState("#4caf50");

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/Picklist/category/",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          console.log(response.data.result);
          let theRes = response.data.result;
          // wait for response if the verification is true
          if (theRes) {
            //there are enrollees
            setStatusCategories(theRes);
          } else {
            //no enrollees
            setStatusCategories([]);
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
        setStatusCategories([]);
      }
    }
    fetchData(config);
  }, []);

  const selectCategory =
    statusCategories && statusCategories.length
      ? statusCategories.map((c) => c)
      : [];
  const selectCategoryOptions = selectCategory.length
    ? selectCategory.map((option, index) => {
        return (
          <Option key={index} value={option.id}>
            {option.name}
          </Option>
        );
      })
    : [];

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(true);
    hideModal("add");
    setUnEnrolledLearners([]);
    setStatusCategories([]);
    setSelectedUserId([]);
  };
  const onFinish = (values) => {
    setSpinning(true);
    console.log("Values", values);
    setHasError("");
    var data = {};
    var checker = [];
    /* if (!!values.learnersData) {
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
      values.learnerSession.map((session) => {
        l_session.push({
          sessionId: session,
          //date is not sure if necessary for now
          dateScheduled: null,
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
    } */
  };
  const CPhandleChangeComplete = (color) => {
    console.log("Color", color.hex);
    setCPVisible(color.hex);
    setPOVisible(false);
  };
  const popOverHandleVisibleChange = (visible) => {
    setPOVisible(visible);
  };
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="AddPicklistStatus"
        initialValues={
          {
            /*
          colorPicker:"#ffffff",*/
          }
        }
      >
        <Form.Item
          name="statusName"
          style={{
            marginBottom: "1rem",
          }}
          rules={[
            {
              required: true,
              message: "Please input Status Name!",
            },
          ]}
        >
          <Input placeholder="Status Name" />
        </Form.Item>
        <Form.Item
          name="category"
          style={{
            marginBottom: "1rem",
          }}
          rules={[
            {
              required: true,
              message: "Please select Category!",
            },
          ]}
        >
          <Select placeholder="Please select Category">
            {selectCategoryOptions}
          </Select>
        </Form.Item>
        <Form.Item
          label="Color"
          style={{
            marginBottom: "0rem",
          }}
          name="colorPicker"
          valuePropName={cPVisible}
        >
          <Popover
            content={
              <CirclePicker
                className="Noel"
                onChangeComplete={CPhandleChangeComplete}
              />
            }
            /* content={
              <CompactPicker className="Noel" onChangeComplete={CPhandleChangeComplete} />
            } */
            trigger="click"
            placement="right"
            visible={pOVisible}
            onVisibleChange={popOverHandleVisibleChange}
          >
            <Avatar
              className="colorAvatar"
              shape="square"
              size="small"
              icon={
                <CaretDownOutlined
                  style={{
                    fontSize: "8px",
                    right: "0",
                    bottom: "0",
                    position: "absolute",
                    color: "#4D4d4d",
                  }}
                />
              }
              style={{
                backgroundColor: cPVisible,
              }}
            />
          </Popover>
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

      <style jsx global>{`
        .colorAvatar:hover {
          cursor: pointer;
        }
        #AddPicklistStatus {
          position: relative;
          width: 100%;
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
          padding: 17% 0;
        }
      `}</style>
    </Row>
  );
};

export default StatusAdd;
