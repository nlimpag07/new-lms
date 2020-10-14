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
        //modalFormName === "evaluationduration" && form.resetFields();
        //modalFormName === "evaluationitems" && form.resetFields();
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
      /* const response = await axios(config);
      if (response) {
        
        setAssessmentList(response.data.result);
        //console.log(response.data.result);
      } */
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

    if (name === "evaluationduration") {
      var value = values.evaluationduration
        ? values.evaluationduration.map((related, index) => related)
        : "";
      basicForm.setFieldsValue({
        evaluationduration: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        evaluationduration: [...value],
      });
      /* console.log('combined value', [...picklistFields, ...value]);
      console.log('======================='); */
    }
    /* if (name === "picklistduration") {
      basicForm.setFieldsValue({
        picklistduration: [...picklistFields, values],
      });
    } */

    if (name === "evaluationitems") {
      console.log("Items: ", values);
      console.log("================");
      console.log(
        "CUrrent Default AssessmentItems:",
        defaultWidgetValues.evaluationitems
      );
      console.log("================");
      console.log("CUrrent picklistFields:", ...picklistFields);

      /* var value = values.assessment_items
        ? values.assessment_items.map((item, index) => item)
        : ""; */
      basicForm.setFieldsValue({
        evaluationitems: [
          ...defaultWidgetValues.evaluationitems,
          values.evaluationitems,
        ],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        evaluationitems: [
          ...defaultWidgetValues.evaluationitems,
          values.evaluationitems,
        ],
      });
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
    let curassessmentTitle =
      curEvaluationId && curEvaluationId.length ? curEvaluationId[0].title : "";
    let curassessmentuserGroupId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].userGroupId
        : "";
    let curassessmentTypeId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].assessmentTypeId
        : "";
    let curCourseOutlineId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].courseOutlineId
        : "";
    let curUserGroupId =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].userGroupId
        : "";
    let curAttempts =
      curEvaluationId && curEvaluationId.length
        ? curEvaluationId[0].attempts
        : "";

    console.log("Current assessment: ", curEvaluationId);
    var data = {};
    var errorList = [];
    if (curEvaluationIdExist) {
      //Edit Course assessment
      console.log("HELLLOOOOO assessment ID", curEvaluationIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.courseId = course_id;
      data.id = curEvaluationIdExist;
      if (!!values.evaluationdetails) {
        //console.log("assessment Details Present")
        if (!!values.evaluationdetails.assessmenttitle) {
          data.title = values.evaluationdetails.assessmenttitle;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.title = curassessmentTitle;
        }
        if (!!values.evaluationdetails.assessmentTypeId) {
          data.assessmentTypeId = values.evaluationdetails.assessmentTypeId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.assessmentTypeId = curassessmentTypeId;
        }
        if (!!values.evaluationdetails.courseOutlineId) {
          data.courseOutlineId = values.evaluationdetails.courseOutlineId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.courseOutlineId = curCourseOutlineId;
        }
        if (!!values.evaluationdetails.userGroupId) {
          data.userGroupId = values.evaluationdetails.userGroupId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.userGroupId = curUserGroupId;
        }
        if (!!values.evaluationdetails.passingGrade) {
          data.passingGrade = values.evaluationdetails.passingGrade;
          isNotAllEmpty.push("Not Empty");
        }

        //isImmediate
        if (values.evaluationdetails.isImmediate) {
          //console.log("is Immediate", 1);
          data.isImmediate = 1;
          isNotAllEmpty.push("Not Empty");
        } else {
          //console.log("is Immediate", 0);
          data.isImmediate = 0;

          if (
            values.evaluationdetails.deadlineDate &&
            values.evaluationdetails.deadlineDate.length
          ) {
            data.fromDate = values.evaluationdetails.deadlineDate[0].format(
              "YYYY-MM-DD"
            );

            data.toDate = values.evaluationdetails.deadlineDate[1].format(
              "YYYY-MM-DD"
            );
            isNotAllEmpty.push("Not Empty");
          }
        }
        //If not undefined/null/0
        if (
          values.evaluationdetails.attempts != null &&
          curAttempts != values.evaluationdetails.attempts
        ) {
          if (values.evaluationdetails.attempts > 0) {
            data.isAttemptRequest = "update";
            data.isAttempts = 1;
            data.attempts = values.evaluationdetails.attempts;
          } else {
            data.isAttemptRequest = "update";
            data.isAttempts = 0;
            data.attempts = 0;
          }
          isNotAllEmpty.push("Not Empty");
          /* data.isAttempts = 1;
          data.attempts = values.evaluationdetails.attempts;
          isNotAllEmpty.push("Not Empty"); */
          //console.log("attempts", values.evaluationdetails.attempts);
        }
        /*  else {
          data.isAttempts = 0;
          data.attempts = 0;
        } */
      }

      if (!!values.evaluationduration) {
        if (!!values.evaluationduration.basedType) {
          data.basedType = values.evaluationduration.basedType.target.value;
          isNotAllEmpty.push("Not Empty");
        }

        if (data.basedType == 1) {
          !!values.evaluationduration.examDuration
            ? (data.duration = values.evaluationduration.examDuration)
            : errorList.push("Missing assessment Time Limit");
        } else {
          data.duration = 0;
        }
      }

      //AssessmentItems validation
      if (!!values.evaluationitems && values.evaluationitems.length) {
        let courseAssessmentItem = values.evaluationitems.map(
          (items, index) => {
            if (items.isTrue) {
              let newTrue = items.isTrue === "True" ? 1 : 0;
              items.isTrue = newTrue;
              items.isFalse = newTrue ? 0 : 1;
            }

            //console.log("For Submission evaluationitems: ",items)
            return items;
          }
        );
        data.courseAssessmentItem = courseAssessmentItem;
        isNotAllEmpty.push("Not Empty");
      }

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
            url: apiBaseUrl + `/CourseAssessment/` + curEvaluationIdExist,
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
      if (!!values.evaluationdetails) {
        !!values.evaluationdetails.assessmenttitle
          ? (data.title = values.evaluationdetails.assessmenttitle)
          : errorList.push("Missing assessment Title");

        !!values.evaluationdetails.assessmentTypeId
          ? (data.assessmentTypeId = values.evaluationdetails.assessmentTypeId)
          : errorList.push("Missing assessment Type");
        //isImmediate
        if (values.evaluationdetails.isImmediate) {
          //console.log("is Immediate", 1);
          data.isImmediate = 1;
        } else {
          //console.log("is Immediate", 0);
          data.isImmediate = 0;

          if (
            values.evaluationdetails.deadlineDate &&
            values.evaluationdetails.deadlineDate.length
          ) {
            data.fromDate = values.evaluationdetails.deadlineDate[0].format(
              "YYYY-MM-DD"
            );

            data.toDate = values.evaluationdetails.deadlineDate[1].format(
              "YYYY-MM-DD"
            );
          } else {
            errorList.push("Missing deadline Start/End date");
          }
        }

        !!values.evaluationdetails.userGroup
          ? (data.userGroupId = values.evaluationdetails.userGroup)
          : errorList.push("Missing assessment User Group");

        !!values.evaluationdetails.courseOutlineId
          ? (data.courseOutlineId = values.evaluationdetails.courseOutlineId)
          : errorList.push("Missing assessment Linked Outline");

        !!values.evaluationdetails.passingGrade
          ? (data.passingGrade = values.evaluationdetails.passingGrade)
          : errorList.push("Missing assessment Passing Grade");

        if (values.evaluationdetails.attempts) {
          data.isAttempts = 1;
          data.attempts = values.evaluationdetails.attempts;
          //console.log("attempts", values.evaluationdetails.attempts)
        } else {
          data.isAttempts = 0;
          data.attempts = 0;
        }
      } else {
        errorList.push("Missing assessment Details");
      }

      if (!!values.evaluationduration) {
        !!values.evaluationduration.basedType
          ? (data.basedType = values.evaluationduration.basedType.target.value)
          : (data.basedType = 0);

        if (data.basedType == 1) {
          !!values.evaluationduration.examDuration
            ? (data.duration = values.evaluationduration.examDuration)
            : errorList.push("Missing assessment Time Limit");
        } else {
          data.duration = 0;
        }
      } else {
        errorList.push("Missing assessment Duration");
      }

      //AssessmentItems validation
      if (!!values.evaluationitems && values.evaluationitems.length) {
        let courseAssessmentItem = values.evaluationitems.map(
          (items, index) => {
            if (items.isTrue) {
              let newTrue = items.isTrue === "True" ? 1 : 0;
              items.isTrue = newTrue;
              items.isFalse = newTrue ? 0 : 1;
            }

            //console.log("For Submission evaluationitems: ",items)
            return items;
          }
        );
        data.courseAssessmentItem = courseAssessmentItem;
      } else {
        errorList.push("Missing assessment Items");
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
          url: apiBaseUrl + "/CourseAssessment",
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
          /* router.push(
            `/${linkUrl}/[course]/[...manage]`,
            `/${linkUrl}/course/edit/${course_id}/course-assessment`
          ); */
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
      /* let currentAssessmentItem = isSelected[0].courseAssessmentsItem;
      if (currentAssessmentItem.length) {        
        prerequisite = currentAssessmentItem.map((c_assessmentItem, index) => {
          let getassessment = evaluationList.filter(
            (assessment) => c_assessmentItem.preRequisiteId == assessment.id
          );
          let list = {
            id: c_assessmentItem.id,
            title: getassessment[0].title,
            courseAssessmentsId: c_assessmentItem.courseAssessmentsId,
            preRequisiteId: c_assessmentItem.preRequisiteId,
            isticked: true,
          };
          return list;
        });
      } */

      let mileStones = [];
      /* let currentMileStones = isSelected[0].courseAssessmentsMilestone;
      if (currentMileStones.length) {
        mileStones = currentMileStones.map((c_assessmentmilestones, index) => {
          let list = {
            id: c_assessmentmilestones.id,
            name: c_assessmentmilestones.name,
            courseAssessmentsId: c_assessmentmilestones.courseAssessmentsId,
            lessonCompleted: c_assessmentmilestones.lessonCompleted,
            resourceFile: c_assessmentmilestones.resourceFile,
            isticked: true,
          };
          return list;
        });
      } */

      var theOutlineName = "";
      let currentOutlineId = isSelected[0].courseOutlineId;
      if (currentOutlineId) {
        let getOutline = allOutlines.filter(
          (outline) => outline.id == currentOutlineId
        );
        if (getOutline.length)
          theOutlineName = getOutline[0].title ? getOutline[0].title : null;
      }
      /* var theGroupName = "";
      let currentGroupId = isSelected[0].userGroupId;
      if (currentGroupId) {
        let getGroup = userGroupList.filter(
          (usergroup) => usergroup.id == currentGroupId
        );
        if (getGroup.length)
          theGroupName = getGroup[0].name ? getGroup[0].name : null;
      } */
      //console.log("Group Name:", theGroupName);
      setEvaluationType(isSelected[0].evaluationTypeId);
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        evaluationdetails: [
          {
            title: isSelected[0].title,
            description: isSelected[0].description,
            usergroup: isSelected[0].userGroup.name,
            usergroupid: isSelected[0].userGroupId,
          },
        ],
        evaluationvalues: [
          {
            lessonCompleted: isSelected[0].lessonCompleted,
            milestonesReached: isSelected[0].milestonesReached,
            assessmentsSubmitted: isSelected[0].assessmentsSubmitted,
            final: isSelected[0].final,
          },
        ],
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
  /* console.log(defaultWidgetValues)
  console.log(assessment) */

  const formInitialValues = {
    /* initialValues: {
      evaluationdetails: {
        //assessmenttitle: "HEY NOEL", 
        //userGroup: 1,
        isImmediate: true,
        attempts: 0,
      },
      //assessmentdescription: decodeURI(description),
      //evaluationduration: duration,
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
                <h3 className="widget-title">Post Evaluations</h3>
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
                    <Panel header="Values" key="3" className="greyBackground">
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
                                <div>Single Question Component here</div>
                              </>
                            ),
                            3: (
                              <>
                                <div>Comment Component here</div>
                              </>
                            ),
                          }[evaluationType] || (
                            <div>Please select an evaluation type first</div>
                          )}
                        </div>

                        {/* <CoursePostEvaluationsValues
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.evaluationitems !==
                              curValues.evaluationitems
                            }
                            showModal={showModal}
                            defaultWidgetValues={defaultWidgetValues}
                            setdefaultWidgetValues={setdefaultWidgetValues}
                            evaluationList={evaluationList}
                            evaluationType={evaluationType}
                          /> */}
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
      </Form.Provider>
    </motion.div>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default CoursePostEvaluations;
