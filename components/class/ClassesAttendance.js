import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Select, Input, Divider, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";
import moment from "moment";

import ClassessAttendanceList from "./AttendanceOperations/ClassesAttendanceList";

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

const ClassesAttendance = ({ course_id }) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [courseDetails, setCourseDetails] = useState("");
  const [spin, setSpin] = useState(true);
  const [sessionSelect, setSessionSelect] = useState("");
  const [sessionData, setSessionData] = useState({
    trigger: "",
    sessionTitle: "",
    enrolleeList: [],
  });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseSession/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { courseId: course_id },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          let theRes = response.data.result;
          // console.log("Session Response", response.data);
          if (theRes) {
            setSessionSelect(theRes);
            setSpin(false);
          } else {
            setSessionSelect("");
            setSpin(false);
          }
        }
      } catch (error) {
        const { response } = error;
        console.log("Error Response", response);
        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: response + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            visible: false;
          },
        });
      }
      //setLoading(false);
    }
    fetchData(config);
  }, []);

  useEffect(() => {
    let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.result.filter(
      (getCourse) => getCourse.id == course_id
    );
    setCourseDetails(theCourse[0]);
  }, []);

  function onChange(value) {
    setSpin(true);
    //console.log(`selected ${value}`);
    const sessOpt =
      sessionSelect.length &&
      sessionSelect.filter((option) => option.id === value);

    if (sessOpt.length) {
      let theSession = sessOpt[0];
      console.log("Selected Session", theSession);
      const sessionName = `${theSession.title} - (${theSession.startDate} ${theSession.endDate})`;

      /* For Update: Temporariy code */
      console.log(courseDetails);
      let courseName = courseDetails.title;
      let courseId = course_id;
      /* End of Temporariy code */

      let learnerList;
      //check if there are learners
      theSession.learnerSession && theSession.learnerSession.length
        ? (learnerList = theSession.learnerSession)
        : (learnerList = []);
      setSessionData({
        trigger: theSession.id,
        sessionTitle: sessionName,
        enrolleeList: learnerList,
      });
    } else {
      //No session seen
      setSessionData({
        trigger: false,
        sessionTitle: "",
        enrolleeList: [],
      });
    }
    setSpin(false);
  }
  function onBlur() {
    console.log("blur");
  }
  function onFocus() {
    console.log("focus");
  }
  function onSearch(val) {
    console.log("search:", val);
  }

  const sessionOptionList =
    sessionSelect.length &&
    sessionSelect.map((option, index) => {
      const sDate = moment(option.startDate).format("YYYY/MM/DD h:mm a");
      const eDate = moment(option.endDate).format("YYYY/MM/DD h:mm a");
      let sessionNames = `${option.title} - (${sDate} - ${eDate})`;
      let optValue = option.id;
      return (
        <Option key={index} label={sessionNames} value={optValue}>
          {sessionNames}
        </Option>
      );
    });

  return (
    //GridType(gridList)

    <motion.div initial="hidden" animate="visible" variants={list}>
      <Row
        className="widget-container"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ margin: "1rem 0" }}
      >
        <Col
          className="gutter-row widget-holder-col ClassesAttendance"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <h1>{courseDetails.title}: Attendance</h1>
          <Row className="widget-header-row" justify="start">
            <Col xs={24} xs={24} sm={12} md={8} lg={8}>
              <h3 className="widget-title">
                Select A Session to view Attendance:
              </h3>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Select Session"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {sessionOptionList}
              </Select>
            </Col>
          </Row>
          <Divider className="searchResultSeparator">
            Search Result Below
          </Divider>
          <Row className="Course-Enrollments">
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
                  <ClassessAttendanceList
                    sessionData={sessionData}
                    setSpin={setSpin}
                    spin={spin}
                  />
                </Col>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title="Publish Properties"
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>

      <style jsx global>{`
        .ClassesAttendance h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ClassesAttendance .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .searchResultSeparator.ant-divider-horizontal.ant-divider-with-text {
          margin: 2rem 0;
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
      `}</style>
    </motion.div>
  );
};

const ActionRender = () => {
  return (
    <td>
      <button
        className="k-primary k-button k-grid-edit-command"
        /* onClick={() => {
          edit(this.props.dataItem);
        }} */
      >
        <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
      </button>
    </td>
  );
};

export default ClassesAttendance;
