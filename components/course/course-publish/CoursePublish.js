import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Calendar,
  Badge,
  Row,
  Col,
  Modal,
  Button,
  Form,
  Select,
  Input,
  Switch,
  Spin,
  message,
} from "antd";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const homeUrl = process.env.homeUrl;
const linkUrl = Cookies.get("usertype");
const token = Cookies.get("token");

const { TextArea } = Input;
const { Option } = Select;

const CoursePublish = ({ isPublished, title, course_id, setLoading }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [courseDetails, setCourseDetails] = useState("");
  const [pubmodal2Visible, setPubModal2Visible] = useState(false);
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);
  useEffect(() => {}, []);

  const onCloseModal = () => {
    form.resetFields();
    setPubModal2Visible(false);
    setSpinning(false);
    setLoading(true);
  };
  const onFinish = (values) => {
    setSpinning(true);
    setHasError("");
    //console.log("Values", values);
    var data = {};
    var checker = [];

    data.courseId = course_id;
    data.publish = true;
    data.lmsProfile = 0;

    if (!!values.description) {
      data.publishDescription = values.description;
    } else {
      setHasError("* ERROR: On Description, Please review the field.");
      checker.push("Error");
    }
    if (!!values.url) {
      data.courseUrl = values.url;
    } else {
      setHasError("* ERROR: On Url, Please review the field.");
      checker.push("Error");
    }
    if (!!values.visibility) {
      data.isVisible = values.visibility;
    } else {
      setHasError("* ERROR: On Visibility, Please review the field.");
      checker.push("Error");
    }
    if (!!values.notifyInstructor) {
      data.notifyInstructor = values.notifyInstructor ? 1 : 0;
    } else {
      data.notifyInstructor = 0;
    }

    data = JSON.stringify(data);
    //console.log(data);
    if (!checker.length) {
      const publishUrl =
        linkUrl == "instructor"
          ? `/Courses/${course_id}/requestpublish`
          : "/Courses/publish";
      var config = {
        method: "post",
        url: apiBaseUrl + publishUrl,
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
          //setPubModal2Visible(false);
          onCloseModal();
          //router.reload();
        })
        .catch((err) => {
          //console.log("err: ", err.response.data);
          message.error(
            `${err.response.data.statusCode} - ${err.response.data.message}`
          );
          onCloseModal();
          //setPubModal2Visible(false);
        });
      setSpinning(false);
    } else {
      setSpinning(false);
    }
  };

  return (
    //GridType(gridList)
    <Col xs={24} sm={24} md={24} lg={8} xl={6}>
      <Row justify="space-around" align="middle" className="viewStatusReq">
        <Col xs={24} sm={8} md={8} lg={12}>
          Current Status: {isPublished == 1 ? "Published" : "Unpublished"}
        </Col>
        <Col xs={24} sm={6} md={4} lg={8}>
          {isPublished != 1 && (
            <Button
              type="primary"
              shape="round"
              className="viewStatusReq-button"
              onClick={() => setPubModal2Visible(true)}
              danger
            >
              Publish
            </Button>
          )}
        </Col>
      </Row>

      <Modal
        title="Publish Properties"
        centered
        visible={pubmodal2Visible}
        onOk={onCloseModal}
        onCancel={onCloseModal}
        maskClosable={false}
        destroyOnClose={true}
        width={500}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="publishCourseModal"
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          name="publishCourse"
          style={{ width: "100%" }}
          initialValues={{
            title: title,
          }}
        >
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(100%)",
            }}
            name="title"
            label="Course Title"
          >
            <Input style={{ width: "100%" }} disabled />
          </Form.Item>
          <Form.Item
            name="description"
            label="Publish Description"
            style={{
              display: "inline-block",
              width: "calc(100%)",
            }}
            rules={[
              {
                required: true,
                message: "Please Add Publish Description!",
              },
            ]}
          >
            <TextArea rows={3} placeholder="Publish Description" />
          </Form.Item>

          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(100%)",
            }}
            name="visibility"
            label="Visibility"
            rules={[
              {
                required: true,
                message: "Please select Visibility!",
              },
            ]}
          >
            <Select placeholder="Visibiliy">
              <Option value="0">Public</Option>
              <Option value="1">Private</Option>
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              width: "calc(100%)",
            }}
            name="url"
            label="Publish Url"
            rules={[
              {
                required: true,
                message: "Please add url!",
              },
            ]}
          >
            <Input style={{ width: "100%" }} placeholder=" Publish Url" />
          </Form.Item>
          <Form.Item
            /* style={{
              display: "inline-block",
              width: "calc(100%)",
            }} */
            name="notifyInstructor"
            label="Notify Instructors"
            valuePropName="checked"
          >
            <Switch size="small" />
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
            <Button onClick={onCloseModal}>Cancel</Button>
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
      </Modal>
      <style jsx global>{`
        .publishCourseModal .ant-modal-footer {
          display: none;
          padding: 0 !important;
        }
        .publishCourseModal .spinHolder {
          text-align: center;
          z-index: 100;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          padding: 50% 0;
        }
        .publishCourseModal h1 {
          font-size: 2rem;
          font-weight: 700;
        }
      `}</style>
    </Col>
  );
};

export default CoursePublish;
