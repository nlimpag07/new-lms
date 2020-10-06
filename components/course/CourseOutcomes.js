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
  Editoutcomed,
  Ellipsisoutcomed,
  Eyeoutcomed,
  CloudUploadoutcomed,
  CloudDownloadoutcomed,
  Plusoutcomed,
  MinusCircleoutcomed,
  Uploadoutcomed,
} from "@ant-design/icons";
import CourseOutcomeList from "./course-outcome-widgets/CourseOutcomeList";
import CourseOutcomeDetails from "./course-outcome-widgets/CourseOutcomeDetails";
/* import CourseOutcomeFeaturedImage from "./course-outcome-widgets/CourseOutcomeFeaturedImage";
import CourseOutcomeFeaturedVideo from "./course-outcome-widgets/CourseOutcomeFeaturedVideo";
import CourseOutcomePrerequisite from "./course-outcome-widgets/CourseOutcomePrerequisite";
import CourseOutcomeMediaFiles from "./course-outcome-widgets/CourseOutcomeMediaFiles";
import CourseOutcomeMilestones from "./course-outcome-widgets/CourseOutcomeMilestones";
import CourseOutcomeDuration from "./course-outcome-widgets/CourseOutcomeDuration"; */

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
        modalFormName === "outcomedetails" && form.resetFields();
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

const CourseOutcomes = ({ course_id }) => {
  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [outcomeList, setOutcomeList] = useState("");
  const [outcome, setoutcome] = useState("");
  const [curOutcomeId, setcurOutcomeId] = useState("");

  const [spinner, setSpinner] = useState(false);
 
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    outcomedetails: [],
  });
  var [outcomeActionModal, setoutcomeActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseOutcome/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        /* localStorage.setItem("courseAllList", JSON.stringify(response.data));
        setoutcomeAllList(response.data); */
        setOutcomeList(response.data.result);
        //console.log(response.data.result);
      } else {
        /* const userData = JSON.parse(localStorage.getItem("courseAllList"));
        setoutcomeAllList(userData); */
      }
      setLoading(false);
    }
    fetchData(config);
  }, [loading]);

  const showModal = (modaltitle, modalformname, modalbodycontent) => {
    setoutcomeActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setoutcomeActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];

    setoutcomeActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFinish = (values) => {
    setoutcomeActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    console.log("Finish:", values);

    let curOutcomeIdExist =
      curOutcomeId && curOutcomeId.length ? curOutcomeId[0].id : "";
    let curoutcomeTitle =
      curOutcomeId && curOutcomeId.length ? curOutcomeId[0].title : "";
    let curoutcomeuserGroupId =
      curOutcomeId && curOutcomeId.length ? curOutcomeId[0].userGroupId : "";
    let curoutcomedescription =
      curOutcomeId && curOutcomeId.length ? curOutcomeId[0].description : "";
    let curoutcomevisibility =
      curOutcomeId && curOutcomeId.length ? curOutcomeId[0].visibilityNumber : "";

    console.log("Current outcome: ", curOutcomeId);
    var data = {};
    var errorList = [];
    if (curOutcomeIdExist) {
      //Edit Course outcome
      //console.log("HELLLOOOOO outcome ID", curOutcomeIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.courseId = course_id;
      if (!!values.outcomedetails && values.outcomedetails.length) {
        if (!!values.outcomedetails[0].outcometitle) {
          data.title = values.outcomedetails[0].outcometitle;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.title = curoutcomeTitle;
        }
        if (!!values.outcomedetails[0].description) {
          data.description = values.outcomedetails[0].description;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.description = curoutcomedescription;
        }
        if (!!values.outcomedetails[0].visibility) {
          data.visibility = values.outcomedetails[0].visibility;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.visibility = curoutcomevisibility;
        }
        if (!!values.outcomedetails[0].usergroup) {
          data.userGroupId = values.outcomedetails[0].usergroup;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.userGroupId = curoutcomeuserGroupId;
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
            url: apiBaseUrl + `/CourseOutcome/` + curOutcomeIdExist,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then((res) => {
              console.log("res: ", res.data, curOutcomeIdExist);
              onFinishModal("", res.data, curOutcomeIdExist);
            })
            .catch((err) => {
              //console.log("err: ", err.response.data);
              errorList.push(err.response.data.message);
              onFinishModal(errorList, "", curOutcomeIdExist);
            });
        } else {
          errorList.push("No Update has been made");
          onFinishModal(errorList);
        }
      }
    } else {
      //Add Course outcome
      console.log("Empty Baby", course_id);
      //NLI: Extended Form Values Processing & Filtration
      data.courseId = course_id;
      if (!!values.outcomedetails) {
        !!values.outcomedetails.outcometitle
          ? (data.title = values.outcomedetails.outcometitle)
          : errorList.push("Missing outcome Title");

        !!values.outcomedetails.description
          ? (data.description = values.outcomedetails.description)
          : errorList.push("Missing outcome Description");

        !!values.outcomedetails.visibility
          ? (data.visibility = values.outcomedetails.visibility)
          : errorList.push("Missing outcome Visibility");

        !!values.outcomedetails.usergroup
          ? (data.userGroupId = values.outcomedetails.usergroup)
          : errorList.push("Missing outcome User Group");
      } else {
        errorList.push("Missing outcome Details");
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
          url: apiBaseUrl + "/CourseOutcome",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios(config)
          .then((res) => {
            //console.log("res: ", res.data, course_id);
            onFinishModal("", res.data, course_id);
          })
          .catch((err) => {
            //console.log("err: ", err.response.data);
            errorList.push(err.response.data.message);
            onFinishModal(errorList, "", course_id);
          });
      }
    } //End of else curOutcomeIdExist
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
        title: "Learning Outcome has been successfully created",
        content: theBody,
        centered: true,
        width: modalWidth,
        onOk: () => {
          console.log("response before redirection:", response);
          visible: false;
          /* router.push(
            `/${linkUrl}/[course]/[...manage]`,
            `/${linkUrl}/course/edit/${course_id}/course-outcome`
          ); */
          setdefaultWidgetValues({
            outcomedetails: [],
          });
          setcurOutcomeId("");
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
  // console.log(curOutcomeId)
  /*console.log(outcomeList)  */
  let { description, title, usergroup, usergroupid, visibility,visibilityNumber } = "";
  useEffect(() => {
    if (curOutcomeId.length) {
      //console.log(outcome);
      let isSelected = outcomeList.filter(
        (selectedoutcome) => selectedoutcome.id === curOutcomeId[0].id
      );
      //console.log(isSelected[0]);

      title = isSelected[0].title;
      description = isSelected[0].description;
      usergroup = isSelected[0].userGroup.name;
      usergroupid = isSelected[0].userGroupId;
      visibility = isSelected[0].visibility;
      visibilityNumber = isSelected[0].visibility;

      //console.log(outcomeItem)
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outcomedetails: [
          {
            title: isSelected[0].title,
            description: isSelected[0].description,
            usergroup: isSelected[0].userGroup.name,
            usergroupid: isSelected[0].userGroupId,
            visibility: isSelected[0].visibility,
            visibilityNumber: isSelected[0].visibility,
          },
        ],
      });
    } else {
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outcomedetails: [],
      });
    }
  }, [curOutcomeId]);

  const formInitialValues = {
    /* initialValues: {
      outcometitle: title,
      description: decodeURI(description),
      usergroup: usergroup,
      usergroupid: usergroupid,
      visibility: visibility,
    }, */
  };
  return loading == false ? (
    <motion.div initial="hidden" animate="visible" variants={framerEffect}>
      <Form.Provider onFormFinish={onFormFinishProcess}>
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
                <h3 className="widget-title">Add/Edit Course outcome</h3>
              </Col>
            </Row>
            <Row
              className="cm-main-content"
              gutter={[16, 16]}
              /* style={{ padding: "10px 0" }} */
            >
              {" "}
              <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                <CourseOutcomeList
                  outcomeList={outcomeList}
                  setOutcomeList={setOutcomeList}
                  curOutcomeId={curOutcomeId}
                  setcurOutcomeId={setcurOutcomeId}
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
                    <Panel header="Details" key="1" className="greyBackground">
                      <div className="outcomeWidgetHolder">
                        <CourseOutcomeDetails
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outcomedetails !==
                            curValues.outcomedetails
                          }
                          showModal={showModal}
                          outcome={outcome}
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
            title={outcomeActionModal.modalTitle}
            modalFormName={outcomeActionModal.modalFormName}
            modalBodyContent={outcomeActionModal.modalBodyContent}
            visible={outcomeActionModal.StateModal}
            onCancel={hideModal}
            okText={`${outcomeActionModal.modalTitle != "Save" ? "Add" : "Ok"}`}
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
            .outcomeWidgetHolder {
              padding: 10px 0;
            }
            .outcomeWidgetHolder
              .outComeWithValue
              .ant-select-selection-placeholder {
              opacity: 1 !important;
              color: #000000 !important;
            }
            .outComeWithValue .ant-input::placeholder {
              opacity: 1 !important;
              color: #000000 !important;
            }
          `}</style>
        </Row>
      </Form.Provider>
    </motion.div>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default CourseOutcomes;
