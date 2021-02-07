import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import SaveUI from "../theme-layout/course-circular-ui/save-circle-ui";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Loader from "../theme-layout/loader/loader";

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
  Editinstructord,
  Ellipsisinstructord,
  Eyeinstructord,
  CloudUploadinstructord,
  CloudDownloadinstructord,
  Plusinstructord,
  MinusCircleinstructord,
  Uploadinstructord,
} from "@ant-design/icons";
import CourseInstructorList from "./course-instructor-widgets/CourseInstructorList";
import CourseInstructorDetails from "./course-instructor-widgets/CourseInstructorDetails";
import CourseDateFormat from "./course-date-format/CourseDateFormat";
import { useCourseDetails } from "../../providers/CourseDStatuses";
import CourseProhibit from "../course/course-prohibit/CourseProhibit";

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
    iconClass: "ams-floppy-disk",
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
        modalFormName === "instructorprerequisite" && form.resetFields();
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

const CourseInstructors = ({ course_id }) => {
  const { courseDetails, setCourseDetails } = useCourseDetails();

  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [instructorList, setInstructorList] = useState("");
  const [instructor, setInstructor] = useState("");
  const [curInstructorId, setcurInstructorId] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    instructordetails: [],
  });
  var [instructorActionModal, setInstructorActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseInstructor/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        setInstructorList(response.data.result);
        //console.log(response.data.result);
      } else {
        /* const userData = JSON.parse(localStorage.getItem("courseAllList"));
        setInstructorAllList(userData); */
      }
      setLoading(false);
    }
    fetchData(config);
  }, [loading]);

  const showModal = (modaltitle, modalformname, modalbodycontent) => {
    setInstructorActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setInstructorActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];

    setInstructorActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFinish = (values) => {
    setInstructorActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    console.log("Finish:", values);

    let curInstructorIdExist =
      curInstructorId && curInstructorId.length ? curInstructorId[0].id : "";
    let curinstructorTitle =
      curInstructorId && curInstructorId.length ? curInstructorId[0].title : "";
    let curinstructoruserGroupId =
      curInstructorId && curInstructorId.length
        ? curInstructorId[0].userGroupId
        : "";
    let curinstructordescription =
      curInstructorId && curInstructorId.length
        ? curInstructorId[0].description
        : "";
    let curinstructorvisibility =
      curInstructorId && curInstructorId.length
        ? curInstructorId[0].visibilityNumber
        : "";

    console.log("Current instructor: ", curInstructorId);
    var data = {};
    var errorList = [];
    if (curInstructorIdExist) {
      //Edit Course instructor
      //console.log("HELLLOOOOO instructor ID", curInstructorIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.courseId = course_id;
      if (!!values.instructordetails && values.instructordetails.length) {
        if (!!values.instructordetails[0].instructortitle) {
          data.title = values.instructordetails[0].instructortitle;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.title = curinstructorTitle;
        }
        if (!!values.instructordetails[0].description) {
          data.description = values.instructordetails[0].description;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.description = curinstructordescription;
        }
        if (!!values.instructordetails[0].visibility) {
          data.visibility = values.instructordetails[0].visibility;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.visibility = curinstructorvisibility;
        }
        if (!!values.instructordetails[0].usergroup) {
          data.userGroupId = values.instructordetails[0].usergroup;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.userGroupId = curinstructoruserGroupId;
        }
        //isNotAllEmpty.push("Not Empty");
      }

      data = JSON.stringify(data);
      console.log(data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        console.log("IsNotAllEmpty", isNotAllEmpty);
        if (isNotAllEmpty.length) {
          var config = {
            method: "put",
            url: apiBaseUrl + `/CourseInstructor/` + curInstructorIdExist,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then((res) => {
              console.log("res: ", res.data, curInstructorIdExist);
              onFinishModal("", res.data, curInstructorIdExist);
            })
            .catch((err) => {
              //console.log("err: ", err.response.data);
              errorList.push(err.response.data.message);
              onFinishModal(errorList, "", curInstructorIdExist);
            });
        } else {
          errorList.push("No Update has been made");
          onFinishModal(errorList);
        }
      }
    } else {
      //Add Course instructor
      console.log("Empty Baby", course_id);
      //NLI: Extended Form Values Processing & Filtration
      data.courseId = course_id;
      if (!!values.instructordetails) {
        !!values.instructordetails.instructorId
          ? (data.userId = values.instructordetails.instructorId)
          : errorList.push("Missing Instructor");

        !!values.instructordetails.userGroupId
          ? (data.userGroupId = values.instructordetails.userGroupId)
          : errorList.push("Missing instructor User Group");
      } else {
        errorList.push("Missing instructor Details");
      }

      data = JSON.stringify(data);
      //console.log(data)
      if (errorList.length) {
        //console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        //console.log("NO ERROR, PROCEED WITH SUBMISSION");
        var config = {
          method: "post",
          url: apiBaseUrl + "/CourseInstructor",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then((res) => {
            console.log("res: ", res.data, course_id);
            onFinishModal("", res.data, course_id);
          })
          .catch((err) => {
            //console.log("err: ", err.response.data);
            errorList.push(err.response.data.message);
            onFinishModal(errorList, "", course_id);
          });
      }
    } //End of else curInstructorIdExist
  };

  const onFinishModal = (errorList, response, course_id) => {
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
        title: "Learning instructor has been successfully created",
        content: theBody,
        centered: true,
        width: modalWidth,
        onOk: () => {
          console.log("response before redirection:", response);
          visible: false;
          /* router.push(
            `/${linkUrl}/[course]/[...manage]`,
            `/${linkUrl}/course/edit/${course_id}/course-instructor`
          ); */
          setdefaultWidgetValues({
            instructordetails: [],
          });
          setcurInstructorId("");
          setLoading(true);
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
  // console.log(curInstructorId)
  /*console.log(instructorList)  */
  let {
    description,
    title,
    usergroup,
    usergroupid,
    visibility,
    visibilityNumber,
  } = "";
  useEffect(() => {
    if (curInstructorId.length) {
      //console.log(instructor);
      let isSelected = instructorList.filter(
        (selectedinstructor) => selectedinstructor.id === curInstructorId[0].id
      );
      //console.log('Select Instructor',isSelected[0]);

      title = isSelected[0].title;
      usergroup = isSelected[0].usergroup.name;
      usergroupid = isSelected[0].userGroupId;

      //console.log(instructorItem)
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        instructordetails: [
          {
            title: isSelected[0].title,
            usergroup: isSelected[0].usergroup.name,
            usergroupid: isSelected[0].userGroupId,
          },
        ],
      });
    } else {
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        instructordetails: [],
      });
    }
  }, [curInstructorId]);

  const formInitialValues = {
    /* initialValues: {
      instructortitle: title,
      description: decodeURI(description),
      usergroup: usergroup,
      usergroupid: usergroupid,
      visibility: visibility,
    }, */
  };
  return loading == false ? (
    <motion.div initial="hidden" animate="visible" variants={framerEffect}>
      <div className="common-holder">
        <Form.Provider onFormFinish={onFormFinishProcess}>
          {courseDetails.isPublished === 1 ? (
            <CourseProhibit
              title="Editing Published Course Is Prohibited"
              subTitle="Sorry, editing published course is prohibited. Please use the Course Clone function instead."
              url={`/${linkUrl}/[course]/[...manage]`}
              asUrl={`/${linkUrl}/course/view/${courseDetails.id}`}
            />
          ) : (
            <Row
              className="widget-container course-management"
              gutter={[16, 0]}
              style={{ margin: "0" }}
            >
              <Col
                className="gutter-row widget-holder-col cm-main-left"
                xs={24}
                sm={24}
                md={24}
                lg={16}
              >
                <Row justify="start">
                  <Col xs={24} className="h1-titles">
                    <h1>Course instructors</h1>
                  </Col>
                </Row>
                <Row
                  className="cm-main-content"
                  gutter={[16, 16]}
                  /* style={{ padding: "10px 0" }} */
                >
                  {" "}
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <CourseInstructorList
                      instructorList={instructorList}
                      setInstructorList={setInstructorList}
                      curInstructorId={curInstructorId}
                      setcurInstructorId={setcurInstructorId}
                      loading={loading}
                      setLoading={setLoading}
                    />
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
                <Row justify="start">
                  <Col xs={24} className="h3-titles text-right">
                    <CourseDateFormat course_id={course_id} />
                  </Col>
                </Row>
                <Row
                  className="cm-main-right-content"
                  gutter={[16, 16]}
                  style={{ padding: "0" }}
                >
                  <Col xs={24}>
                    <Form
                      style={{ width: "100%" }}
                      name="basicForm"
                      hideRequiredMark={true}
                      onFinish={onFinish}
                      validateMessages={validateMessages}
                      {...formInitialValues}
                    >
                      <Collapse
                        defaultActiveKey={["1"]}
                        expandIconPosition={"right"}
                      >
                        <Panel
                          header="Add instructor"
                          key="1"
                          className="greyBackground"
                        >
                          <div className="instructorWidgetHolder">
                            <CourseInstructorDetails
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.instructordetails !==
                                curValues.instructordetails
                              }
                              showModal={showModal}
                              instructor={instructor}
                              defaultWidgetValues={defaultWidgetValues}
                              setdefaultWidgetValues={setdefaultWidgetValues}
                            />
                            {/* <CourseinstructorFeaturedImage
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.instructorfeaturedimage !==
                            curValues.instructorfeaturedimage
                          }
                          showModal={showModal}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                        />
                        <CourseinstructorFeaturedVideo
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.instructorfeaturedvideo !==
                            curValues.instructorfeaturedvideo
                          }
                          showModal={showModal}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                        /> */}
                          </div>
                        </Panel>
                      </Collapse>
                    </Form>
                  </Col>
                </Row>
              </Col>

              <ModalForm
                title={instructorActionModal.modalTitle}
                modalFormName={instructorActionModal.modalFormName}
                modalBodyContent={instructorActionModal.modalBodyContent}
                visible={instructorActionModal.StateModal}
                onCancel={hideModal}
                okText={`${
                  instructorActionModal.modalTitle != "Save" ? "Add" : "Ok"
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
              <SaveUI
                listMenu={menulists}
                position="bottom-right"
                iconColor="#8998BA"
                toggleModal={showModal}
              />
              <style jsx global>{`
                .greyBackground .ant-collapse-header {
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
                .instructorWidgetHolder {
                  padding: 10px 0;
                }
                .instructorWidgetHolder
                  .instructorWithValue
                  .ant-select-selection-placeholder {
                  opacity: 1 !important;
                  color: #000000 !important;
                }
                .instructorWithValue .ant-input::placeholder {
                  opacity: 1 !important;
                  color: #000000 !important;
                }
              `}</style>
            </Row>
          )}
        </Form.Provider>
      </div>
    </motion.div>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default CourseInstructors;
