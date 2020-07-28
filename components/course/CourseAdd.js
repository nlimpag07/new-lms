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
import CourseWidgetLevel from "./CourseWidgetLevel";
import CourseWidgetCategory from "./CourseWidgetCategory";
import CourseWidgetType from "./CourseWidgetType";
import CourseWidgetRelatedCourses from "./CourseWidgetRelatedCourses";
import CourseWidgetDuration from "./CourseWidgetDuration";
import CourseWidgetLanguage from "./CourseWidgetLanguage";
import CourseWidgetTags from "./CourseWidgetTags";
import CourseWidgetFeaturedImage from "./CourseWidgetFeaturedImage";
import CourseWidgetFeaturedVideo from "./CourseWidgetFeaturedVideo";

import CourseWidgetPassingGrade from "./CourseWidgetPassingGrade";
import CourseWidgetCapacity from "./CourseWidgetCapacity";
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

const framerEffect = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

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

const ModalForm = ({
  title,
  modalFormName,
  modalBodyContent,
  visible,
  onCancel,
  okText,
  onFinish,
}) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });
  /*NLI - submit filtration
   *This area is for filtration on the behavior of the submit button
   * If the modal title is "Save" - it means we are going to save the add course form
   * Else, we are adding to picklists
   * Uncomment the console log to see the difference
   */
  var adProps, width;
  if (title == "Save") {
    adProps = { okButtonProps: onFinish };
    modalBodyContent = <p>Are you sure you are going to save?</p>;
    width = 450;
  } else {
    adProps = {
      onOk: () => {
        form.submit();
      },
    };
    width = 750;
  }
  //console.log(adProps);
  /*End of submit filtration */

  return (
    <Modal
      title={title}
      centered
      visible={visible}
      {...adProps}
      onCancel={onCancel}
      maskClosable={false}
      destroyOnClose={true}
      width={width}
      okText={okText}
      closable={false}
    >
      <Form form={form} layout="vertical" name={modalFormName}>
        {modalBodyContent}
      </Form>
    </Modal>
  );
};

const CourseAdd = () => {
  var [courseActionModal, setCourseActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });
  const showModal = (modaltitle, modalformname, modalbodycontent) => {
    setCourseActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setCourseActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];
   
    if (name === "picklistlevel") {
      basicForm.setFieldsValue({
        picklistlevel: [...picklistFields, values],
      });
    }
    if (name === "picklistcategory") {
      basicForm.setFieldsValue({
        picklistcategory: [...picklistFields, values],
      });
    }
    if (name === "picklisttype") {
      basicForm.setFieldsValue({
        picklisttype: [...picklistFields, values],
      });
    }
    if (name === "picklistrelatedcourses") {
      basicForm.setFieldsValue({
        picklistrelatedcourses: [...picklistFields, values],
      });
    }
    if (name === "picklistduration") {
      basicForm.setFieldsValue({
        picklistduration: [...picklistFields, values],
      });
    }
    if (name === "picklistlanguage") {
      basicForm.setFieldsValue({
        picklistlanguage: [...picklistFields, values],
      });
    }
    if (name === "picklisttags") {
      basicForm.setFieldsValue({
        picklisttags: [...picklistFields, values],
      });
    }
    if (name === "picklistfeaturedimage") {
      basicForm.setFieldsValue({
        picklistfeaturedimage: [values],
      });
      //console.log(values);
    }
    if (name === "picklistfeaturedvideo") {
      basicForm.setFieldsValue({
        picklistfeaturedvideo: [values],
      });
      //console.log(values);
    }
    if (name === "picklistpassinggrade") {
      basicForm.setFieldsValue({
        picklistpassinggrade: [...picklistFields, values],
      });
    }
    if (name === "picklistcapacity") {
      basicForm.setFieldsValue({
        picklistcapacity: [...picklistFields, values],
      });
    }
    setCourseActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };
  const onFinish = (values) => {
    console.log("Finish:", values);
    setCourseActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not validate email!",
      number: "${label} is not a validate number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
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
      <motion.div initial="hidden" animate="visible" variants={framerEffect}>
        <Form
          {...formItemLayout}
          style={{ width: "100%" }}
          name="basicForm"
          hideRequiredMark={true}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
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
                  <Form.Item
                    name="coursetitle"
                    label="Course Title"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="Course title" allowClear />
                  </Form.Item>

                  <Form.Item
                    label="Course Description"
                    name="coursedescription"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <TextArea
                      rows={10}
                      placeholder="Course Description"
                      allowClear
                      /* onChange={onChange} */
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
                      <CourseWidgetLevel
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistlevel !== curValues.picklistlevel
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel header="CATEGORY" key="2" className="greyBackground">
                      <CourseWidgetCategory
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistcategory !==
                          curValues.picklistcategory
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel header="TYPE" key="3" className="greyBackground">
                      <CourseWidgetType
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklisttype !== curValues.picklisttype
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel
                      header="RELATED COURSES"
                      key="4"
                      className="greyBackground"
                    >
                      <CourseWidgetRelatedCourses
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistrelatedcourses !==
                          curValues.picklistrelatedcourses
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel header="DURATION" key="5" className="greyBackground">
                      <CourseWidgetDuration
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistduration !==
                          curValues.picklistduration
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel header="LANGUAGE" key="6" className="greyBackground">
                      <CourseWidgetLanguage
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistlanguage !==
                          curValues.picklistlanguage
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel header="TAGS" key="7" className="greyBackground">
                      <CourseWidgetTags
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklisttags !== curValues.picklisttags
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel
                      header="FEATURED MEDIA"
                      key="8"
                      className="greyBackground"
                    >
                      <CourseWidgetFeaturedImage
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistfeaturedimage !==
                          curValues.picklistfeaturedimage
                        }
                        showModal={showModal}
                      />
                      <CourseWidgetFeaturedVideo
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistfeaturedvideo !==
                          curValues.picklistfeaturedvideo
                        }
                        showModal={showModal}
                      />
                      
                    </Panel>
                    <Panel
                      header="PASSING GRADE"
                      key="9"
                      className="greyBackground"
                    >
                      <CourseWidgetPassingGrade
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistpassinggrade !==
                          curValues.picklistpassinggrade
                        }
                        showModal={showModal}
                      />
                    </Panel>
                    <Panel
                      header="CAPACITY"
                      key="10"
                      className="greyBackground"
                    >
                      <CourseWidgetCapacity
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistcapacity !==
                          curValues.picklistcapacity
                        }
                        showModal={showModal}
                      />
                    </Panel>
                  </Collapse>
                </Col>
              </Row>
            </Col>

            <ModalForm
              title={courseActionModal.modalTitle}
              modalFormName={courseActionModal.modalFormName}
              modalBodyContent={courseActionModal.modalBodyContent}
              visible={courseActionModal.StateModal}
              onCancel={hideModal}
              okText={`${
                courseActionModal.modalTitle != "Save" ? "Add" : "Ok"
              }`}
              onFinish={{
                form: "basicForm",
                key: "submit",
                htmlType: "submit",
              }}
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
              .course-management .ant-form-item-label {
                display: none;
              }
            `}</style>
          </Row>
        </Form>
      </motion.div>
    </Form.Provider>
  );
};

const { Option } = Select;
function onChange(value) {
  console.log(`selected ${value}`);
}

export default CourseAdd;
