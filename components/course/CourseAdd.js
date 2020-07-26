import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import RadialUI from "../theme-layout/course-circular-ui/radial-ui";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layout,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  Card,
  Avatar,
  Menu,
  Dropdown,
  Select,
  Input,
  InputNumber,
  Form,
  Cascader,
  Collapse,
  Typography,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
/**TextArea declaration */
const { TextArea } = Input;
/*menulists used by radial menu */
const menulists = [
  {
    title: "Save",
    icon: "&#xf055;",
    active: true,
    url: "/instructor/[course]/edit",
    urlAs: "/instructor/course/edit",
    callback: "Save",
  },
];
/**Panel used by collapsible accordion */
const { Panel } = Collapse;

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  }, [visible]);
};

const ModalForm = ({ title, visible, onCancel, okText }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    form.submit();
  };

  return (
    <Modal
      title={title}
      centered
      visible={visible}
      /* onOk={() =>
            setCourseActionModal({
              StateModal: false,
              modalTitle: "",
            })
          } */
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      destroyOnClose={true}
      width={1000}
      okText={okText}
      closable={false}
    >
      <Form form={form} layout="vertical" name="userForm">
        <Form.Item
          name="name"
          label="User Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="age"
          label="User Age"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CourseAdd = () => {
  var [courseActionModal, setCourseActionModal] = useState({
    StateModal: false,
    modalTitle: "",
  });
  const showModal = (modaltitle) => {
    setCourseActionModal({
      StateModal: true,
      modalTitle: modaltitle,
    });
  };

  const hideUserModal = () => {
    setCourseActionModal({
      StateModal: false,
      modalTitle: "",
    });
  };

 
  const onFormFinishProcess = (name, { values, forms }) => {
    if (name === "userForm") {
      const { basicForm } = forms;
      const users = basicForm.getFieldValue("users") || [];
      basicForm.setFieldsValue({
        users: [...users, values],
      });
      setCourseActionModal({
        StateModal: false,
        modalTitle: "",
      });
    }
  };

  const formItemLayout = {
    scrollToFirstError: true,
    wrapperCol: {
      xs: {
        span: 36,
      },
      sm: {
        span: 36,
      },
    },
  };

  return (
    <Form.Provider onFormFinish={onFormFinishProcess}>
      <Form {...formItemLayout} style={{ width: "100%" }} name="basicForm">
        <Row
          className="widget-container course-management"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "0" }}
        >
          <Col
            className="gutter-row widget-holder-col cm-main-left"
            xs={24}
            sm={24}
            md={24}
            lg={16}
          >
            <Row className="widget-header-row" justify="start">
              <Col xs={24}>
                <h3 className="widget-title">Add Course</h3>
              </Col>
            </Row>
            <Row
              className="cm-main-content"
              gutter={[16, 16]}
              style={{ padding: "10px 0" }}
            >
              <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                <Form.Item>
                  <Input placeholder="Course title" id="error" allowClear />
                </Form.Item>

                <Form.Item>
                  <TextArea
                    rows={10}
                    placeholder="Course Description"
                    allowClear
                    onChange={onChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col
            className="gutter-row widget-holder-col cm-main-right"
            xs={24}
            sm={24}
            md={24}
            lg={8}
          >
            <Row className="widget-header-row" justify="start">
              <Col xs={24}>
                <h3 className="">Draft Status here</h3>
              </Col>
            </Row>
            <Row
              className="cm-main-right-content"
              gutter={[16, 16]}
              style={{ padding: "10px 0" }}
            >
              <Col xs={24}>
                <Collapse accordion expandIconPosition={"right"}>
                  <Panel header="LEVEL" key="1" className="greyBackground">
                    <Form.Item
                      label="User List"
                      noStyle
                      allowClear
                      shouldUpdate={(prevValues, curValues) =>
                        prevValues.users !== curValues.users
                      }
                    >
                      {({ getFieldValue }) => {
                        var users = getFieldValue("users") || [];
                        //console.log(users);
                        if (users.length) {
                          return (
                            <Form.List name="users" >
                              {
                                
                              (fields, { add, remove }) => {
                                
                                return (
                                  <Row className="Noel" gutter={[4, 8]}  >
                                     {
                                      fields.map((field, index) => {
                                        
                                        //console.log(users[index].name);
                                        field = {...field, value:users[index].name + " - " + users[index].age}
                                        //console.log({...field});
                                        return(                                     
                                      <Form.Item
                                        required={false}
                                        key={field.key}  
                                        gutter={[16, 16]}                                
                                      >
                                        <Form.Item   
                                          noStyle
                                          key={field.key}
                                        >
                                          <Input
                                            placeholder="passenger name"
                                            style={{ width: "85%" }}
                                            key={field.key}
                                            value ={field.value}
                                            readOnly
                                          />
                                        </Form.Item>
                                        {fields.length >= 1 ? (
                                          <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            style={{ margin: "0 8px" }}
                                            key={`del-${field.key}`}
                                            onClick={() => {
                                              remove(field.name);
                                            }}
                                          />
                                        ) : null}
                                      </Form.Item>
                                      )
                                          })
                                  }
                                  </Row>
                                );
                              }}
                            </Form.List>
                          );
                        }else{
                          return(
                            <></>
                          )
                        }
                        /* return users.length ? (
                          <Input.Group size="large">
                            
                              {users.map((user, index) => (
                                
                                  <Input
                                    size="small"
                                    maxLength={30}
                                    key={index}
                                    id={index}
                                    className="user"
                                    value={`${user.name} - ${user.age}`}
                                    disabled
                                  />
                              ))}
                          </Input.Group>
                        ) : (
                          ""
                        ); */
                      }}
                    </Form.Item>
                    <span>
                      <PlusOutlined onClick={() => showModal("PickList")} />
                    </span>
                  </Panel>
                  <Panel header="CATEGORY" key="2" className="greyBackground">
                    <p>Known for its loyalty and faithfulness</p>
                  </Panel>
                  <Panel header="TYPE" key="3" className="greyBackground">
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel
                    header="RELATED COURSES"
                    key="4"
                    className="greyBackground"
                  >
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel header="DURATION" key="5" className="greyBackground">
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel header="LANGUAGE" key="6" className="greyBackground">
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel header="TAGS" key="7" className="greyBackground">
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel
                    header="FEATURED MEDIA"
                    key="8"
                    className="greyBackground"
                  >
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel
                    header="PASSING GRADE"
                    key="9"
                    className="greyBackground"
                  >
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                  <Panel header="CAPACITY" key="10" className="greyBackground">
                    <p>
                      it can be found as a welcome guest in many households
                      across the world
                    </p>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Col>

          <ModalForm
            title={courseActionModal.modalTitle}
            visible={courseActionModal.StateModal}
            onCancel={hideUserModal}
            okText={`${courseActionModal.modalTitle != "Save" ? "Add" : "Ok"}`}
          />

          <RadialUI
            listMenu={menulists}
            position="bottom-right"
            iconColor="#8998BA"
            toggleModal={showModal}
          />
          <style jsx global>{`
            .greyBackground {
              background-color: #eeeeee;
              text-transform: uppercase;
              font-weight: bold;
            }
            .greyBackground p {
              font-weight: normal;
              text-transform: initial;
            }
            .widget-holder-col .widget-title {
              color: #e69138;
              margin-bottom: 0;
              text-transform: uppercase;
            }
            .widget-holder-col .widget-header-row {
              padding: 5px 0;
              color: #e69138;
            }
            .course-management .ant-input-affix-wrapper {
              border-radius: 0.5rem;
              border: 1px solid #888787;
            }
            .course-management .ant-form-item textarea.ant-input {
              background-color: #eeeeee;
            }
            .course-management .cm-main-right .widget-header-row {
              text-align: end;
            }
          `}</style>
        </Row>
      </Form>
    </Form.Provider>
  );
};

const { Option } = Select;
function onChange(value) {
  console.log(`selected ${value}`);
}

export default CourseAdd;
