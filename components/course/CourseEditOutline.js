import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import RadialUI from "../theme-layout/course-circular-ui/radial-ui";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Loader from "../../components/theme-layout/loader/loader";

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
  Upload,
  Spin,
  Empty,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CourseOutlineList from "./course-outline-widgets/CourseOutlineList";
import CourseWidgetLevel from "./course-general-widgets/CourseWidgetLevel";
import CourseWidgetCategory from "./course-general-widgets/CourseWidgetCategory";
import CourseWidgetType from "./course-general-widgets/CourseWidgetType";
import CourseWidgetRelatedCourses from "./course-general-widgets/CourseWidgetRelatedCourses";
import CourseWidgetDuration from "./course-general-widgets/CourseWidgetDuration";
import CourseWidgetLanguage from "./course-general-widgets/CourseWidgetLanguage";
import CourseWidgetTags from "./course-general-widgets/CourseWidgetTags";
import CourseWidgetFeaturedImage from "./course-general-widgets/CourseWidgetFeaturedImage";
import CourseWidgetFeaturedVideo from "./course-general-widgets/CourseWidgetFeaturedVideo";

import CourseWidgetPassingGrade from "./course-general-widgets/CourseWidgetPassingGrade";
import CourseWidgetCapacity from "./course-general-widgets/CourseWidgetCapacity";
import Error from "next/error";

import { useRouter } from "next/router";

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
const { Option } = Select;
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

const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

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
    width = 750;
  } else {
    adProps = {
      onOk: () => {
        form.submit();
        modalFormName === "picklistrelatedcourses" && form.resetFields();
        modalFormName === "picklistlevel" && form.resetFields();
        modalFormName === "picklistcategory" && form.resetFields();
        modalFormName === "picklisttype" && form.resetFields();
        modalFormName === "picklistlanguage" && form.resetFields();
        modalFormName === "picklisttags" && form.resetFields();
        //modalFormName === "picklistlevel" || modalFormName === "picklistcategory"
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

const CourseEditOutline = ({ course_id }) => {
  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [outlineList, setOutlineList] = useState("");
  const [courseId, setCourseId] = useState("");
  const [outline, setOutline] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    relatedcourses: [],
    courselevel: [],
    coursecategory: [],
    coursetype: [],
    courselanguage: [],
    coursetag: [],
    featuredimage: [],
    featuredvideo: [],
    duration: [],
    passinggrade: [],
    capacity: [],
  });
  var [courseActionModal, setOutlineActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseOutline/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        /* localStorage.setItem("courseAllList", JSON.stringify(response.data));
        setOutlineAllList(response.data); */
        setOutlineList(response.data.result);
        //console.log(response.data.result);
      } else {
        /* const userData = JSON.parse(localStorage.getItem("courseAllList"));
        setOutlineAllList(userData); */
      }
      setLoading(false);
    }
    fetchData(config); 
  }, []);

  const showModal = (modaltitle, modalformname, modalbodycontent) => {
    setOutlineActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setOutlineActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  return loading==false ? (
    <motion.div initial="hidden" animate="visible" variants={framerEffect}>
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
              <h3 className="widget-title">Add/Edit Course Outline</h3>
            </Col>
          </Row>
          <Row
            className="cm-main-content"
            gutter={[16, 16]}
            /* style={{ padding: "10px 0" }} */
          >
            {" "}
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
              <CourseOutlineList outlineList={outlineList} />
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
              <h3 className="widget-title">Draft Status here</h3>
            </Col>
          </Row>
          <Row
            className="cm-main-right-content"
            gutter={[16, 16]}
            style={{ padding: "0" }}
          >
            <Col xs={24}>
              <Form.Provider>
                <Form
                  style={{ width: "100%" }}
                  name="basicForm"
                  hideRequiredMark={true}
                >
                  <Collapse accordion expandIconPosition={"right"}>
                    <Panel header="LEVEL" key="1" className="greyBackground">
                      <CourseWidgetLevel
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistlevel !== curValues.picklistlevel
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                    </Panel>
                    <Panel header="CATEGORY" key="2" className="greyBackground">
                      <CourseWidgetCategory
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistcategory !==
                          curValues.picklistcategory
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                    </Panel>
                    <Panel header="TYPE" key="3" className="greyBackground">
                      <CourseWidgetType
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklisttype !== curValues.picklisttype
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
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
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                    </Panel>
                  </Collapse>
                </Form>
              </Form.Provider>
            </Col>
          </Row>
        </Col>

        <ModalForm
          title={courseActionModal.modalTitle}
          modalFormName={courseActionModal.modalFormName}
          modalBodyContent={courseActionModal.modalBodyContent}
          visible={courseActionModal.StateModal}
          onCancel={hideModal}
          okText={`${courseActionModal.modalTitle != "Save" ? "Add" : "Ok"}`}
          onFinish={{
            form: "basicForm",
            key: "submit",
            htmlType: "submit",
          }}
        />
        <Spin
          size="large"
          tip="Processing..."
          spinning={spinner}
          delay={100}
        ></Spin>
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
            padding: 1rem 0;
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
          .courses-class .ant-spin-spinning {
            position: fixed;
            display: block;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #ffffff9e;
            z-index: 3;
            padding: 23% 0;
          }
        `}</style>
      </Row>
    </motion.div>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default CourseEditOutline;
