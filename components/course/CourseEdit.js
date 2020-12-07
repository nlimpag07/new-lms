import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import SaveUI from "../theme-layout/course-circular-ui/save-circle-ui";
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
import CourseDateFormat from "./course-date-format/CourseDateFormat"
import Error from "next/error";

import { useRouter } from "next/router";
import { useCourseList } from "../../providers/CourseProvider";

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
    iconClass:"ams-floppy-disk",
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

const CourseEdit = ({ course_id }) => {
  const router = useRouter();
  const { courseAllList, setCourseAllList } = useCourseList();

  //const courseId = router.query.manage[1];
  //console.log(props);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [course, setCourse] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [dataProcessModal, setDataProcessModal] = useState({
    isvisible: false,
    title: "",
    content: "",
  });
  const [constDefaultValues, setconstDefaultValues] = useState({
    relatedcourses: [],
    courselevel: [],
    coursecategory: [],
    coursetype: [],
    courselanguage: [],
    coursetag: [],
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
  var [courseActionModal, setCourseActionModal] = useState({
    StateModal: false,
    modalTitle: "",
    modalFormName: "",
    modalBodyContent: "",
  });

  useEffect(() => {
    let theCourse = courseAllList.result.filter(
      (getCourse) => getCourse.id == course_id
    );
    setCourse(theCourse);

    /* let allCourse = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourse.result.filter(
      (getCourse) => getCourse.id == course_id
    );
    //setCourse(allCourse.filter((getCourse) => getCourse.id == course_id));
    if (theCourse.length) {
      //console.log("In Course: ", theCourse);
      setCourse(theCourse);
    } else {
      var config = {
        method: "get",
        url: apiBaseUrl + "/courses/" + course_id,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      async function fetchData(config) {
        const response = await axios(config);
        if (response) {          
          setCourse(response.data.result);
        } else {          
        }
      }
      fetchData(config);
    } */
  }, [course_id]);

  useEffect(() => {
    setdefaultWidgetValues(defaultWidgetValues);
  }, [defaultWidgetValues]);

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
      //console.log(value);
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
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          picklistfeaturedimage: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          featuredimage: values.name,
        });
      }
      //setFeatureMedia({ image: values.name });
      //console.log("Edit Course fileList ",value);
    }
    if (name === "picklistfeaturedvideo") {
      var value = values.name ? values : "";
      if (value) {
        basicForm.setFieldsValue({
          picklistfeaturedvideo: [values.name],
        });
        setdefaultWidgetValues({
          ...defaultWidgetValues,
          featuredvideo: values.name,
        });
      }
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

    //Edit picklistlevel
    if (values.picklistlevel) {
      //Array for Level Addition
      var processPickListLevel;
      processPickListLevel = values.picklistlevel.map(
        (submittedlevel, index) => {
          let prevLevel = constDefaultValues.courselevel.filter(
            (previouslevel) => {
              let theItem = "";
              if (submittedlevel.levelId == previouslevel.levelId) {
                theItem = previouslevel;
              }
              return theItem;
            }
          );
          let newLevels = {
            id: prevLevel.length ? prevLevel[0].id : 0,
            title: submittedlevel.title,
            levelId: submittedlevel.levelId,
            isticked: submittedlevel.isticked,
          };
          return newLevels;
        }
      );
      //console.log("SubmittedLevels: ", processPickListLevel);
      processPickListLevel.map((level, index) => {
        data.append(`courseLevel[${index}][id]`, level.id);
        data.append(`courseLevel[${index}][levelId]`, level.levelId);
      });

      //Array for Level deletion
      var tobedeleted = [];
      constDefaultValues.courselevel.map((constantlevel, index) => {
        let newlevel = processPickListLevel.filter((latest) => {
          let theItem = "";
          if (constantlevel.levelId == latest.levelId) {
            theItem = latest;
          }
          return theItem;
        });

        if (!newlevel.length) {
          let delLevel = {
            id: constantlevel.id,
            title: constantlevel.title,
            levelId: constantlevel.levelId,
            isticked: false,
          };
          tobedeleted.push(delLevel);
        }
      });
      //console.log("======================");
      //console.log("tobedeletedLevels: ", tobedeleted);
      tobedeleted.map((level, index) => {
        data.append(`deleteCourseLevel[${index}][id]`, level.id);
        data.append(`deleteCourseLevel[${index}][levelId]`, level.levelId);
      });
    }

    //Edit picklistcategory
    if (values.picklistcategory) {
      //Array for Addition
      var processPickListCategory;
      processPickListCategory = values.picklistcategory.map(
        (submittedCat, index) => {
          let prevCat = constDefaultValues.coursecategory.filter(
            (previousCat) => {
              let theItem = "";
              if (submittedCat.categoryId == previousCat.categoryId) {
                theItem = previousCat;
              }
              return theItem;
            }
          );
          let newCats = {
            id: prevCat.length ? prevCat[0].id : 0,
            title: submittedCat.title,
            categoryId: submittedCat.categoryId,
            isticked: submittedCat.isticked,
          };
          return newCats;
        }
      );
      //console.log("SubmittedCats: ", processPickListCategory);
      processPickListCategory.map((cat, index) => {
        data.append(`courseCategory[${index}][id]`, cat.id);
        data.append(`courseCategory[${index}][categoryId]`, cat.categoryId);
      });

      //Array for deletion
      var tobedeleted = [];
      constDefaultValues.coursecategory.map((constantcat, index) => {
        let newCat = processPickListCategory.filter((latest) => {
          let theItem = "";
          if (constantcat.categoryId == latest.categoryId) {
            theItem = latest;
          }
          return theItem;
        });

        if (!newCat.length) {
          let delCat = {
            id: constantcat.id,
            title: constantcat.title,
            categoryId: constantcat.categoryId,
            isticked: false,
          };
          tobedeleted.push(delCat);
        }
      });
      //console.log("======================");
      //console.log("tobedeletedCategories: ", tobedeleted);
      tobedeleted.map((cat, index) => {
        data.append(`deleteCourseCategory[${index}][id]`, cat.id);
        data.append(
          `deleteCourseCategory[${index}][categoryId]`,
          cat.categoryId
        );
      });
    }

    //Edit picklisttype
    if (values.picklisttype) {
      //Array for Addition
      var processPickListType;
      processPickListType = values.picklisttype.map((submittedType, index) => {
        let prevType = constDefaultValues.coursetype.filter((previousType) => {
          let theItem = "";
          if (submittedType.courseTypeId == previousType.courseTypeId) {
            theItem = previousType;
          }
          return theItem;
        });
        let newTypes = {
          id: prevType.length ? prevType[0].id : 0,
          title: submittedType.title,
          courseTypeId: submittedType.courseTypeId,
          isticked: submittedType.isticked,
        };
        return newTypes;
      });
      //console.log("SubmittedTypes: ", processPickListType);
      processPickListType.map((typ, index) => {
        data.append(`courseType[${index}][id]`, typ.id);
        data.append(`courseType[${index}][courseTypeId]`, typ.courseTypeId);
      });

      //Array for deletion
      var tobedeleted = [];
      constDefaultValues.coursetype.map((constanttype, index) => {
        let newTyp = processPickListType.filter((latest) => {
          let theItem = "";
          if (constanttype.courseTypeId == latest.courseTypeId) {
            theItem = latest;
          }
          return theItem;
        });

        if (!newTyp.length) {
          let delTyp = {
            id: constanttype.id,
            title: constanttype.title,
            courseTypeId: constanttype.courseTypeId,
            isticked: false,
          };
          tobedeleted.push(delTyp);
        }
      });
      //console.log("======================");
      //console.log("tobedeletedTypes: ", tobedeleted);
      tobedeleted.map((typ, index) => {
        data.append(`deleteCourseType[${index}][id]`, typ.id);
        data.append(
          `deleteCourseType[${index}][courseTypeId]`,
          typ.courseTypeId
        );
      });
    }

    //Edit picklistrelatedcourses
    if (values.picklistrelatedcourses) {
      //Array for Addition
      var processPickListRelatedCourses;
      processPickListRelatedCourses = values.picklistrelatedcourses.map(
        (submittedRelatedCourses, index) => {
          let prevCourse = constDefaultValues.relatedcourses.filter(
            (previousCourse) => {
              let theItem = "";
              if (
                submittedRelatedCourses.courseRelatedId ==
                previousCourse.courseRelatedId
              ) {
                theItem = previousCourse;
              }
              return theItem;
            }
          );
          let newCourses = {
            id: prevCourse.length ? prevCourse[0].id : 0,
            title: submittedRelatedCourses.title,
            courseRelatedId: submittedRelatedCourses.courseRelatedId,
            isticked: submittedRelatedCourses.isticked,
            isreq: submittedRelatedCourses.isreq,
          };
          return newCourses;
        }
      );
      //console.log("SubmittedRelatedCourse: ", processPickListRelatedCourses);
      processPickListRelatedCourses.map((related, index) => {
        data.append(`relatedCourse[${index}][id]`, related.id);
        data.append(
          `relatedCourse[${index}][relatedCourseId]`,
          related.courseRelatedId
        );
        data.append(`relatedCourse[${index}][isPrerequisite]`, related.isreq);
      });

      //Array for deletion
      var tobedeleted = [];
      constDefaultValues.relatedcourses.map((constantrelated, index) => {
        let newRelated = processPickListRelatedCourses.filter((latest) => {
          let theItem = "";
          if (constantrelated.courseRelatedId == latest.courseRelatedId) {
            theItem = latest;
          }
          return theItem;
        });

        if (!newRelated.length) {
          let delRel = {
            id: constantrelated.id,
            title: constantrelated.title,
            courseRelatedId: constantrelated.courseRelatedId,
            isticked: false,
            isreq: constantrelated.isreq,
          };
          tobedeleted.push(delRel);
        }
      });
      //console.log("======================");
      //console.log("tobedeletedRelatedCourses: ", tobedeleted);
      tobedeleted.map((related, index) => {
        data.append(`deleteRelatedCourse[${index}][id]`, related.id);
        data.append(
          `deleteRelatedCourse[${index}][courseRelatedId]`,
          related.courseRelatedId
        );
      });
    }

    //Edit picklistlanguage
    if (values.picklistlanguage) {
      //Array for Addition
      var processPickListLanguage;
      processPickListLanguage = values.picklistlanguage.map(
        (submittedLang, index) => {
          let prevLang = constDefaultValues.courselanguage.filter(
            (previousLanguage) => {
              let theItem = "";
              if (submittedLang.languageId == previousLanguage.languageId) {
                theItem = previousLanguage;
              }
              return theItem;
            }
          );
          let newLanguages = {
            id: prevLang.length ? prevLang[0].id : 0,
            title: submittedLang.title,
            languageId: submittedLang.languageId,
            isticked: submittedLang.isticked,
          };
          return newLanguages;
        }
      );
      //console.log("submittedLang: ", processPickListLanguage);
      processPickListLanguage.map((lang, index) => {
        data.append(`courseLanguage[${index}][id]`, lang.id);
        data.append(`courseLanguage[${index}][languageId]`, lang.languageId);
      });

      //Array for deletion
      var tobedeleted = [];
      constDefaultValues.courselanguage.map((constantlang, index) => {
        let newLang = processPickListLanguage.filter((latest) => {
          let theItem = "";
          if (constantlang.languageId == latest.languageId) {
            theItem = latest;
          }
          return theItem;
        });

        if (!newLang.length) {
          let delLang = {
            id: constantlang.id,
            title: constantlang.title,
            languageId: constantlang.languageId,
            isticked: false,
          };
          tobedeleted.push(delLang);
        }
      });
      //console.log("======================");
      //console.log("tobedeletedLanguages: ", tobedeleted);
      tobedeleted.map((lang, index) => {
        data.append(`deleteCourseLanguage[${index}][id]`, lang.id);
        data.append(
          `deleteCourseLanguage[${index}][languageId]`,
          lang.languageId
        );
      });
    }

    //Edit picklistTags
    if (values.picklisttags) {
      //Array for Addition
      var processPickListTags;
      processPickListTags = values.picklisttags.map((submittedTag, index) => {
        let prevTag = constDefaultValues.coursetag.filter((previousTag) => {
          let theItem = "";
          if (submittedTag.tagId == previousTag.tagId) {
            theItem = previousTag;
          }
          return theItem;
        });
        let newTags = {
          id: prevTag.length ? prevTag[0].id : 0,
          title: submittedTag.title,
          tagId: submittedTag.tagId,
          isticked: submittedTag.isticked,
        };
        return newTags;
      });
      //console.log("submittedTag: ", processPickListTags);
      processPickListTags.map((tag, index) => {
        data.append(`courseTag[${index}][id]`, tag.id);
        data.append(`courseTag[${index}][tagId]`, tag.tagId);
      });

      //Array for deletion
      var tobedeleted = [];
      constDefaultValues.coursetag.map((constanttag, index) => {
        let newTag = processPickListTags.filter((latest) => {
          let theItem = "";
          if (constanttag.tagId == latest.tagId) {
            theItem = latest;
          }
          return theItem;
        });

        if (!newTag.length) {
          let delTag = {
            id: constanttag.id,
            title: constanttag.title,
            tagId: constanttag.tagId,
            isticked: false,
          };
          tobedeleted.push(delTag);
        }
      });
      //console.log("======================");
      //console.log("tobedeletedTags: ", tobedeleted);
      tobedeleted.map((tag, index) => {
        data.append(`deleteCourseTag[${index}][id]`, tag.id);
        data.append(`deleteCourseTag[${index}][tagId]`, tag.tagId);
      });
    }

    !!values.durationTime
      ? data.append("durationTime", values.durationTime)
      : "";
    !!values.durationType
      ? data.append("durationType", values.durationType)
      : "";
    !!values.passingGrade
      ? data.append("passingGrade", values.passingGrade)
      : "";
    !!values.capacity ? data.append("capacity", values.capacity) : "";

    !!values.picklistfeaturedimage && values.picklistfeaturedimage.length
      ? values.picklistfeaturedimage.map((image, index) => {
          data.append(`featureImage`, image.fileList[0].originFileObj);
        })
      : "";
    !!values.picklistfeaturedvideo && values.picklistfeaturedvideo.length
      ? values.picklistfeaturedvideo.map((video, index) => {
          data.append(`featureVideo`, video.fileList[0].originFileObj);
        })
      : "";

    if (errorList.length) {
      console.log("ERRORS: ", errorList);
      onFinishModal(errorList);
    } else {
      //console.log("NO ERROR, PROCEED WITH SUBMISSION");
      var config = {
        method: "put",
        url: apiBaseUrl + "/courses/" + course_id,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          console.log("res: ", res.data);
          onFinishModal("", res.data, course_id);
        })
        .catch((err) => {
          console.log("err: ", err.response.data);
          errorList.push(err.response.data.message);
          onFinishModal(errorList, "", course_id);
        });
    }
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
          router.push(
            `/${linkUrl}/[course]/[...manage]`,
            `/${linkUrl}/course/edit/${course_id}`
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

  let {
    id,
    featureImage,
    featureVideo,
    courseLanguage,
    courseCategory,
    title,
    description,
    courseInstructor,
    courseOutline,
    courseType,
    courseLevel,
    courseTag,
    relatedCourse,
    durationTime,
    durationType,
    capacity,
    passingGrade,
    updatedAt,
  } = course[0] || "";
  console.log(course[0]);
  useEffect(() => {
    //setdefaultWidgetValues(defaultWidgetValues);
    let {
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
      /* console.log("============");*/
      console.log("Related Course:", relatedCourse);
      relateds = relatedCourse.map((c_related, index) => {
        let list = {
          id: c_related.id,
          title: c_related.courseRelated.course.title,
          isreq: c_related.isPrerequisite,
          courseRelatedId: c_related.courseRelated.courseId,
          //relcourseId:c_related.courseRelated.courseId,
          isticked: true,
        };
        return list;
      });
    }
    if (courseCategory) {
      categories = courseCategory.map((c_category, index) => {
        let list = {
          id: c_category.category.id,
          title: c_category.category.name,
          categoryId: c_category.categoryId,
          isticked: true,
        };
        return list;
      });
    }
    if (courseLevel) {
      //console.log("level",courseLevel);
      levels = courseLevel.map((c_level, index) => {
        let list = {
          id: c_level.id,
          levelId: c_level.levelId,
          title: c_level.level.name,
          isticked: true,
        };
        return list;
      });
    }
    if (courseType) {
      //console.log(courseType);
      types = courseType.map((c_type, index) => {
        let list = {
          id: c_type.courseType.id,
          title: c_type.courseType.name,
          courseTypeId: c_type.courseTypeId,
          isticked: true,
        };
        return list;
      });
    }
    if (courseLanguage) {
      //console.log(courseLanguage);
      languages = courseLanguage.map((c_language, index) => {
        let list = {
          id: c_language.language.id,
          title: c_language.language.name,
          languageId: c_language.languageId,
          isticked: true,
        };
        return list;
      });
    }
    if (courseTag) {
      //console.log(courseTag)
      tags = courseTag.map((c_tag, index) => {
        let list = {
          id: c_tag.tag.id,
          title: c_tag.tag.name,
          tagId: c_tag.tagId,
          isticked: true,
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
    setconstDefaultValues({
      ...constDefaultValues,
      courselevel: levels,
      coursecategory: categories,
      coursetype: types,
      courselanguage: languages,
      coursetag: tags,
      relatedcourses: relateds,
    });
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
    });
  }, [course]);

  const formInitialValues = {
    initialValues: {
      title: title,
      description: decodeURI(description),
      durationTime: durationTime,
      durationType: durationType,
      capacity: capacity,
      passingGrade: passingGrade,
    },
  };
  
  
  /* console.log("Const Default Values ", constDefaultValues.courselevel);
  console.log("=========================================");
  console.log("Widget Values ", defaultWidgetValues.courselevel); */

  return (
    <motion.div initial="hidden" animate="visible" variants={framerEffect}>
      {course ? (
        <Form.Provider onFormFinish={onFormFinishProcess}>
          <Form
            {...formItemLayout}
            style={{ width: "100%" }}
            name="basicForm"
            hideRequiredMark={true}
            onFinish={onFinish}
            validateMessages={validateMessages}
            {...formInitialValues}
            /* initialValues={{
              residence: ['zhejiang', 'hangzhou', 'xihu'],
              prefix: '86',
              email:'noellimpag@yahoo.com',
            }} */
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
                    <h3 className="widget-title">Edit Course</h3>
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
                      /* rules={[
                        {
                          required: true,
                        },
                      ]} */
                    >
                      <Input placeholder={`${title}`} allowClear />
                    </Form.Item>

                    <Form.Item label="Course Description" name="description">
                      <TextArea
                        rows={10}
                        placeholder={`${decodeURI(description)}`}
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
                    <CourseDateFormat updatedAt={updatedAt} course_id={course_id} />
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
                      <Panel
                        header="CATEGORY"
                        key="2"
                        className="greyBackground"
                      >
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
                      <Panel
                        header="DURATION"
                        key="5"
                        className="greyBackground"
                      >
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
                      <Panel
                        header="LANGUAGE"
                        key="6"
                        className="greyBackground"
                      >
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
              <SaveUI
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
        </Form.Provider>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>Data Not Found</span>}
          className="emptyData"
        />
      )}
    </motion.div>
  );
};

export default CourseEdit;
