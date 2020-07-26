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

const CourseWidgetLevel = () => {
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
          <>
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
                  
          <style jsx global>{`
            
          `}</style>
        </>
  );
};


export default CourseWidgetLevel;
