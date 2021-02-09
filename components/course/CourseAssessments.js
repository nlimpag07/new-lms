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
import CourseAssessmentsList from "./course-assessments-widgets/CourseAssessmentsList";
import CourseAssessmentsDetails from "./course-assessments-widgets/CourseAssessmentsDetails";
import CourseAssessmentsDuration from "./course-assessments-widgets/CourseAssessmentsDuration";
import CourseAssessmentsItems from "./course-assessments-widgets/CourseAssessmentsItems";
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
        //modalFormName === "assessmentduration" && form.resetFields();
        //modalFormName === "assessmentitems" && form.resetFields();
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

const CourseAssessments = ({ course_id }) => {
  const { courseDetails, setCourseDetails } = useCourseDetails();

  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [allOutlines, setAllOutlines] = useState("");
  const [userGroupList, setUserGroupList] = useState([]);
  const [assessmentList, setAssessmentList] = useState([]);
  const [curAssessmentId, setcurAssessmentId] = useState("");
  const [assessBaseType, setAssessBaseType] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    assessmentdetails: [],
    assessmentitems: [],
    assessmentConstItems: [],
    assessmentduration: [],
  });
  var [assessmentActionModal, setAssessmentActionModal] = useState({
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
          axios.get(apiBaseUrl + "/CourseOutline/" + course_id, config),
          axios.get(apiBaseUrl + "/CourseAssessment/" + course_id, config),
          axios.get(apiBaseUrl + "/Settings/usergroup", config),
        ])
        .then(
          axios.spread((outlineList, allAssessment, allUserGroup) => {
            //check if there is course outline
            let initOutline = false;
            if (outlineList.data.result) {
              setAllOutlines(outlineList.data.result);
              initOutline = true;
            } else {
              setAllOutlines("");
            }
            //initOutline is true, check if there's assessments
            //console.log("initOutline", initOutline);
            if (initOutline) {
              allAssessment.data.result
                ? setAssessmentList(allAssessment.data.result)
                : setAssessmentList([]);
            } else {
              setAssessmentList([]);
            }

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
    setAssessmentActionModal({
      StateModal: true,
      modalTitle: modaltitle,
      modalFormName: modalformname,
      modalBodyContent: modalbodycontent,
    });
  };

  const hideModal = () => {
    setAssessmentActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];

    if (name === "assessmentduration") {
      var value = values.assessmentduration
        ? values.assessmentduration.map((related, index) => related)
        : "";
      basicForm.setFieldsValue({
        assessmentduration: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentduration: [...value],
      });
      /* console.log('combined value', [...picklistFields, ...value]);
      console.log('======================='); */
    }
    /* if (name === "picklistduration") {
      basicForm.setFieldsValue({
        picklistduration: [...picklistFields, values],
      });
    } */

    if (name === "assessmentitems") {
      console.log("Items: ", values);
      console.log("================");
      console.log(
        "CUrrent Default AssessmentItems:",
        defaultWidgetValues.assessmentitems
      );
      console.log("================");
      console.log("CUrrent picklistFields:", ...picklistFields);

      /* var value = values.assessment_items
        ? values.assessment_items.map((item, index) => item)
        : ""; */
      basicForm.setFieldsValue({
        assessmentitems: [
          ...defaultWidgetValues.assessmentitems,
          values.assessmentitems,
        ],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentitems: [
          ...defaultWidgetValues.assessmentitems,
          values.assessmentitems,
        ],
      });
    }

    setAssessmentActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFinish = (values) => {
    setAssessmentActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    console.log("Finish:", values);

    let curAssessmentIdExist =
      curAssessmentId && curAssessmentId.length ? curAssessmentId[0].id : "";
    let curassessmentTitle =
      curAssessmentId && curAssessmentId.length ? curAssessmentId[0].title : "";
    let curassessmentuserGroupId =
      curAssessmentId && curAssessmentId.length
        ? curAssessmentId[0].userGroupId
        : "";
    let curassessmentTypeId =
      curAssessmentId && curAssessmentId.length
        ? curAssessmentId[0].assessmentTypeId
        : "";
    let curCourseOutlineId =
      curAssessmentId && curAssessmentId.length
        ? curAssessmentId[0].courseOutlineId
        : "";
    let curUserGroupId =
      curAssessmentId && curAssessmentId.length
        ? curAssessmentId[0].userGroupId
        : "";
    let curAttempts =
      curAssessmentId && curAssessmentId.length
        ? curAssessmentId[0].attempts
        : "";

    //console.log("Current assessment: ", curAssessmentId);
    var data = {};
    var errorList = [];
    if (curAssessmentIdExist) {
      //Edit Course assessment
      //console.log("HELLLOOOOO assessment ID", curAssessmentIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.courseId = course_id;
      data.id = curAssessmentIdExist;
      if (!!values.assessmentdetails) {
        //console.log("assessment Details Present")
        if (!!values.assessmentdetails.assessmenttitle) {
          data.title = values.assessmentdetails.assessmenttitle;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.title = curassessmentTitle;
        }
        if (!!values.assessmentdetails.assessmentTypeId) {
          data.assessmentTypeId = values.assessmentdetails.assessmentTypeId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.assessmentTypeId = curassessmentTypeId;
        }
        if (!!values.assessmentdetails.courseOutlineId) {
          data.courseOutlineId = values.assessmentdetails.courseOutlineId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.courseOutlineId = curCourseOutlineId;
        }
        if (!!values.assessmentdetails.userGroupId) {
          data.userGroupId = values.assessmentdetails.userGroupId;
          isNotAllEmpty.push("Not Empty");
        } else {
          data.userGroupId = curUserGroupId;
        }
        if (!!values.assessmentdetails.passingGrade) {
          data.passingGrade = values.assessmentdetails.passingGrade;
          isNotAllEmpty.push("Not Empty");
        }

        //isImmediate
        if (values.assessmentdetails.isImmediate) {
          //console.log("is Immediate", 1);
          data.isImmediate = 1;
          isNotAllEmpty.push("Not Empty");
        } else {
          //console.log("is Immediate", 0);
          data.isImmediate = 0;

          if (
            values.assessmentdetails.deadlineDate &&
            values.assessmentdetails.deadlineDate.length
          ) {
            data.fromDate = values.assessmentdetails.deadlineDate[0].format(
              "YYYY-MM-DD"
            );

            data.toDate = values.assessmentdetails.deadlineDate[1].format(
              "YYYY-MM-DD"
            );
            isNotAllEmpty.push("Not Empty");
          }
        }
        //If not undefined/null/0
        if (
          values.assessmentdetails.attempts != null &&
          curAttempts != values.assessmentdetails.attempts
        ) {
          if (values.assessmentdetails.attempts > 0) {
            data.isAttemptRequest = true;
            data.isAttempts = 1;
            data.attempts = values.assessmentdetails.attempts;
          } else {
            data.isAttemptRequest = true;
            data.isAttempts = 0;
            data.attempts = 0;
          }
          isNotAllEmpty.push("Not Empty");
          /* data.isAttempts = 1;
          data.attempts = values.assessmentdetails.attempts;
          isNotAllEmpty.push("Not Empty"); */
          //console.log("attempts", values.assessmentdetails.attempts);
        }
        /*  else {
          data.isAttempts = 0;
          data.attempts = 0;
        } */
      }

      if (!!values.assessmentduration) {
        if (!!values.assessmentduration.basedType) {
          data.basedType = values.assessmentduration.basedType.target.value;
          isNotAllEmpty.push("Not Empty");
        }

        if (data.basedType == 1) {
          !!values.assessmentduration.examDuration
            ? (data.duration = values.assessmentduration.examDuration)
            : errorList.push("Missing assessment Time Limit");
        } else {
          data.duration = 0;
        }
      }

      //AssessmentItems validation
      if (!!values.assessmentitems && values.assessmentitems.length) {
        let courseAssessmentItem = values.assessmentitems.map(
          (items, index) => {
            if (items.isTrue) {
              let newTrue = items.isTrue === "True" ? 1 : 0;
              items.isTrue = newTrue;
              items.isFalse = newTrue ? 0 : 1;
            }

            //console.log("For Submission assessmentitems: ",items)
            return items;
          }
        );
        data.courseAssessmentItem = courseAssessmentItem;
        isNotAllEmpty.push("Not Empty");
      }

      data = JSON.stringify(data);
      //console.log("Edit Stringify Data: ", data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        console.log("IsNotAllEmpty", isNotAllEmpty);
        if (isNotAllEmpty.length) {
          var config = {
            method: "put",
            url: apiBaseUrl + `/CourseAssessment/` + curAssessmentIdExist,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then((res) => {
              console.log("res: ", res.data, curAssessmentIdExist);
              onFinishModal("", res.data, curAssessmentIdExist);
            })
            .catch((err) => {
              //console.log("err: ", err.response.data);
              errorList.push(err.response.data.message);
              onFinishModal(errorList, "", curAssessmentIdExist);
            });
        } else {
          errorList.push("No Update has been made");
          onFinishModal(errorList);
        }
      }
    } else {
      //Add Course assessment
      //console.log("Empty Baby", course_id);
      //NLI: Extended Form Values Processing & Filtration
      data.courseId = course_id;
      if (!!values.assessmentdetails) {
        !!values.assessmentdetails.assessmenttitle
          ? (data.title = values.assessmentdetails.assessmenttitle)
          : errorList.push("Missing assessment Title");

        !!values.assessmentdetails.assessmentTypeId
          ? (data.assessmentTypeId = values.assessmentdetails.assessmentTypeId)
          : errorList.push("Missing assessment Type");
        //isImmediate
        if (values.assessmentdetails.isImmediate) {
          //console.log("is Immediate", 1);
          data.isImmediate = 1;
        } else {
          //console.log("is Immediate", 0);
          data.isImmediate = 0;

          if (
            values.assessmentdetails.deadlineDate &&
            values.assessmentdetails.deadlineDate.length
          ) {
            data.fromDate = values.assessmentdetails.deadlineDate[0].format(
              "YYYY-MM-DD"
            );

            data.toDate = values.assessmentdetails.deadlineDate[1].format(
              "YYYY-MM-DD"
            );
          } else {
            errorList.push("Missing deadline Start/End date");
          }
        }

        !!values.assessmentdetails.userGroup
          ? (data.userGroupId = values.assessmentdetails.userGroup)
          : errorList.push("Missing assessment User Group");

        !!values.assessmentdetails.courseOutlineId
          ? (data.courseOutlineId = values.assessmentdetails.courseOutlineId)
          : errorList.push("Missing assessment Linked Outline");

        !!values.assessmentdetails.passingGrade
          ? (data.passingGrade = values.assessmentdetails.passingGrade)
          : errorList.push("Missing assessment Passing Grade");

        if (values.assessmentdetails.attempts) {
          data.isAttempts = 1;
          data.attempts = values.assessmentdetails.attempts;
          //console.log("attempts", values.assessmentdetails.attempts)
        } else {
          data.isAttempts = 0;
          data.attempts = 0;
        }
      } else {
        errorList.push("Missing assessment Details");
      }

      if (!!values.assessmentduration) {
        !!values.assessmentduration.basedType
          ? (data.basedType = values.assessmentduration.basedType.target.value)
          : (data.basedType = 0);

        if (data.basedType == 1) {
          !!values.assessmentduration.examDuration
            ? (data.duration = values.assessmentduration.examDuration)
            : errorList.push("Missing assessment Time Limit");
        } else {
          data.duration = 0;
        }
      } else {
        errorList.push("Missing assessment Duration");
      }

      //AssessmentItems validation
      if (!!values.assessmentitems && values.assessmentitems.length) {
        let courseAssessmentItem = values.assessmentitems.map(
          (items, index) => {
            if (items.isTrue) {
              let newTrue = items.isTrue === "True" ? 1 : 0;
              items.isTrue = newTrue;
              items.isFalse = newTrue ? 0 : 1;
            }
            
            if (items.courseAssessmentItemChoices) {
              let itemChoices = items.courseAssessmentItemChoices.map(
                (choice, cIndex) => {
                  choice.id = 0;
                  choice.courseAssessmentItemId = items.id;
                  choice.isCorrect = choice.isCorrect ? 1 : 0;
                  return choice;
                }
              );
              console.log("itemChoices",itemChoices)
              items.courseAssessmentItemChoices = itemChoices;
              items.isShuffle =items.isShuffle?1:0;
            }
            //console.log("For Submission assessmentitems: ",items)
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
    } //End of else curAssessmentIdExist
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
            assessmentdetails: [],
            assessmentitems: [],
            assessmentConstItems: [],
            assessmentduration: [],
          });
          setAssessBaseType("");
          setcurAssessmentId("");
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
  // console.log(curAssessmentId)
  /*console.log(assessmentList)  */
  /* let {
    id,
    courseAssessmentsMedia,
    courseAssessmentsMilestone,
    courseAssessmentsItems,
    description,
    duration,
    featureImage,
    interactiveVideo,
    title,
    userGroup,
  } = ""; */
  useEffect(() => {
    let {
      id,
      courseAssessmentsMedia,
      courseAssessmentsMilestone,
      courseAssessmentsItems,
      description,
      duration,
      featureImage,
      interactiveVideo,
      title,
      userGroupId,
      visibility,
    } = "";
    if (curAssessmentId.length) {
      let isSelected = assessmentList.filter(
        (selectedassessment) => selectedassessment.id === curAssessmentId[0].id
      );
      console.log("Selected Assessment", isSelected[0]);
      let prerequisite = [];
      /* let currentAssessmentItem = isSelected[0].courseAssessmentsItem;
      if (currentAssessmentItem.length) {        
        prerequisite = currentAssessmentItem.map((c_assessmentItem, index) => {
          let getassessment = assessmentList.filter(
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
      let mediaFiles = [];
      /* let currentMediaFiles = isSelected[0].courseAssessmentsMedia;
      if (currentMediaFiles.length) {
        mediaFiles = currentMediaFiles.map((c_assessmentmediafiles, index) => {
          let list = {
            id: c_assessmentmediafiles.id,
            name: c_assessmentmediafiles.fileName,
            courseAssessmentsId: c_assessmentmediafiles.courseAssessmentsId,
            resourceFile: c_assessmentmediafiles.resourceFile,
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
      var theGroupName = "";
      let currentGroupId = isSelected[0].userGroupId;
      if (currentGroupId) {
        let getGroup = userGroupList.filter(
          (usergroup) => usergroup.id == currentGroupId
        );
        if (getGroup.length)
          theGroupName = getGroup[0].name ? getGroup[0].name : null;
      }
      //console.log("Group Name:", theGroupName);
      setAssessBaseType(isSelected[0].basedType);
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentdetails: [
          {
            id: isSelected[0].id,
            title: isSelected[0].title,
            assessmentTypeName: isSelected[0].assessmentType.name,
            assessmentTypeId: isSelected[0].assessmentTypeId,
            courseOutlineName: theOutlineName,
            courseOutlineId: isSelected[0].courseOutlineId,
            userGroup: theGroupName,
            userGroupId: isSelected[0].userGroupId,
            passingGrade: isSelected[0].passingGrade,
            isImmediate: isSelected[0].isImmediate ? true : false,
            fromDate: isSelected[0].fromDate,
            toDate: isSelected[0].toDate,
            isAttempts: isSelected[0].isAttempts,
            attempts: isSelected[0].attempts,
            basedType: isSelected[0].basedType,
            isShuffle: isSelected[0].isShuffle,
            courseAssessmentItem: isSelected[0].courseAssessmentItem,
          },
        ],
        assessmentitems: isSelected[0].courseAssessmentItem,
        assessmentConstItems: isSelected[0].courseAssessmentItem,
        assessmentduration: [
          {
            basedType: isSelected[0].basedType,
            examDuration: isSelected[0].duration ? isSelected[0].duration : 0,
          },
        ],
      });
    } else {
      setAssessBaseType("");
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentdetails: [],
        assessmentduration: [],
        assessmentitems: [],
        assessmentConstItems: [],

        /* featuredvideo: video,
        relatedcourses: relateds,
        duration: [durationtime], */
      });
    }
    //console.log(title)
    //setdefaultWidgetValues(defaultWidgetValues);
    /* let {
      relateds,
      categories,
      levels,
      types,
      languages,
      tags,
      image,
      video,
      durationtime,
      durationtype,
    } = "";

    if (relatedCourse) {
      relateds = relatedCourse.map((c_related, index) => {
        let list = {
          id: c_related.courseRelated.course.id,
          title: c_related.courseRelated.course.title,
          isreq: c_related.isPrerequisite,
        };
        return list;
      });
    }
    
    if (featureImage) {
      image = featureImage;
    }
    if (featureVideo) {
      video = featureVideo;
    }
    if (durationTime && durationType) {
      video = featureVideo;
    }
    if (durationTime && durationType) {
      durationtime = { durationTime: durationTime, durationType: durationType };
    }
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      featuredimage: image,
      featuredvideo: video,
      relatedcourses: relateds,
      duration: [durationtime],
    }); */
  }, [curAssessmentId]);
  /* console.log(defaultWidgetValues)
  console.log(assessment) */

  const formInitialValues = {
    /* initialValues: {
      assessmentdetails: {
        //assessmenttitle: "HEY NOEL", 
        //userGroup: 1,
        isImmediate: true,
        attempts: 0,
      },
      //assessmentdescription: decodeURI(description),
      //assessmentduration: duration,
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
                    <h1>Course Assessments</h1>
                  </Col>
                </Row>
                <Row
                  className="cm-main-content"
                  gutter={[16, 16]}
                  /* style={{ padding: "10px 0" }} */
                >
                  {" "}
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <CourseAssessmentsList
                      assessmentList={assessmentList}
                      setAssessmentList={setAssessmentList}
                      curAssessmentId={curAssessmentId}
                      setcurAssessmentId={setcurAssessmentId}
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
                    {allOutlines ? (
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
                            <div className="assessmentWidgetHolder">
                              <CourseAssessmentsDetails
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.assessmentdetails !==
                                  curValues.assessmentdetails
                                }
                                showModal={showModal}
                                defaultWidgetValues={defaultWidgetValues}
                                setdefaultWidgetValues={setdefaultWidgetValues}
                                course_id={course_id}
                                allOutlines={allOutlines}
                                userGroupList={userGroupList}
                              />
                            </div>
                          </Panel>
                          <Panel
                            header="Assessment Duration"
                            key="2"
                            className="greyBackground"
                          >
                            <div className="assessmentWidgetHolder">
                              <CourseAssessmentsDuration
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.assessmentduration !==
                                  curValues.assessmentduration
                                }
                                showModal={showModal}
                                defaultWidgetValues={defaultWidgetValues}
                                setdefaultWidgetValues={setdefaultWidgetValues}
                                assessmentList={assessmentList}
                                setAssessBaseType={setAssessBaseType}
                              />
                            </div>
                          </Panel>
                          <Panel
                            header="Items"
                            key="3"
                            className="greyBackground"
                          >
                            <div className="assessmentWidgetHolder">
                              <CourseAssessmentsItems
                                shouldUpdate={(prevValues, curValues) =>
                                  prevValues.assessmentitems !==
                                  curValues.assessmentitems
                                }
                                showModal={showModal}
                                defaultWidgetValues={defaultWidgetValues}
                                setdefaultWidgetValues={setdefaultWidgetValues}
                                assessmentList={assessmentList}
                                assessBaseType={assessBaseType}
                              />
                            </div>
                          </Panel>
                        </Collapse>
                      </Form>
                    ) : (
                      <Empty
                        description={
                          <span>
                            No Course Outline detected, Please create on first.
                          </span>
                        }
                      >
                        <Button
                          type="primary"
                          onClick={() =>
                            router.push(
                              `/${linkUrl}/course/edit/${course_id}/course-outline`
                            )
                          }
                        >
                          Create Now
                        </Button>
                      </Empty>
                    )}
                  </Col>
                </Row>
              </Col>

              <ModalForm
                title={assessmentActionModal.modalTitle}
                modalFormName={assessmentActionModal.modalFormName}
                modalBodyContent={assessmentActionModal.modalBodyContent}
                visible={assessmentActionModal.StateModal}
                onCancel={hideModal}
                okText={`${
                  assessmentActionModal.modalTitle != "Save" ? "Add" : "Ok"
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
              {allOutlines && (
                <SaveUI
                  listMenu={menulists}
                  position="bottom-right"
                  iconColor="#8998BA"
                  toggleModal={showModal}
                />
              )}
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
                .assessmentWidgetHolder {
                  padding: 10px 0;
                }
                .assessmentWidgetHolder
                  .assessmentWithValue
                  .ant-select-selection-placeholder {
                  opacity: 1 !important;
                  color: #000000 !important;
                }
                .assessmentWithValue .ant-input::placeholder {
                  opacity: 1 !important;
                  color: #000000 !important;
                }
                .assessmentWithValue .ant-picker-input input::placeholder,
                .assessmentWithValue .ant-input-number input::placeholder {
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

export default CourseAssessments;
