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

const CourseTypesAdd = ({
  course_id,
  courseDetails,
  hideModal,
  setRunSpin,
  courseType,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [courseTypeCategories, setCourseTypeCategories] = useState([]);
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [pOVisible, setPOVisible] = useState(false);
  const [cPColor, setCPColor] = useState("#4caf50");

  useEffect(() => {
  }, []);

  const selectCategory =
    courseTypeCategories && courseTypeCategories.length
      ? courseTypeCategories.map((c) => c)
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
  };
  const onFinish = (values) => {
    setSpinning(true);
    console.log("Values", values);
    console.log("Color", cPColor);
    setHasError("");
    var data = {};
    var checker = [];

    if (!!values.statusName) {
      data.name = values.statusName;
    } else {
      setHasError("* Please Input Status Name");
      checker.push("Error");
    }
    if (!!values.category) {
      data.category = values.category;
    } else {
      setHasError("* Please Select Category");
      checker.push("Error");
    }
    if (cPColor) {
      data.color = cPColor;
    } else {
      setHasError("* Please Select Colour");
      checker.push("Error");
    }

    data = JSON.stringify(data);
    if (!checker.length) {
      var config = {
        method: "post",
        url: apiBaseUrl + "/Settings/status",
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
  const CPhandleChangeComplete = (color) => {
    console.log("Color", color.hex);
    setCPColor(color.hex);
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
        name="AddPicklistCourseType"
        initialValues={
          {
            /*
          colorPicker:"#ffffff",*/
          }
        }
      >
        <Form.Item
          name="courseTypeName"
          style={{
            marginBottom: "1rem",
          }}
          rules={[
            {
              required: true,
              message: "Please input Course Type Name!",
            },
          ]}
        >
          <Input placeholder="Course Type Name" />
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
        #AddPicklistCourseTypes {
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

export default CourseTypesAdd;
