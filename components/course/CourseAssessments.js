import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import RadialUI from "../theme-layout/course-circular-ui/radial-ui";
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
/* import CourseAssessmentsFeaturedImage from "./course-assessment-widgets/CourseAssessmentsFeaturedImage";
import CourseAssessmentsFeaturedVideo from "./course-assessment-widgets/CourseAssessmentsFeaturedVideo"; */
import CourseAssessmentsItems from "./course-assessments-widgets/CourseAssessmentsItems";
/* import CourseAssessmentsMediaFiles from "./course-assessment-widgets/CourseAssessmentsMediaFiles";
import CourseAssessmentsMilestones from "./course-assessment-widgets/CourseAssessmentsMilestones";
import CourseAssessmentsDuration from "./course-assessment-widgets/CourseAssessmentsDuration"; */
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
        modalFormName === "assessmentprerequisite" && form.resetFields();
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

const CourseAssessments = ({ course_id }) => {
  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [allOutlines, setAllOutlines] = useState("");
  const [assessmentList, setAssessmentList] = useState("");
  const [curAssessmentId, setcurAssessmentId] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    assessmentdetails: [],
    assessmentitems: [],
    assessmentduration: [],
  });
  var [assessmentActionModal, setAssessmentActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    /* var config = {
      method: "get",
      url: apiBaseUrl + "/CourseAssessment/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }; */

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
        ])
        .then(
          axios.spread((outlineList, allAssessment) => {
            /* console.log("Outline List", outlineList.data);
            console.log("=====================");
            console.log("allAssessment List", allAssessment.data); */

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

    if (name === "assessmentprerequisite") {
      var value = values.assessmentprerequisite
        ? values.assessmentprerequisite.map((related, index) => related)
        : "";
      basicForm.setFieldsValue({
        assessmentprerequisite: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentprerequisite: [...value],
      });
      /* console.log('combined value', [...picklistFields, ...value]);
      console.log('======================='); */
    }
    if (name === "picklistduration") {
      basicForm.setFieldsValue({
        picklistduration: [...picklistFields, values],
      });
    }

    if (name === "assessmentfeaturedimage") {
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          assessmentfeaturedimage: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          assessmentfeaturedimage: values.name,
        });
      }
      //setFeatureMedia({ image: values.name });
      //console.log("Course assessment Featured Image: ", value);
    }
    if (name === "assessmentfeaturedvideo") {
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          assessmentfeaturedvideo: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          assessmentfeaturedvideo: values.name,
        });
      }
      //console.log("Uploaded Video: ", value);
    }
    /* if (name === "assessmentmediafiles") {
      var value = values.assessmentmediafiles
        ? values.assessmentmediafiles.fileList.map((mediafile, index) => mediafile)
        : "";
      basicForm.setFieldsValue({
        assessmentmediafiles: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentmediafiles: [...value],
      });
      console.log('Media Files: ',values);
    } */
    if (name === "assessmentmediafiles") {
      var value = values.assessmentmedia ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          assessmentmediafiles: [values.assessmentmedia],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          assessmentmediafiles: values.assessmentmedia,
        });
      }
      console.log("Course assessment Media File: ", value);
    }

    if (name === "assessmentmilestones") {
      var value = values.assessmentmilestones
        ? values.assessmentmilestones.fileList.map(
            (mediafile, index) => mediafile
          )
        : "";
      basicForm.setFieldsValue({
        assessmentmilestones: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentmilestones: [...value],
      });
      //console.log('Media Files: ',value);
    }

    if (name === "assessmentduration") {
      basicForm.setFieldsValue({
        assessmentduration: [...picklistFields, values],
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
    //console.log("Current assessment: ", curassessmentuserGroupId);
    var data = {};
    var errorList = [];
    if (curAssessmentIdExist) {
      //Edit Course assessment
      //console.log("HELLLOOOOO assessment ID", curAssessmentIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      /* data.append("courseId", course_id);
      if (!!values.assessmentdetails && values.assessmentdetails.length) {
        if (!!values.assessmentdetails[0].assessmenttitle) {
          data.append("title", values.assessmentdetails[0].assessmenttitle);
          isNotAllEmpty.push("Not Empty");
        } else {
          data.append("title", curassessmentTitle);
        }
        if (!!values.assessmentdetails[0].description) {
          data.append("description", values.assessmentdetails[0].description);
          isNotAllEmpty.push("Not Empty");
        }
        if (!!values.assessmentdetails[0].visibility) {
          data.append("visibility", values.assessmentdetails[0].visibility);
          isNotAllEmpty.push("Not Empty");
        }
        if (!!values.assessmentdetails[0].usergroup) {
          data.append("userGroupId", values.assessmentdetails[0].usergroup);
          isNotAllEmpty.push("Not Empty");
        } else {
          data.append("userGroupId", curassessmentuserGroupId);
        }
        //isNotAllEmpty.push("Not Empty");
      }
      if (
        !!values.assessmentfeaturedimage &&
        values.assessmentfeaturedimage.length
      ) {
        values.assessmentfeaturedimage.map((image, index) => {
          data.append(`featureImage`, image.fileList[0].originFileObj);
        });
        isNotAllEmpty.push("Not Empty");
      }
      if (
        values.assessmentfeaturedvideo &&
        values.assessmentfeaturedvideo.length
      ) {
        values.assessmentfeaturedvideo.map((video, index) => {
          //console.log("Video:", video);
          data.append(`interactiveVideo`, video.fileList[0].originFileObj);
        });
        isNotAllEmpty.push("Not Empty");
      }
      if (
        values.assessmentprerequisite &&
        values.assessmentprerequisite.length
      ) {
        values.assessmentprerequisite.map((assessmentprereq, index) => {
          data.append(
            `CourseAssessmentsItems[${index}][preRequisiteId]`,
            assessmentprereq.id
          );
        });
        isNotAllEmpty.push("Not Empty");
      }

      if (!!values.assessmentmediafiles && values.assessmentmediafiles.length) {
        values.assessmentmediafiles.map((media) => {
          media.fileList.map((listOfFiles, index) => {
            data.append(
              `CourseAssessmentsMediaFile`,
              listOfFiles.originFileObj
            );
          });
        });
        isNotAllEmpty.push("Not Empty");
      }

      if (!!values.assessmentduration) {
        data.append("duration", values.assessmentduration);
        isNotAllEmpty.push("Not Empty");
      } */

      //data = JSON.stringify(data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        console.log("IsNotAllEmpty", isNotAllEmpty);
        if (isNotAllEmpty.length) {
          var config = {
            method: "put",
            url: apiBaseUrl + `/CourseAssessments/` + curAssessmentIdExist,
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
      console.log("Empty Baby", course_id);
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
          : errorList.push("Missing assessment Linked Outline");

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

      /* !!values.assessmentduration
        ? data.append("duration", values.assessmentduration)
        : errorList.push("Missing assessment Duration"); */

      data = JSON.stringify(data);
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
            assessmentduration: [],
          });
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

      //console.log(assessmentItem)
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentdetails: [
          {
            title: isSelected[0].title,
            usergroup: isSelected[0].userGroup
              ? isSelected[0].userGroup.name
              : 0,
            usergroupid: isSelected[0].userGroupId,
          },
        ],
        assessmentitems: isSelected[0].courseAssessmentItem,
        assessmentduration: isSelected[0].duration,
      });
    } else {
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        assessmentdetails: [],
        assessmentduration: "",
        assessmentitems: [],

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
    initialValues: {
      assessmentdetails: {
        /* assessmenttitle: "HEY NOEL", 
        userGroup: 1,*/
        isImmediate: true,
        attempts: 0,
      },
      /*assessmentdescription: decodeURI(description),
      assessmentduration: duration,  */
    },
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
                <h3 className="widget-title">Course Assessments</h3>
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
                          />
                        </div>
                      </Panel>
                      <Panel
                        header="Assessment Duration"
                        key="2"
                        className="greyBackground"
                      >
                        <div className="assessmentWidgetHolder">
                          <CourseAssessmentsItems
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.assessmentprerequisite !==
                              curValues.assessmentprerequisite
                            }
                            showModal={showModal}
                            defaultWidgetValues={defaultWidgetValues}
                            setdefaultWidgetValues={setdefaultWidgetValues}
                            assessmentList={assessmentList}
                          />
                        </div>
                      </Panel>
                      <Panel header="Items" key="3" className="greyBackground">
                        <div className="assessmentWidgetHolder">
                          <CourseAssessmentsItems
                            shouldUpdate={(prevValues, curValues) =>
                              prevValues.assessmentprerequisite !==
                              curValues.assessmentprerequisite
                            }
                            showModal={showModal}
                            defaultWidgetValues={defaultWidgetValues}
                            setdefaultWidgetValues={setdefaultWidgetValues}
                            assessmentList={assessmentList}
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
            <RadialUI
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

export default CourseAssessments;
