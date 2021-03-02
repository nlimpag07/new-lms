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
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CourseCompetenciesList from "./course-competencies-widgets/CourseCompetenciesList";
import CourseCompetenciesDetails from "./course-competencies-widgets/CourseCompetenciesDetails";
import CourseCompetenciesCertificates from "./course-competencies-widgets/CourseCompetenciesCertificates";
import CourseCompetenciesMetrics from "./course-competencies-widgets/CourseCompetenciesMetrics";
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
    icon: "&#xe962;",
    active: true,
    url: "", //"/instructor/[course]/edit"
    urlAs: "", //"/instructor/course/edit"
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
        modalFormName === "competencyprerequisite" && form.resetFields();
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

const CourseCompetencies = ({ course_id }) => {
  const { courseDetails, setCourseDetails } = useCourseDetails();
  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [competencyList, setCompetencyList] = useState("");
  const [curCompetencyId, setcurCompetencyId] = useState("");

  const [spinner, setSpinner] = useState(false);

  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    competencydetails: [],
    competencycertificates: [],
    competencymetrics: [],
  });
  var [competencyActionModal, setCompetencyActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseCompetencies/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        setCompetencyList(response.data.result);
        //console.log(response.data.result);
      }
      setLoading(false);
    }
    fetchData(config);
  }, [loading]);

  const showModal = (modaltitle, modalformname, modalbodycontent) => {
    setCompetencyActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setCompetencyActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];

    if (name === "competencycertificates") {
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          competencycertificates: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          competencycertificates: values.name,
        });
      }
      //setFeatureMedia({ image: values.name });
      console.log("competencycertificates Image: ", value);
    }

    setCompetencyActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFinish = (values) => {
    setCompetencyActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    //console.log("Finish:", values);

    let curCompetencyIdExist =
      curCompetencyId && curCompetencyId.length ? curCompetencyId[0].id : "";
    let curCompetencyTitle =
      curCompetencyId && curCompetencyId.length ? curCompetencyId[0].title : "";
    let curCompetencyuserGroupId =
      curCompetencyId && curCompetencyId.length
        ? curCompetencyId[0].userGroupId
        : "";
    //console.log("Current Outline: ", curCompetencyuserGroupId);
    var data = new FormData();
    var errorList = [];
    if (curCompetencyIdExist) {
      //Edit Course Outline
      //console.log("HELLLOOOOO Outline ID", curCompetencyIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.append("courseId", course_id);
      data.append("id", curCompetencyIdExist);
      if (values.competencydetails) {
        if (values.competencydetails.title) {
          data.append("title", values.competencydetails.title);
          isNotAllEmpty.push("Not Empty");
        } else {
          data.append("title", curCompetencyTitle);
        }
        if (values.competencydetails.description) {
          data.append("description", values.competencydetails.description);
          isNotAllEmpty.push("Not Empty");
        }
        if (values.competencydetails.usergroup) {
          data.append("userGroupId", values.competencydetails.usergroup);
          isNotAllEmpty.push("Not Empty");
        } else {
          data.append("userGroupId", curCompetencyuserGroupId);
        }
        //isNotAllEmpty.push("Not Empty");
      }

      if (values.competencymetrics) {
        if (values.competencymetrics.assessmentsSubmitted) {
          data.append(
            "assessmentsSubmitted",
            values.competencymetrics.assessmentsSubmitted
          );
          isNotAllEmpty.push("Not Empty");
        }
        if (values.competencymetrics.lessonCompleted) {
          data.append(
            "lessonCompleted",
            values.competencymetrics.lessonCompleted
          );
          isNotAllEmpty.push("Not Empty");
        }
        if (values.competencymetrics.milestonesReached) {
          data.append(
            "milestonesReached",
            values.competencymetrics.milestonesReached
          );
          isNotAllEmpty.push("Not Empty");
        }
        if (values.competencymetrics.final) {
          data.append("final", values.competencymetrics.final);
          isNotAllEmpty.push("Not Empty");
        }
      }

      if (
        values.competencycertificates &&
        values.competencycertificates.length
      ) {
        values.competencycertificates.map((media) => {
          data.append(`attachment`, media.fileList[0].originFileObj);
          //console.log(media)
        });
        isNotAllEmpty.push("Not Empty");
      }

      //data = JSON.stringify(data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        //console.log("IsNotAllEmpty", isNotAllEmpty);
        if (isNotAllEmpty.length) {
          var config = {
            method: "put",
            url: apiBaseUrl + `/CourseCompetencies/` + curCompetencyIdExist,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then((res) => {
              //console.log("res: ", res.data, curCompetencyIdExist);
              onFinishModal("", res.data, curCompetencyIdExist);
            })
            .catch((err) => {
              //console.log("err: ", err.response.data);
              errorList.push(err.response.data.message);
              onFinishModal(errorList, "", curCompetencyIdExist);
            });
        } else {
          errorList.push("No Update has been made");
          onFinishModal(errorList);
        }
      }
    } else {
      //Add Course Outline
      //console.log("Empty Baby", course_id);
      //NLI: Extended Form Values Processing & Filtration
      data.append("courseId", course_id);
      if (!!values.competencydetails) {
        !!values.competencydetails.title
          ? data.append("title", values.competencydetails.title)
          : errorList.push("Missing Competency Title");

        !!values.competencydetails.description
          ? data.append("description", values.competencydetails.description)
          : errorList.push("Missing Competency Description");

        !!values.competencydetails.usergroup
          ? data.append("userGroupId", values.competencydetails.usergroup)
          : errorList.push("Missing Competency User Group");
      } else {
        errorList.push("Missing Competency Details");
      }

      if (!!values.competencymetrics) {
        !!values.competencymetrics.assessmentsSubmitted
          ? data.append(
              "assessmentsSubmitted",
              values.competencymetrics.assessmentsSubmitted
            )
          : errorList.push("Missing Competency Assessments Submitted");

        !!values.competencymetrics.lessonCompleted
          ? data.append(
              "lessonCompleted",
              values.competencymetrics.lessonCompleted
            )
          : errorList.push("Missing Competency Lesson to Complete");

        !!values.competencymetrics.milestonesReached
          ? data.append(
              "milestonesReached",
              values.competencymetrics.milestonesReached
            )
          : errorList.push("Missing Competency Milestones to Reach");

        !!values.competencymetrics.final
          ? data.append("final", values.competencymetrics.final)
          : errorList.push("Missing Competency Final Grade");
      } else {
        errorList.push("Missing Competency Metrics");
      }

      !!values.competencycertificates && values.competencycertificates.length
        ? values.competencycertificates.map((image, index) => {
            data.append(`attachment`, image.fileList[0].originFileObj);
          })
        : errorList.push("Missing Competency Certificate");

      //data = JSON.stringify(data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        //console.log("NO ERROR, PROCEED WITH SUBMISSION");
        var config = {
          method: "post",
          url: apiBaseUrl + "/CourseCompetencies",
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
    } //End of else curCompetencyIdExist
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
        title: "Competency has been successfully created",
        content: theBody,
        centered: true,
        width: modalWidth,
        onOk: () => {
          console.log("response before redirection:", response);
          visible: false;         
          setdefaultWidgetValues({
            competencydetails: [],
            competencycertificates: [],
            competencymetrics: [],
          });
          setcurCompetencyId("");
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
  // console.log(curCompetencyId)

  useEffect(() => {
    if (curCompetencyId.length) {
      let isSelected = competencyList.filter(
        (selectedCompetency) => selectedCompetency.id === curCompetencyId[0].id
      );
      console.log("Current Selected", isSelected[0]);

      let mediaFiles = [];     
      //console.log(outlineItem)
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        competencydetails: [
          {
            title: isSelected[0].title,
            description: isSelected[0].description,
            usergroup: isSelected[0].userGroup.name,
            usergroupid: isSelected[0].userGroupId,
          },
        ],
        competencymetrics: [
          {
            lessonCompleted: isSelected[0].lessonCompleted,
            milestonesReached: isSelected[0].milestonesReached,
            assessmentsSubmitted: isSelected[0].assessmentsSubmitted,
            final: isSelected[0].final,
          },
        ],
        competencycertificates: {
          attachment: isSelected[0].attachment,
          fileName: isSelected[0].fileName,
          fileSize: isSelected[0].fileSize,
          fileType: isSelected[0].fileType,
        },
      });
    } else {
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        competencydetails: [],
        competencymetrics: [],
        competencycertificates: [],
      });
    }
  }, [curCompetencyId]);

  const formInitialValues = {
    /* initialValues: {
      outlinetitle: title,
      outlinedescription: decodeURI(description),  
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
            gutter={[16,0]}
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
                  <h1>Add/Edit Course Competencies</h1>
                </Col>
              </Row>
              <Row
                className="cm-main-content"
                gutter={[16, 16]}
                /* style={{ padding: "10px 0" }} */
              >
                {" "}
                <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                  <CourseCompetenciesList
                    competencyList={competencyList}
                    setCompetencyList={setCompetencyList}
                    curCompetencyId={curCompetencyId}
                    setcurCompetencyId={setcurCompetencyId}
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
                        header="Details"
                        key="1"
                        className="greyBackground"
                      >
                        <div className="competencyWidgetHolder">
                          <CourseCompetenciesDetails
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.competencydetails !==
                              curValues.competencydetails
                            }
                            showModal={showModal}
                            defaultWidgetValues={defaultWidgetValues}
                            setdefaultWidgetValues={setdefaultWidgetValues}
                          />
                        </div>
                      </Panel>
                      <Panel
                        header="Metrics"
                        key="2"
                        className="greyBackground"
                      >
                        <div className="competencyWidgetHolder">
                          <CourseCompetenciesMetrics
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.competencymetrics !==
                              curValues.competencymetrics
                            }
                            showModal={showModal}
                            defaultWidgetValues={defaultWidgetValues}
                            setdefaultWidgetValues={setdefaultWidgetValues}
                          />
                        </div>
                      </Panel>
                      <Panel
                        header="Certificate"
                        key="3"
                        className="greyBackground"
                      >
                        <div className="competencyWidgetHolder">
                          <CourseCompetenciesCertificates
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.competencycertificates !==
                              curValues.competencycertificates
                            }
                            showModal={showModal}
                            defaultWidgetValues={defaultWidgetValues}
                            setdefaultWidgetValues={setdefaultWidgetValues}
                          />
                        </div>
                      </Panel>
                    </Collapse>
                  </Form>
                </Col>
              </Row>
            </Col>

            <ModalForm
              title={competencyActionModal.modalTitle}
              modalFormName={competencyActionModal.modalFormName}
              modalBodyContent={competencyActionModal.modalBodyContent}
              visible={competencyActionModal.StateModal}
              onCancel={hideModal}
              okText={`${
                competencyActionModal.modalTitle != "Save" ? "Add" : "Ok"
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

              .competencyWidgetHolder {
                padding: 10px 0;
              }
              .competencyWidgetHolder
                .competencyWithValue
                .ant-select-selection-placeholder {
                opacity: 1 !important;
                color: #000000 !important;
              }
              .competencyWithValue .ant-input::placeholder {
                opacity: 1 !important;
                color: #000000 !important;
              }
              .competencyWithValue .ant-picker-input input::placeholder,
              .competencyWithValue .ant-input-number input::placeholder {
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

export default CourseCompetencies;
