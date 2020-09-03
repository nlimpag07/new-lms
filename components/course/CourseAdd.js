import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import RadialUI from "../theme-layout/course-circular-ui/radial-ui";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

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

const CourseAdd = () => {
  const router = useRouter();
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
  useEffect(() => {
    setdefaultWidgetValues(defaultWidgetValues);
  }, [defaultWidgetValues]);
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
      var value = values.courselevel
        ? values.courselevel.map((level, index) => level)
        : "";
      basicForm.setFieldsValue({
        picklistlevel: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        courselevel: [...value],
      });
    }
    if (name === "picklistcategory") {
      var value = values.coursecategory
        ? values.coursecategory.map((level, index) => level)
        : "";
      basicForm.setFieldsValue({
        picklistcategory: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        coursecategory: [...value],
      });
    }
    if (name === "picklisttype") {
      var value = values.coursetype
        ? values.coursetype.map((level, index) => level)
        : "";
      basicForm.setFieldsValue({
        picklisttype: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        coursetype: [...value],
      });
    }
    if (name === "picklistrelatedcourses") {
      var value = values.relatedcourses
        ? values.relatedcourses.map((related, index) => related)
        : "";
      basicForm.setFieldsValue({
        picklistrelatedcourses: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        relatedcourses: [...value],
      });
      /* console.log('combined value', [...picklistFields, ...value]);
      console.log('======================='); */
    }
    if (name === "picklistduration") {
      basicForm.setFieldsValue({
        picklistduration: [...picklistFields, values],
      });
    }
    if (name === "picklistlanguage") {
      var value = values.courselanguage
        ? values.courselanguage.map((level, index) => level)
        : "";
      basicForm.setFieldsValue({
        picklistlanguage: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        courselanguage: [...value],
      });
    }
    if (name === "picklisttags") {
      var value = values.coursetag
        ? values.coursetag.map((level, index) => level)
        : "";
      basicForm.setFieldsValue({
        picklisttags: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        coursetag: [...value],
      });
    }
    if (name === "picklistfeaturedimage") {
      basicForm.setFieldsValue({
        picklistfeaturedimage: [values.name],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        featuredimage: values.name,
      });
      //setFeatureMedia({ image: values.name });
      //console.log("AddCourse fileList ",values.name.fileList);
    }
    if (name === "picklistfeaturedvideo") {
      basicForm.setFieldsValue({
        picklistfeaturedvideo: [values.name],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        featuredvideo: values.name,
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
    setCourseActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    console.log("Finish:", values);

    var data = new FormData();
    var errorList = [];
    //NLI: Extended Form Values Processing & Filtration
    !!values.title
      ? data.append("title", values.title)
      : errorList.push("Missing Course Title");
    !!values.description
      ? data.append("description", encodeURI(decodeURI(values.description)))
      : errorList.push("Missing Course Description");
    !!values.durationTime
      ? data.append("durationTime", values.durationTime)
      : errorList.push("Missing Course Duration Time");
    !!values.durationType
      ? data.append("durationType", values.durationType)
      : errorList.push("Missing Course Duration Type");
    !!values.passingGrade
      ? data.append("passingGrade", values.passingGrade)
      : errorList.push("Missing Course Passing Grade");
    !!values.capacity
      ? data.append("capacity", values.capacity)
      : errorList.push("Missing Course Capacity");
    !!values.picklistlevel
      ? values.picklistlevel.map((level, index) => {
          data.append(`courseLevel[${index}][levelId]`, level.id);
        })
      : errorList.push("Missing Course Level");
    !!values.picklistcategory
      ? values.picklistcategory.map((category, index) => {
          data.append(`courseCategory[${index}][categoryId]`, category.id);
        })
      : errorList.push("Missing Course Category");
    !!values.picklistrelatedcourses
      ? values.picklistrelatedcourses.map((relatedcourse, index) => {
          data.append(
            `relatedCourse[${index}][relatedCourseId]`,
            relatedcourse.id
          );
          data.append(
            `relatedCourse[${index}][isPrerequisite]`,
            relatedcourse.isreq
          );
        })
      : errorList.push("Missing Related Course");
    !!values.picklistlanguage
      ? values.picklistlanguage.map((language, index) => {
          data.append(`courseLanguage[${index}][languageId]`, language.id);
        })
      : errorList.push("Missing Course Language");
    !!values.picklisttags
      ? values.picklisttags.map((tag, index) => {
          data.append(`courseTag[${index}][tagId]`, tag.id);
        })
      : errorList.push("Missing Course Tag");
    !!values.picklisttype
      ? values.picklisttype.map((type, index) => {
          data.append(`courseType[${index}][courseTypeId]`, type.id);
        })
      : errorList.push("Missing Course Type");
    !!values.picklistfeaturedimage
      ? values.picklistfeaturedimage.map((image, index) => {
          data.append(`featureImage`, image.fileList[0].originFileObj);
        })
      : errorList.push("Missing Course Image");
    values.picklistfeaturedvideo &&
      values.picklistfeaturedvideo.map((video, index) => {
        //console.log(image.fileList[0].originFileObj);
        data.append(`featureVideo`, video.fileList[0].originFileObj);
      });
    /* !!values.picklistfeaturedvideo
      ? values.picklistfeaturedvideo.map((video, index) => {
          data.append(`featureVideo`, video.fileList[0].originFileObj);
        })
      : errorList.push("Missing Course Video"); */

    //data = JSON.stringify(data);
    if (errorList.length) {
      console.log("ERRORS: ", errorList);
      onFinishModal(errorList);
    } else {
      //console.log("NO ERROR, PROCEED WITH SUBMISSION");
      var config = {
        method: "post",
        url: apiBaseUrl + "/courses",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          console.log("res: ", res.data);
          onFinishModal("", res.data);
        })
        .catch((err) => {
          //console.log("err: ", err.response.data);
          errorList.push(err.response.data.message);
          onFinishModal(errorList, "");
        });
    }
  };

  const onFinishModal = (errorList, response) => {
    setSpinner(false);
    var modalWidth = 750;
    var theBody = "";
    if (errorList) {
      theBody = (
        <div>
          <p>The following error(s) has been generated:</p>
          <ul>
            {errorList.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      );
      //errorList.map((error, index) => level);
      Modal.error({
        title: "Submission Failed",
        content: theBody,
        centered: true,
        width: modalWidth,
      });
    } else {
      //Success submission
      theBody = (
        <div>
          <p>{response.message}</p>
        </div>
      );
      //errorList.map((error, index) => level);
      Modal.success({
        title: "Course has been successfully created",
        content: theBody,
        centered: true,
        width: modalWidth,
        onOk: () => {
          console.log("response before redirection:", response);
          visible: false;
          router.push(
            `/${linkUrl}/[course]/[...manage]`,
            `/${linkUrl}/course/edit/${response.id}/course-outline`
          );
        },
      });
    }
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
                    name="title"
                    label="Course Title"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder="Course title" allowClear />
                  </Form.Item>

                  <Form.Item label="Course Description" name="description">
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
                    <Panel header="DURATION" key="5" className="greyBackground">
                      <CourseWidgetDuration
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistduration !==
                          curValues.picklistduration
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                    </Panel>
                    <Panel header="LANGUAGE" key="6" className="greyBackground">
                      <CourseWidgetLanguage
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistlanguage !==
                          curValues.picklistlanguage
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                    </Panel>
                    <Panel header="TAGS" key="7" className="greyBackground">
                      <CourseWidgetTags
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklisttags !== curValues.picklisttags
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
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
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                      <CourseWidgetFeaturedVideo
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklistfeaturedvideo !==
                          curValues.picklistfeaturedvideo
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
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
        </Form>
      </motion.div>
    </Form.Provider>
  );
};

/* function onChange(value) {
  console.log(`selected ${value}`);
} */

export default CourseAdd;
