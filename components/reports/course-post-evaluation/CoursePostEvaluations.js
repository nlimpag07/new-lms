import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Select, Input, Divider, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Cookies from "js-cookie";
import moment from "moment";
import SaveUI from "../../theme-layout/course-circular-ui/save-circle-ui";
import PreassessmentList from "./CoursePostEvaluationsList";
import CoursePostEvaluationsAdd from "./CoursePostEvaluationsAdd";
import CoursePostEvaluationsDetails from "./CoursePostEvaluationsDetails";

const { Search } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const list = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

/*menulists used by radial menu */
const menulists = [
  {
    title: "Add",
    icon: "&#xf055;",
    active: true,
    url: "",
    urlAs: "",
    callback: "Save",
    iconClass: "ams-plus-circle",
  },
];

const CoursePostEvaluations = ({ data }) => {
  console.log("data", data);
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [coursePostEvaluationsModal, setCoursePostEvaluationsModal] = useState({
    visible: false,
    modalOperation: "",
    dataProps: null,
    width: "700px",
  });
  const [PreassessmentDetails, setPreassessmentDetails] = useState("");
  const [spin, setSpin] = useState(true);
  const [runSpin, setRunSpin] = useState(false);
  const [CoursePostEvaluationselect, setCoursePostEvaluationselect] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState("");
  const [allpostEvaluationData, setAllpostEvaluationData] = useState([]);
  const [postEvaluationData, setpostEvaluationData] = useState([]);
  const [page, setPage] = useState({
    currentPage: 0,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
    orderBy: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (runSpin) {
      setSpin(true);
      var config = {
        method: "get",
        url: apiBaseUrl + "/picklist/preassessment",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        //data: { courseId: course_id },
      };
      async function fetchData(config) {
        try {
          const response = await axios(config);
          if (response) {
            let theRes = response.data;
            console.log("Session Response", response.data);
            if (theRes) {
              const {
                currentPage,
                pageSize,
                totalPages,
                totalRecords,
                orderBy,
                result,
              } = theRes;
              setPage({
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                totalRecords: totalRecords,
                orderBy: orderBy,
              });
              setAllpostEvaluationData(result);
              setpostEvaluationData(result);
              setSpin(false);
            } else {
            }
          }
        } catch (error) {
          const { response } = error;
          console.log("Error Response", response);
        }
      }
      fetchData(config);
      setRunSpin(false);
    }
  }, [runSpin]);

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/Picklist/category",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      //data: { courseId: course_id },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          let theRes = response.data;
          console.log("Session Response", response.data);
          if (theRes) {
            setCategories(theRes.result);
          } else {
            setCategories([]);
          }
        }
      } catch (error) {
        const { response } = error;
        console.log("Error Response", error);
      }
    }
    fetchData(config);

    const {
      currentPage,
      pageSize,
      totalPages,
      totalRecords,
      orderBy,
      result,
    } = data;
    setPage({
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      totalRecords: totalRecords,
      orderBy: orderBy,
    });
    setAllpostEvaluationData(result);
    setpostEvaluationData(result);
    setSpin(false);
  }, []);

  const showModal = (modalOperation, props) => {
    setCoursePostEvaluationsModal({
      ...coursePostEvaluationsModal,
      visible: true,
      modalOperation: modalOperation,
      dataProps: props,
    });
  };
  const hideModal = (modalOperation) => {
    setCoursePostEvaluationsModal({
      visible: false,
      modalOperation: modalOperation,
    });
  };

  function onSearch(val) {
    console.log("search:", val);
    setSpin(true);
    setSearchLoading(true);
    let searchedData = allpostEvaluationData.filter((d) =>
      d.title.toLowerCase().includes(val.toLowerCase())
    );

    setpostEvaluationData(searchedData);
  }
  useEffect(() => {
    if (searchLoading) {
      setSpin(false);
      setSearchLoading(false);
    }
  }, [searchLoading]);
  return (
    //GridType(gridList)

    <motion.div initial="hidden" animate="visible" variants={list}>
      <Row
        className="widget-container"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ margin: "0" }}
      >
        <div className="common-holder">
          <Col
            className="gutter-row widget-holder-col CoursePostEvaluations"
            xs={24}
            sm={24}
            md={24}
            lg={24}
          >
            <h1>Reports: CoursePostEvaluations</h1>
            <Row justify="start">
              <Col xs={24} xs={24} sm={12} md={8} lg={8}>
                <Search
                  placeholder="Search Learner"
                  enterButton="Search"
                  size="large"
                  loading={searchLoading}
                  onSearch={onSearch}
                />
              </Col>
            </Row>
            <Row className="PicklistCoursePostEvaluations">
              <Col xs={24}>
                {spin ? (
                  <div className="spinHolder">
                    <Spin
                      size="small"
                      tip="Retrieving data..."
                      spinning={spin}
                      delay={100}
                    ></Spin>
                  </div>
                ) : (
                  <Col xs={24}>
                    <PreassessmentList
                      postEvaluationData={postEvaluationData}
                      page={page}
                      setPage={setPage}
                      setRunSpin={setRunSpin}
                      spin={spin}
                      showModal={showModal}
                      hideModal={hideModal}
                    />
                  </Col>
                )}
              </Col>
            </Row>
          </Col>
        </div>
      </Row>
      <Modal
        title={`Post Evaluation ${coursePostEvaluationsModal.modalOperation}`}
        centered
        visible={coursePostEvaluationsModal.visible}
        onOk={() => hideModal(coursePostEvaluationsModal.modalOperation)}
        onCancel={() => hideModal(coursePostEvaluationsModal.modalOperation)}
        maskClosable={false}
        destroyOnClose={true}
        width={coursePostEvaluationsModal.width}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="ReportscoursePostEvaluationsModal"
      >
        {coursePostEvaluationsModal.modalOperation == "details" ? (
          <CoursePostEvaluationsDetails
            dataProps={coursePostEvaluationsModal.dataProps}
            categories={categories}
            hideModal={hideModal}
            setRunSpin={setRunSpin}
          />
        ) : coursePostEvaluationsModal.modalOperation == "add" ? (
          <CoursePostEvaluationsAdd
            hideModal={hideModal}
            setRunSpin={setRunSpin}
            categories={categories}
          />
        ) : coursePostEvaluationsModal.modalOperation == "approve" ? (
          "Hello Approve"
        ) : coursePostEvaluationsModal.modalOperation == "delete" ? (
          "HELLO Delete"
        ) : (
          "Default"
        )}
      </Modal>
      {/* <SaveUI
        listMenu={menulists}
        position="bottom-right"
        iconColor="#8998BA"
        toggleModal={() => showModal("add")}
      /> */}
      <style jsx global>{`
        .PicklistCoursePostEvaluations {
          margin-top: 1rem;
        }
        .CoursePostEvaluations h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .CoursePostEvaluations .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .searchResultSeparator.ant-divider-horizontal.ant-divider-with-text {
          margin: 0.5rem 0;
        }
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: relative;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          width: 100%;
        }
        .ReportscoursePostEvaluationsModal .ant-modal-footer {
          display: none;
          opacity: 0;
        }
        .ReportscoursePostEvaluationsModal .k-grid th {
          padding: 5px 24px;
        }
      `}</style>
    </motion.div>
  );
};

export default CoursePostEvaluations;
