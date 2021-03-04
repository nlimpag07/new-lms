import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Row,
  Spin,
  Input,
  Form,
  Select,
  Button,
  message,
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

const PreassessmentsEdit = ({
  dataProps,
  hideModal,
  setRunSpin,
  categories,
}) => {
  console.log("dataProps", dataProps);
  const { title, id } = dataProps;
  const router = useRouter();
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {}, []);

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(false);
    hideModal("edit");
  };
  const onFinish = (values) => {
    setSpinning(true);
    setHasError("");
    var data = {};
    var checker = [];

    if (!!values.title) {
      data.title = values.title;
    } else {
      data.title = title;
    }
    if (!!values.categoryId) {
      data.preassessmentCategory = [
        {
          categoryId: values.categoryId,
        },
      ];
    } else {
      setHasError("* Please Select Category");
      checker.push("Error");
    }
    data = JSON.stringify(data);
    if (!checker.length) {
      var config = {
        method: "put",
        url: apiBaseUrl + "/picklist/Preassessment/" + id,
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
          hideModal("edit");
        })
        .catch((err) => {
          console.log("err: ", err.response);
          message.error(err.response.data.message);
          setSpinning(false);
          setRunSpin(true);
          hideModal("edit");
        });
    }
  };
  var defaultCatOptionsId;
  if (dataProps) {
    let precat = dataProps.category;
    defaultCatOptionsId = precat.map((cat) => cat.categoryId);
  }
  const catOptionList =
    categories.length &&
    categories.map((option, index) => {
      let catNames = `${option.name}`;
      let optValue = option.id;
      return (
        <Option key={index} label={catNames} value={optValue}>
          {catNames}
        </Option>
      );
    });
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="EditPicklistPreassessments"
        initialValues={{
          title: title,
          categoryId: defaultCatOptionsId,
        }}
      >
        <Form.Item
          label="Preassessment Question"
          name="title"
          style={{
            marginBottom: "1rem",
          }}
          rules={[
            {
              required: true,
              message: "Please input Preassessment Name!",
            },
          ]}
        >
          <Input placeholder="Preassessment Name" />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[
            {
              required: true,
              message: "Please Select Category!",
            },
          ]}
        >
          <Select
                mode="multiple"
                placeholder="Please select Session"
                optionLabelProp="label"
              >
                {catOptionList}
              </Select>
         
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
        #EditPicklistPreassessments {
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
          padding: 5% 0;
        }
      `}</style>
    </Row>
  );
};

export default PreassessmentsEdit;
