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
  Editassessmentd,
  Ellipsisassessmentd,
  Eyeassessmentd,
  CloudUploadassessmentd,
  CloudDownloadassessmentd,
  Plusassessmentd,
  MinusCircleassessmentd,
  Uploadassessmentd,
} from "@ant-design/icons";
import CoursePostEvaluationsList from "./course-post-evaluations-widgets/CoursePostEvaluationsList";
import CoursePostEvaluationsDetails from "./course-post-evaluations-widgets/CoursePostEvaluationsDetails";
import CoursePostEvaluationsValues from "./course-post-evaluations-widgets/CoursePostEvaluationsValues";
import CoursePostEvaluationsStarProcess from "./course-post-evaluations-widgets/CoursePostEvaluationsStarProcess";
import CourseDateFormat from "./course-date-format/CourseDateFormat";
import { useCourseDetails } from "../../providers/CourseDStatuses";
import CourseProhibit from "../course/course-prohibit/CourseProhibit";
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

const CoursePostEvaluations = ({ course_id }) => {
  const { courseDetails, setCourseDetails } = useCourseDetails();

  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [allOutlines, setAllOutlines] = useState("");
  const [userGroupList, setUserGroupList] = useState([]);
  const [evaluationList, setEvaluationList] = useState([]);
  const [curEvaluationId, setcurEvaluationId] = useState("");
  const [evaluationType, setEvaluationType] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    evaluationdetails: [],
    evaluationitems: [],
    evaluationConstItems: [],
    evaluationvalues: [],
  });
  var [evaluationActionModal, setEvaluationActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    var config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    async function fetchData(config) {      
      await axios
        .all([
          axios.get(apiBaseUrl + "/CourseEvaluation/" + course_id, config),
          axios.get(apiBaseUrl + "/Settings/usergroup", config),
        ])
        .then(
          axios.spread((allEvaluation, allUserGroup) => {
            //check if there is course outline
            //get userGroupList
            allEvaluation.data.result
              ? setEvaluationList(allEvaluation.data.result)
              : setEvaluationList([]);

            //get userGroupList
            allUserGroup.data.result
              ? setUserGroupList(allUserGroup.data.result)
              : setUserGroupList([]);
          })
        )
        .catch((errors) => {
          // react on errors.
          console.error(errors);
        });
      setLoading(false);
    }
    fetchData(config);
  }, [loading]);

  const showModal = (modaltitle, modalformname, modalbodycontent) => {
    setEvaluationActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setEvaluationActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];

    if (name === "evaluationvalues") {
      basicForm.setFieldsValue({
        evaluationvalues: [...picklistFields, values],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        evaluationvalues: [...defaultWidgetValues.evaluationvalues, values],
      });
      //console.log("Values", values);
    }

    setEvaluationActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFinish = (values) => {
    setEvaluationActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    console.log("Finish:", values);

    let curEvaluationIdExist =
      curEvaluationId && curEvaluationId.length ? curEvaluationId[0].id : "";
    let cur_evaluationTitle =
      curEvaluationId && curEvaluationId.length ? curEvaluationId[0].title : "";
    let curevaluationTypeId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].evaluationTypeId
        : "";
    let curevaluationActionId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].evaluationActionId
        : "";
    let curUserGroupId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].userGroupId
        : "";
    let curisRequired =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].isRequired
        : "";

    console.log("Current Evaluation: ", curEvaluationId);
    var data = {};
    var errorList = [];
    if (curEvaluationIdExist) {
      //Edit Course assessment
      console.log("HELLLOOOOO Evaluation ID", curEvaluationIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.courseId = course_id;
      data.id = curEvaluationIdExist;
      var evaluationTypeId = 0;
      if (!!values.evaluationdetails) {
        if (!!values.evaluationdetails.title) {
          data.title = values.evaluationdetails.title;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.title = cur_evaluationTitle;
        }

        if (!!values.evaluationdetails.userGroup) {
          data.userGroupId = values.evaluationdetails.userGroup;
          isNotAllEmpty.push("Not Empty");
        } else {
          //console.log("is Immediate", 0);
          data.userGroupId = curUserGroupId;
        }

        if (!!values.evaluationdetails.evaluationTypeId) {
          data.evaluationTypeId = values.evaluationdetails.evaluationTypeId;
          data.evaluationActionId = values.evaluationdetails.evaluationTypeId;
          evaluationTypeId = values.evaluationdetails.evaluationTypeId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.evaluationTypeId = curevaluationTypeId;
          data.evaluationActionId = curevaluationActionId;
          evaluationTypeId = curevaluationTypeId;
        }
        //isRequired
        if (values.evaluationdetails.isRequired) {
          //console.log("is Immediate", 1);
          data.isRequired = 1;
        } else {
          //console.log("is Immediate", 0);
          data.isRequired = 0;
        }
      }

      if (!!values.evaluationvalues) {
        if (evaluationTypeId == 1) {
          if (values.evaluationvalues.minValue) {
            data.minValue = values.evaluationvalues.minValue;
            isNotAllEmpty.push("Not Empty");
          }

          if (values.evaluationvalues.maxValue) {
            data.maxValue = values.evaluationvalues.maxValue;
            isNotAllEmpty.push("Not Empty");
          }
        } else if (evaluationTypeId == 2) {
          if (values.evaluationvalues.length) {
            data.courseEvaluationValues = values.evaluationvalues.map(
              (value, index) => {
                return { name: value.optionname };
              }
            );
            isNotAllEmpty.push("Not Empty");
          }

          //console.log("The Values: ",thevalues)
        } else if (evaluationTypeId === 3) {
          /* data.minValue = values.evaluationdetails.minValue?values.evaluationdetails.minValue:0;*/
        }
      }

      // isNotAllEmpty.push("Not Empty");
      data = JSON.stringify(data);
      console.log("Edit Stringify Data: ", data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        console.log("IsNotAllEmpty", isNotAllEmpty);
        if (isNotAllEmpty.length) {
          var config = {
            method: "put",
            url: apiBaseUrl + `/CourseEvaluation/` + curEvaluationIdExist,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then((res) => {
              console.log("res: ", res.data, curEvaluationIdExist);
              onFinishModal("", res.data, curEvaluationIdExist);
            })
            .catch((err) => {
              //console.log("err: ", err.response.data);
              errorList.push(err.response.data.message);
              onFinishModal(errorList, "", curEvaluationIdExist);
            });
        } else {
          errorList.push("No Update has been made");
          onFinishModal(errorList);
        }
      }
    } else {
      //Add Course assessment
      console.log("Empty Baby", course_id);
      //NLI: Extended Form Values Processing & Filtration
      data.courseId = course_id;
      var evaluationTypeId = 0;
      if (!!values.evaluationdetails) {
        !!values.evaluationdetails.title
          ? (data.title = values.evaluationdetails.title)
          : errorList.push("Missing Evaluation Title");

        if (!!values.evaluationdetails.evaluationTypeId) {
          data.evaluationTypeId = values.evaluationdetails.evaluationTypeId;
          data.evaluationActionId = values.evaluationdetails.evaluationTypeId;
          evaluationTypeId = values.evaluationdetails.evaluationTypeId;
        } else {
          errorList.push("Missing Evaluation Type");
        }
        
        //isImmediate
        if (values.evaluationdetails.isRequired) {
          //console.log("is Immediate", 1);
          data.isRequired = 1;
        } else {
          //console.log("is Immediate", 0);
          data.isRequired = 0;
        }

        !!values.evaluationdetails.userGroup
          ? (data.userGroupId = values.evaluationdetails.userGroup)
          : errorList.push("Missing Evaluation User Group");
      } else {
        errorList.push("Missing assessment Details");
      }

      if (!!values.evaluationvalues) {
        if (evaluationTypeId == 1) {
          data.minValue = values.evaluationvalues.minValue
            ? values.evaluationvalues.minValue
            : 0;
          data.maxValue = values.evaluationvalues.maxValue
            ? values.evaluationvalues.maxValue
            : 0;
        } else if (evaluationTypeId == 2) {
          data.courseEvaluationValues = values.evaluationvalues.map(
            (value, index) => {
              return { name: value.optionname };
            }
          );
          //console.log("The Values: ",thevalues)
        } else if (evaluationTypeId === 3) {
          /* data.minValue = values.evaluationdetails.minValue?values.evaluationdetails.minValue:0;*/
        }
      } else {
        errorList.push("Missing assessment Duration");
      }

      data = JSON.stringify(data);
      console.log("Stringify Data: ", data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        //console.log("NO ERROR, PROCEED WITH SUBMISSION");
        var config = {
          method: "post",
          url: apiBaseUrl + "/CourseEvaluation",
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
    } //End of else curEvaluationIdExist
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
        title: "Course has been successfully created",
        content: theBody,
        centered: true,
        width: modalWidth,
        onOk: () => {
          console.log("response before redirection:", response);
          visible: false;          
          setdefaultWidgetValues({
            evaluationdetails: [],
            evaluationitems: [],
            evaluationConstItems: [],
            evaluationvalues: [],
          });
          setEvaluationType("");
          setcurEvaluationId("");
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

  useEffect(() => {
    if (curEvaluationId.length) {
      let isSelected = evaluationList.filter(
        (selectedassessment) => selectedassessment.id === curEvaluationId[0].id
      );
      console.log("Selected Assessment", isSelected[0]);
      let prerequisite = [];     
      let mileStones = [];      

      var theOutlineName = "";
      let currentOutlineId = isSelected[0].courseOutlineId;
      if (currentOutlineId) {
        let getOutline = allOutlines.filter(
          (outline) => outline.id == currentOutlineId
        );
        if (getOutline.length)
          theOutlineName = getOutline[0].title ? getOutline[0].title : null;
      }
            
      let currentEvaluationValue = "";
      //console.log("Selected TypeID", isSelected[0].evaluationTypeId);
      if (isSelected[0].evaluationTypeId === 1) {
        //Rating
        currentEvaluationValue = [
          {
            minValue: isSelected[0].minValue,
            maxValue: isSelected[0].maxValue,
          },
        ];
      } else if (isSelected[0].evaluationTypeId === 2) {
        //Single Question

        //currentEvaluationValue = isSelected[0].courseEvaluationValues;
        let questionValues = isSelected[0].courseEvaluationValues.map(
          (eval_value, index) => {
            let list = {
              id: eval_value.id,
              optionname: eval_value.name,
              courseEvaluationId: eval_value.courseEvaluationId,
            };
            return list;
          }
        );
        currentEvaluationValue = questionValues;
        //console.log("For ChosenRows", questionValues);
      } else if (isSelected[0].evaluationTypeId === 3) {
        //Comment
        currentEvaluationValue = "";
      }

      setEvaluationType(isSelected[0].evaluationTypeId);
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        evaluationdetails: [
          {
            title: isSelected[0].title,
            usergroup: isSelected[0].userGroup.name
              ? isSelected[0].userGroup.name
              : "None",
            usergroupid: isSelected[0].userGroupId,
            evaluationTypeId: isSelected[0].evaluationTypeId,
            evaluationTypeName: isSelected[0].evaluationTypeName,
            isRequired: isSelected[0].isRequired,
          },
        ],
        evaluationvalues: currentEvaluationValue,
      });
    } else {
      setEvaluationType("");
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        evaluationdetails: [],
        evaluationvalues: [],
        evaluationitems: [],
        evaluationConstItems: [],
      });
    }
  }, [curEvaluationId]);


  const formInitialValues = {
    /* initialValues: {
      evaluationdetails: {       
        isImmediate: true,
        attempts: 0,
      },
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
                    <h1>Post Evaluations</h1>
                  </Col>
                </Row>
                <Row
                  className="cm-main-content"
                  gutter={[16, 16]}
                  /* style={{ padding: "10px 0" }} */
                >
                  {" "}
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <CoursePostEvaluationsList
                      evaluationList={evaluationList}
                      setEvaluationList={setEvaluationList}
                      curEvaluationId={curEvaluationId}
                      setcurEvaluationId={setcurEvaluationId}
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
                          <div className="evaluationWidgetHolder">
                            <CoursePostEvaluationsDetails
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.evaluationdetails !==
                                curValues.evaluationdetails
                              }
                              showModal={showModal}
                              defaultWidgetValues={defaultWidgetValues}
                              setdefaultWidgetValues={setdefaultWidgetValues}
                              course_id={course_id}
                              allOutlines={allOutlines}
                              userGroupList={userGroupList}
                              setEvaluationType={setEvaluationType}
                            />
                          </div>
                        </Panel>
                        <Panel
                          header="Values"
                          key="3"
                          className="greyBackground"
                        >
                          <div className="evaluationWidgetHolder">
                            <div>
                              {{
                                1: (
                                  <>
                                    <CoursePostEvaluationsStarProcess
                                      evaluationType={evaluationType}
                                      defaultWidgetValues={defaultWidgetValues}
                                    />
                                  </>
                                ),
                                2: (
                                  <>
                                    <CoursePostEvaluationsValues
                                      shouldUpdate={(prevValues, curValues) =>
                                        prevValues.evaluationvalues !==
                                        curValues.evaluationvalues
                                      }
                                      showModal={showModal}
                                      defaultWidgetValues={defaultWidgetValues}
                                      setdefaultWidgetValues={
                                        setdefaultWidgetValues
                                      }
                                      evaluationList={evaluationList}
                                      evaluationType={evaluationType}
                                    />
                                  </>
                                ),
                                3: (
                                  <>
                                    <div>Comment Component here</div>
                                  </>
                                ),
                              }[evaluationType] || (
                                <div>
                                  Please select an evaluation type first
                                </div>
                              )}
                            </div>                            
                          </div>
                        </Panel>
                      </Collapse>
                    </Form>
                  </Col>
                </Row>
              </Col>

              <ModalForm
                title={evaluationActionModal.modalTitle}
                modalFormName={evaluationActionModal.modalFormName}
                modalBodyContent={evaluationActionModal.modalBodyContent}
                visible={evaluationActionModal.StateModal}
                onCancel={hideModal}
                okText={`${
                  evaluationActionModal.modalTitle != "Save" ? "Add" : "Ok"
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
                .evaluationWidgetHolder {
                  padding: 10px 0;
                }
                .evaluationWidgetHolder
                  .evaluationWithValue
                  .ant-select-selection-placeholder {
                  opacity: 1 !important;
                  color: #000000 !important;
                }
                .evaluationWithValue .ant-input::placeholder {
                  opacity: 1 !important;
                  color: #000000 !important;
                }
                .evaluationWithValue .ant-picker-input input::placeholder,
                .evaluationWithValue .ant-input-number input::placeholder {
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

export default CoursePostEvaluations;
