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
  Space,
  Checkbox,
} from "antd";
import {
  CaretDownOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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

const PreassessmentsAdd = ({ hideModal, setRunSpin }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [questionType, setquestionType] = useState(0);

  useEffect(() => {}, []);

  const onCancel = (form) => {
    form.resetFields();
    setSpinning(true);
    hideModal("add");
  };
  const onFinish = (values) => {
    setSpinning(true);
    setHasError("");
    var data = {};
    var checker = [];

    if (!!values.PreassessmentQuestion) {
      data.name = values.PreassessmentQuestion;
    } else {
      setHasError("* Please Input Course Type Name");
      checker.push("Error");
    }

    data = JSON.stringify(data);
    if (!checker.length) {
      var config = {
        method: "post",
        url: apiBaseUrl + "/picklist/Preassessment",
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

  const questionTypeOnChange = (value) => {
    console.log("Selected Value: ", value);
    setquestionType(value);
  };
  return (
    <Row gutter={[0, 0]}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        name="AddPicklistPreassessment"
        initialValues={
          {
            /*
          colorPicker:"#ffffff",*/
          }
        }
      >
        <Form.Item
          label="Preassessment Question"
          name="PQuestion"
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
        <Form.Item label="Choices:">
          <Form.List name={["assessmentitems", "PQuestionChoices"]}>
            {(fields, { add, remove }) => {
              let dChoices = [{ title: "", isCorrect: true }];
              return (
                <>
                  {fields.map((field) => (
                    <Form.Item key={field.key}>
                      <Space
                        key={field.key}
                        align="baseline"
                        direction="horizontal"
                      >
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.area !== curValues.area ||
                            prevValues.sights !== curValues.sights
                          }
                        >
                          {() => {
                            console.log("fields", fields);
                            return (
                              <Form.Item
                                {...field}
                                noStyle
                                name={[field.name, "name"]}
                                fieldKey={[field.fieldKey, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Missing Choice Name",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder={`Choice ${field.name + 1}`}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </Space>
                    </Form.Item>
                  ))}

                  <Form.Item noStyle>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Choice
                    </Button>
                  </Form.Item>
                </>
              );
            }}
          </Form.List>
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
        #AddPicklistPreassessment {
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

export default PreassessmentsAdd;
