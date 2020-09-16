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
import CourseOutlineDetails from "./course-outline-widgets/CourseOutlineDetails";
import CourseOutlineFeaturedImage from "./course-outline-widgets/CourseOutlineFeaturedImage";
import CourseOutlineFeaturedVideo from "./course-outline-widgets/CourseOutlineFeaturedVideo";
import CourseOutlinePrerequisite from "./course-outline-widgets/CourseOutlinePrerequisite";
import CourseOutlineMediaFiles from "./course-outline-widgets/CourseOutlineMediaFiles";
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

const CourseEditOutline = ({ course_id }) => {
  const router = useRouter();
  //const courseId = router.query.manage[1];
  //console.log(course_id);
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [outlineList, setOutlineList] = useState("");
  const [outline, setOutline] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [defaultWidgetValues, setdefaultWidgetValues] = useState({
    outlineprerequisite: [],
    courselevel: [],
    coursecategory: [],
    coursetype: [],
    courselanguage: [],
    coursetag: [],
    outlinemediafiles: [],
    outlinefeaturedimage: [],
    outlinefeaturedvideo: [],
    outlineduration: [],
    passinggrade: [],
    capacity: [],
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
      //console.log("Course Outline Featured Image: ",value);
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
      //console.log(values);
    }
    if (name === "outlinemediafiles") {
      var value = values.outlinemediafiles
        ? values.outlinemediafiles.map((mediafile, index) => mediafile)
        : "";
      basicForm.setFieldsValue({
        outlinemediafiles: [...value],
      });
      setdefaultWidgetValues({
        ...defaultWidgetValues,
        outlinemediafiles: [...value],
      });
    }
    if (name === "outlineduration") {
      basicForm.setFieldsValue({
        outlineduration: [...picklistFields, values],
      });
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

    /* var data = new FormData();
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
    !!values.picklistlevel && values.picklistlevel.length
      ? values.picklistlevel.map((level, index) => {
          data.append(`courseLevel[${index}][levelId]`, level.id);
        })
      : errorList.push("Missing Course Level");
    !!values.picklistcategory && values.picklistcategory.length
      ? values.picklistcategory.map((category, index) => {
          data.append(`courseCategory[${index}][categoryId]`, category.id);
        })
      : errorList.push("Missing Course Category");
    !!values.outlineprerequisite && values.outlineprerequisite.length
      ? values.outlineprerequisite.map((relatedcourse, index) => {
          data.append(
            `relatedCourse[${index}][relatedCourseId]`,
            relatedcourse.course_id
          );
          data.append(
            `relatedCourse[${index}][isPrerequisite]`,
            relatedcourse.isreq
          );
        })
      : errorList.push("Missing Related Course");
    !!values.picklistlanguage && values.picklistlanguage.length
      ? values.picklistlanguage.map((language, index) => {
          data.append(`courseLanguage[${index}][languageId]`, language.id);
        })
      : errorList.push("Missing Course Language");
    !!values.picklisttags && values.picklisttags.length
      ? values.picklisttags.map((tag, index) => {
          data.append(`courseTag[${index}][tagId]`, tag.id);
        })
      : errorList.push("Missing Course Tag");
    !!values.picklisttype && values.picklisttype.length
      ? values.picklisttype.map((type, index) => {
          data.append(`courseType[${index}][courseTypeId]`, type.id);
        })
      : errorList.push("Missing Course Type");
    !!values.outlinefeaturedimage && values.outlinefeaturedimage.length
      ? values.outlinefeaturedimage.map((image, index) => {
          data.append(`featureImage`, image.fileList[0].originFileObj);
        })
      : errorList.push("Missing Course Image");
    values.outlinefeaturedvideo &&
      values.outlinefeaturedvideo.length &&
      values.outlinefeaturedvideo.map((video, index) => {
        //console.log(image.fileList[0].originFileObj);
        data.append(`featureVideo`, video.fileList[0].originFileObj);
      });

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
    } */
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
  /* console.log(outline)
  console.log(outlineList)  */ 

  useEffect(() => {
    if(outline.length){
      console.log(outline)
    }
    
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
    if (courseCategory) {
      categories = courseCategory.map((c_category, index) => {
        let list = {
          id: c_category.category.id,
          title: c_category.category.name,
        };
        return list;
      });
    }
    if (courseLevel) {
      levels = courseLevel.map((c_level, index) => {
        let list = { id: c_level.level.id, title: c_level.level.name };
        return list;
      });
    }
    if (courseType) {
      types = courseType.map((c_type, index) => {
        let list = {
          id: c_type.courseType.id,
          title: c_type.courseType.name,
        };
        return list;
      });
    }
    if (courseLanguage) {
      languages = courseLanguage.map((c_language, index) => {
        let list = {
          id: c_language.language.id,
          title: c_language.language.name,
        };
        return list;
      });
    }
    if (courseTag) {
      tags = courseTag.map((c_tag, index) => {
        let list = {
          id: c_tag.tag.id,
          title: c_tag.tag.name,
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
      courselevel: levels,
      coursecategory: categories,
      coursetype: types,
      courselanguage: languages,
      coursetag: tags,
      featuredimage: image,
      featuredvideo: video,
      relatedcourses: relateds,
      duration: [durationtime],
    }); */
  }, [outline]); 
  const formInitialValues = {
    /* initialValues: {
      title: title,
      description: decodeURI(description),
      durationTime: durationTime,
      durationType: durationType,
      capacity: capacity,
      passingGrade: passingGrade,
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
                <CourseOutlineList outlineList={outlineList} outline={outline} setOutline={setOutline} />
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
                            prevValues.picklistlevel !== curValues.picklistlevel
                          }
                          showModal={showModal}
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
                    <Panel header="Milestones" key="4" className="greyBackground">
                    <div className="outlineWidgetHolder">
                      <CourseWidgetType
                        shouldUpdate={(prevValues, curValues) =>
                          prevValues.picklisttype !== curValues.picklisttype
                        }
                        showModal={showModal}
                        defaultWidgetValues={defaultWidgetValues}
                        setdefaultWidgetValues={setdefaultWidgetValues}
                      />
                      </div>
                    </Panel>
                    <Panel
                        header="DURATION"
                        key="5"
                        className="greyBackground"
                      >
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

export default CourseEditOutline;
