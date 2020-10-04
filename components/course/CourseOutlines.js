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
import CourseOutlineDetails from "./course-outline-widgets/CourseOutlineDetails";
import CourseOutlineFeaturedImage from "./course-outline-widgets/CourseOutlineFeaturedImage";
import CourseOutlineFeaturedVideo from "./course-outline-widgets/CourseOutlineFeaturedVideo";
import CourseOutlinePrerequisite from "./course-outline-widgets/CourseOutlinePrerequisite";
import CourseOutlineMediaFiles from "./course-outline-widgets/CourseOutlineMediaFiles";
import CourseOutlineMilestones from "./course-outline-widgets/CourseOutlineMilestones";
import CourseOutlineDuration from "./course-outline-widgets/CourseOutlineDuration";

import CourseWidgetLevel from "./course-general-widgets/CourseWidgetLevel";
import CourseWidgetCategory from "./course-general-widgets/CourseWidgetCategory";
import CourseWidgetType from "./course-general-widgets/CourseWidgetType";
import CourseWidgetRelatedCourses from "./course-general-widgets/CourseWidgetRelatedCourses";
import CourseWidgetDuration from "./course-general-widgets/CourseWidgetDuration";
import CourseWidgetLanguage from "./course-general-widgets/CourseWidgetLanguage";
import CourseWidgetTags from "./course-general-widgets/CourseWidgetTags";
import CourseWidgetFeaturedImage from "./course-general-widgets/CourseWidgetFeaturedImage";
import CourseWidgetFeaturedVideo from "./course-general-widgets/CourseWidgetFeaturedVideo";
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
        modalFormName === "outlineprerequisite" && form.resetFields();
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

const CourseOutlines = ({ course_id }) => {
  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [outlineList, setOutlineList] = useState("");
  const [outline, setOutline] = useState("");
  const [curOutlineId, setcurOutlineId] = useState("");

  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    outlinedetails: [],
    outlineprerequisite: [],
    outlinemediafiles: [],
    outlinefeaturedimage: [],
    outlinefeaturedvideo: [],
    outlineduration: [],
    outlinemilestones: [],
  });
  var [outlineActionModal, setOutlineActionModal] = useState({
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
  }, [loading]);

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

  const onFormFinishProcess = (name, { values, forms }) => {
    const { basicForm } = forms;
    const picklistFields = basicForm.getFieldValue(name) || [];

    if (name === "outlineprerequisite") {
      var value = values.outlineprerequisite
        ? values.outlineprerequisite.map((related, index) => related)
        : "";
      basicForm.setFieldsValue({
        outlineprerequisite: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outlineprerequisite: [...value],
      });
      /* console.log('combined value', [...picklistFields, ...value]);
      console.log('======================='); */
    }
    if (name === "picklistduration") {
      basicForm.setFieldsValue({
        picklistduration: [...picklistFields, values],
      });
    }

    if (name === "outlinefeaturedimage") {
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          outlinefeaturedimage: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          outlinefeaturedimage: values.name,
        });
      }
      //setFeatureMedia({ image: values.name });
      console.log("Course Outline Featured Image: ", value);
    }
    if (name === "outlinefeaturedvideo") {
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          outlinefeaturedvideo: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          outlinefeaturedvideo: values.name,
        });
      }
      //console.log("Uploaded Video: ", value);
    }
    /* if (name === "outlinemediafiles") {
      var value = values.outlinemediafiles
        ? values.outlinemediafiles.fileList.map((mediafile, index) => mediafile)
        : "";
      basicForm.setFieldsValue({
        outlinemediafiles: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outlinemediafiles: [...value],
      });
      console.log('Media Files: ',values);
    } */
    if (name === "outlinemediafiles") {
      var value = values.outlinemedia ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          outlinemediafiles: [values.outlinemedia],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          outlinemediafiles: values.outlinemedia,
        });
      }
      console.log("Course Outline Media File: ", value);
    }

    if (name === "outlinemilestones") {
      var value = values.outlinemilestones
        ? values.outlinemilestones.fileList.map((mediafile, index) => mediafile)
        : "";
      basicForm.setFieldsValue({
        outlinemilestones: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outlinemilestones: [...value],
      });
      //console.log('Media Files: ',value);
    }

    if (name === "outlineduration") {
      basicForm.setFieldsValue({
        outlineduration: [...picklistFields, values],
      });
    }

    setOutlineActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
  };

  const onFinish = (values) => {
    setOutlineActionModal({
      StateModal: false,
      modalTitle: "",
      modalFormName: "",
      modalBodyContent: "",
    });
    setSpinner(true);

    console.log("Finish:", values);

    let curOutlineIdExist =
      curOutlineId && curOutlineId.length ? curOutlineId[0].id : "";
    let curOutlineTitle =
      curOutlineId && curOutlineId.length ? curOutlineId[0].title : "";
    let curOutlineuserGroupId =
      curOutlineId && curOutlineId.length ? curOutlineId[0].userGroupId : "";
    //console.log("Current Outline: ", curOutlineuserGroupId);
    var data = new FormData();
    var errorList = [];
    if (curOutlineIdExist) {
      //Edit Course Outline
      //console.log("HELLLOOOOO Outline ID", curOutlineIdExist);
      //NLI: Extended Form Values Processing & Filtration
      var isNotAllEmpty = [];
      data.append("courseId", course_id);
      if (!!values.outlinedetails && values.outlinedetails.length) {
        if (!!values.outlinedetails[0].outlinetitle) {
          data.append("title", values.outlinedetails[0].outlinetitle);
          isNotAllEmpty.push("Not Empty");
        } else {
          data.append("title", curOutlineTitle);
        }
        if (!!values.outlinedetails[0].description) {
          data.append("description", values.outlinedetails[0].description);
          isNotAllEmpty.push("Not Empty");
        }
        if (!!values.outlinedetails[0].visibility) {
          data.append("visibility", values.outlinedetails[0].visibility);
          isNotAllEmpty.push("Not Empty");
        }
        if (!!values.outlinedetails[0].usergroup) {
          data.append("userGroupId", values.outlinedetails[0].usergroup);
          isNotAllEmpty.push("Not Empty");
        } else {
          data.append("userGroupId", curOutlineuserGroupId);
        }
        //isNotAllEmpty.push("Not Empty");
      }
      if (!!values.outlinefeaturedimage && values.outlinefeaturedimage.length) {
        values.outlinefeaturedimage.map((image, index) => {
          data.append(`featureImage`, image.fileList[0].originFileObj);
        });
        isNotAllEmpty.push("Not Empty");
      }
      if (values.outlinefeaturedvideo && values.outlinefeaturedvideo.length) {
        values.outlinefeaturedvideo.map((video, index) => {
          //console.log("Video:", video);
          data.append(`interactiveVideo`, video.fileList[0].originFileObj);
        });
        isNotAllEmpty.push("Not Empty");
      }
      if (values.outlineprerequisite && values.outlineprerequisite.length) {
        values.outlineprerequisite.map((outlineprereq, index) => {
          data.append(
            `CourseOutlinePrerequisite[${index}][preRequisiteId]`,
            outlineprereq.id
          );
        });
        isNotAllEmpty.push("Not Empty");
      }

      if (!!values.outlinemediafiles && values.outlinemediafiles.length) {
        values.outlinemediafiles.map((media) => {
          media.fileList.map((listOfFiles, index) => {
            data.append(`CourseOutlineMediaFile`, listOfFiles.originFileObj);
          });
        });
        isNotAllEmpty.push("Not Empty");
      }

      if (!!values.outlineduration) {
        data.append("duration", values.outlineduration);
        isNotAllEmpty.push("Not Empty");
      }

      //data = JSON.stringify(data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        console.log("IsNotAllEmpty", isNotAllEmpty);
        if (isNotAllEmpty.length) {
          var config = {
            method: "put",
            url: apiBaseUrl + `/CourseOutline/` + curOutlineIdExist,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: data,
          };

          axios(config)
            .then((res) => {
              console.log("res: ", res.data, curOutlineIdExist);
              onFinishModal("", res.data, curOutlineIdExist);
            })
            .catch((err) => {
              //console.log("err: ", err.response.data);
              errorList.push(err.response.data.message);
              onFinishModal(errorList, "", curOutlineIdExist);
            });
        } else {
          errorList.push("No Update has been made");
          onFinishModal(errorList);
        }
      }
    } else {
      //Add Course Outline
      console.log("Empty Baby", course_id);
      //NLI: Extended Form Values Processing & Filtration
      data.append("courseId", course_id);
      if (!!values.outlinedetails) {
        !!values.outlinedetails.outlinetitle
          ? data.append("title", values.outlinedetails.outlinetitle)
          : errorList.push("Missing Outline Title");

        !!values.outlinedetails.outlinedescription
          ? data.append("description", values.outlinedetails.outlinedescription)
          : errorList.push("Missing Outline Description");

        !!values.outlinedetails.visibility
          ? data.append("visibility", values.outlinedetails.visibility)
          : errorList.push("Missing Outline Visibility");

        !!values.outlinedetails.usergroup
          ? data.append("userGroupId", values.outlinedetails.usergroup)
          : errorList.push("Missing Outline User Group");

        !!values.outlinefeaturedimage && values.outlinefeaturedimage.length
          ? values.outlinefeaturedimage.map((image, index) => {
              data.append(`featureImage`, image.fileList[0].originFileObj);
            })
          : errorList.push("Missing Outline Image");
        values.outlinefeaturedvideo &&
          values.outlinefeaturedvideo.length &&
          values.outlinefeaturedvideo.map((video, index) => {
            console.log("Video:", video);
            data.append(`interactiveVideo`, video.fileList[0].originFileObj);
          });
      } else {
        errorList.push("Missing Outline Details");
      }
      values.outlineprerequisite &&
        values.outlineprerequisite.length &&
        values.outlineprerequisite.map((outlineprereq, index) => {
          data.append(
            `CourseOutlinePrerequisite[${index}][preRequisiteId]`,
            outlineprereq.id
          );
        });

      /* !!values.outlinemediafiles && values.outlinemediafiles.length
        ? values.outlinemediafiles.map((outlinemediafile, index) => {
            //console.log(outlinemediafile.originFileObj)
            data.append(
              `CourseOutlineMediaFile[${index}]`,
              outlinemediafile.originFileObj
            );
          })
        : errorList.push("Missing Outline Media File"); */
      !!values.outlinemediafiles && values.outlinemediafiles.length
        ? values.outlinemediafiles.map((media) => {
            //console.log(media)
            media.fileList.map((listOfFiles, index) => {
              //console.log('list of fileList',listOfFiles);
              data.append(`CourseOutlineMediaFile`, listOfFiles.originFileObj);
            });
            //data.append(`CourseOutlineMediaFile[${index}]`, media.fileList[0].originFileObj);
          })
        : errorList.push("Missing Outline Media File");

      !!values.outlineduration
        ? data.append("duration", values.outlineduration)
        : errorList.push("Missing Outline Duration");

      //data = JSON.stringify(data);
      if (errorList.length) {
        console.log("ERRORS: ", errorList);
        onFinishModal(errorList);
      } else {
        //console.log("NO ERROR, PROCEED WITH SUBMISSION");
        var config = {
          method: "post",
          url: apiBaseUrl + "/CourseOutline",
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
    } //End of else curOutlineIdExist
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
            `/${linkUrl}/course/edit/${course_id}/course-outline`
          ); */
          setdefaultWidgetValues({
            outlinedetails: [],
            outlineprerequisite: [],
            outlinemediafiles: [],
            outlinefeaturedimage: [],
            outlinefeaturedvideo: [],
            outlineduration: [],
            outlinemilestones: [],
          });
          setcurOutlineId("");
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
  // console.log(curOutlineId)
  /*console.log(outlineList)  */
  /* let {
    id,
    courseOutlineMedia,
    courseOutlineMilestone,
    courseOutlinePrerequisite,
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
      courseOutlineMedia,
      courseOutlineMilestone,
      courseOutlinePrerequisite,
      description,
      duration,
      featureImage,
      interactiveVideo,
      title,
      userGroupId,
      visibility,
    } = "";
    if (curOutlineId.length) {
      console.log(outline);
      let isSelected = outlineList.filter(
        (selectedOutline) => selectedOutline.id === curOutlineId[0].id
      );
      console.log(isSelected[0]);
      let prerequisite = [];
      let currentPrerequisite = isSelected[0].courseOutlinePrerequisite;
      if (currentPrerequisite.length) {
        prerequisite = currentPrerequisite.map((c_outlinerequisite, index) => {
          let getOutline = outlineList.filter(
            (outline) => c_outlinerequisite.preRequisiteId == outline.id
          );
          console.log(getOutline);
          let list;
          if (getOutline.length) {
             list = {
              id: c_outlinerequisite.id,
              title: getOutline[0].title,
              courseOutlineId: c_outlinerequisite.courseOutlineId,
              preRequisiteId: c_outlinerequisite.preRequisiteId,
              isticked: true,
            };
          }

          return list;
        });
      }
      let mediaFiles = [];
      let currentMediaFiles = isSelected[0].courseOutlineMedia;
      if (currentMediaFiles.length) {
        mediaFiles = currentMediaFiles.map((c_outlinemediafiles, index) => {
          let list = {
            id: c_outlinemediafiles.id,
            name: c_outlinemediafiles.fileName,
            courseOutlineId: c_outlinemediafiles.courseOutlineId,
            resourceFile: c_outlinemediafiles.resourceFile,
            isticked: true,
          };
          return list;
        });
      }
      let mileStones = [];
      let currentMileStones = isSelected[0].courseOutlineMilestone;
      if (currentMileStones.length) {
        mileStones = currentMileStones.map((c_outlinemilestones, index) => {
          let list = {
            id: c_outlinemilestones.id,
            name: c_outlinemilestones.name,
            courseOutlineId: c_outlinemilestones.courseOutlineId,
            lessonCompleted: c_outlinemilestones.lessonCompleted,
            resourceFile: c_outlinemilestones.resourceFile,
            isticked: true,
          };
          return list;
        });
      }

      //console.log(outlineItem)
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outlinedetails: [
          {
            title: isSelected[0].title,
            description: isSelected[0].description,
            usergroup: isSelected[0].userGroup.name,
            usergroupid: isSelected[0].userGroupId,
            visibility: isSelected[0].visibility,
          },
        ],
        outlinefeaturedimage: isSelected[0].featureImage,
        outlinefeaturedvideo: isSelected[0].featureVideo,
        outlineprerequisite: prerequisite,
        outlineduration: isSelected[0].duration,
        outlinemediafiles: mediaFiles,
        outlinemilestones: mileStones,
      });
    } else {
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outlinedetails: [],
        outlinefeaturedimage: "",
        outlinefeaturedvideo: "",
        outlineduration: "",
        outlineprerequisite: [],
        outlinemediafiles: [],
        outlinemilestones: [],

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
  }, [curOutlineId]);
  /* console.log(defaultWidgetValues)
  console.log(outline) */
  const formInitialValues = {
    /* initialValues: {
      outlinetitle: title,
      outlinedescription: decodeURI(description),
      outlineduration: duration,     
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
                <CourseOutlineList
                  outlineList={outlineList}
                  setOutlineList={setOutlineList}
                  curOutlineId={curOutlineId}
                  setcurOutlineId={setcurOutlineId}
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
                      <div className="outlineWidgetHolder">
                        <CourseOutlineDetails
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outlinedetails !==
                            curValues.outlinedetails
                          }
                          showModal={showModal}
                          outline={outline}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                        />
                        <CourseOutlineFeaturedImage
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outlinefeaturedimage !==
                            curValues.outlinefeaturedimage
                          }
                          showModal={showModal}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                        />
                        <CourseOutlineFeaturedVideo
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outlinefeaturedvideo !==
                            curValues.outlinefeaturedvideo
                          }
                          showModal={showModal}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                        />
                      </div>
                    </Panel>
                    <Panel
                      header="Prerequisite"
                      key="2"
                      className="greyBackground"
                    >
                      <div className="outlineWidgetHolder">
                        <CourseOutlinePrerequisite
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outlineprerequisite !==
                            curValues.outlineprerequisite
                          }
                          showModal={showModal}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                          outlineList={outlineList}
                        />
                      </div>
                    </Panel>
                    <Panel
                      header="Media Files"
                      key="3"
                      className="greyBackground"
                    >
                      <div className="outlineWidgetHolder">
                        <CourseOutlineMediaFiles
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outlinemediafiles !==
                            curValues.outlinemediafiles
                          }
                          showModal={showModal}
                          defaultWidgetValues={defaultWidgetValues}
                          setdefaultWidgetValues={setdefaultWidgetValues}
                        />
                      </div>
                    </Panel>
                    {/* <Panel header="Milestones" key="4" className="greyBackground">
                    <div className="outlineWidgetHolder">
                      <CourseOutlineMilestones
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.outlinemilestones !== curValues.outlinemilestones
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                      </div>
                    </Panel>  */}
                    <Panel header="DURATION" key="5" className="greyBackground">
                      <div className="outlineWidgetHolder">
                        <CourseOutlineDuration
                          shouldUpdate={(prevValues, curValues) =>
                            prevValues.outlineduration !==
                            curValues.outlineduration
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
            title={outlineActionModal.modalTitle}
            modalFormName={outlineActionModal.modalFormName}
            modalBodyContent={outlineActionModal.modalBodyContent}
            visible={outlineActionModal.StateModal}
            onCancel={hideModal}
            okText={`${outlineActionModal.modalTitle != "Save" ? "Add" : "Ok"}`}
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
            .outlineWidgetHolder {
              padding: 10px 0;
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

export default CourseOutlines;
