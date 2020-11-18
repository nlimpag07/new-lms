import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadialUI from "../theme-layout/course-circular-ui/radial-ui";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";

import ClassesEnrollmentsList from "./EnrollmentOperations/ClassesEnrollmentsList";
//import EnrollmentsView from "./EnrollmentOperations/EnrollmentsView";
const EnrollmentsView = dynamic(() =>
  import("./EnrollmentOperations/EnrollmentsView")
);
const EnrollmentsAdd = dynamic(() =>
  import("./EnrollmentOperations/EnrollmentsAdd")
);

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
    url: "/instructor/[course]/edit",
    urlAs: "/instructor/course/edit",
    callback: "Save",
  },
];

const ClassesEnrollments = ({ course_id }) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [enrollmentsModal, setEnrollmentsModal] = useState(false);

  const [courseDetails, setCourseDetails] = useState("");
  const [enrollees, setEnrollees] = useState([]);
  const [spin, setSpin] = useState(true);

  useEffect(() => {
    if (spin) {
      var config = {
        method: "get",
        url: apiBaseUrl + "/Courses/" + course_id,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      async function fetchData(config) {
        try {
          const response = await axios(config);
          if (response) {
            //setOutcomeList(response.data.result);
            let theRes = response.data;

            // wait for response if the verification is true
            if (theRes && theRes.learner.length) {
              console.log("Response", response.data.learner);
              //there are enrollees
              setCourseDetails(theRes);
              setEnrollees(theRes.learner);
              setSpin(false);
            } else {
              //no enrollees
              setEnrollees([]);
              setSpin(false);
            }
          }
        } catch (error) {
          const { response } = error;
          const { request, data } = response; // take everything but 'request'

          console.log("Error Response", data.message);

          Modal.error({
            title: "Error: Unable to Start Lesson",
            content: data.message + " Please contact Technical Support",
            centered: true,
            width: 450,
            onOk: () => {
              //setdrawerVisible(false);
              visible: false;
            },
          });
          setSpin(false);
        }
      }
      fetchData(config);
      //setSpin(false);
    }
  }, [spin]);

  const showModal = (modalOperation) => {
    setEnrollmentsModal({
      visible: true,
      modalOperation: modalOperation,
    });
    console.log(modalOperation);
  };
  const hideModal = (modalOperation) => {
    setEnrollmentsModal({
      visible: false,
      modalOperation: modalOperation,
    });
    console.log("modalOperation", modalOperation);
  };
  console.log("Spin", spin);

  //Process Enrollment Applications
  const processEnrollment = (flag) => {
    console.log("modalOperation", modalOperation);
  };

  return (
    <Row
      className="widget-container"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={list}
        style={{ width: "100%" }}
      >
        {!spin ? (
          <Col
            className="gutter-row widget-holder-col ClassesEnrollments"
            xs={24}
            sm={24}
            md={24}
            lg={24}
          >
            <h1>{courseDetails.title}: Enrollments</h1>
            <Row className="Course-Enrollments">
              <Col xs={24}>
                <ClassesEnrollmentsList
                  enrollees_list={enrollees}
                  showModal={showModal}
                  hideModal={hideModal}
                  setSpin={setSpin}
                />
              </Col>
            </Row>
          </Col>
        ) : (
          <Col xs={24} style={{ textAlign: "center" }}>
            <Spin
              size="small"
              tip="Processing..."
              spinning={spin}
              delay={500}
            ></Spin>
          </Col>
        )}

        <Modal
          title="Enrollment"
          centered
          visible={enrollmentsModal.visible}
          onOk={() => hideModal(enrollmentsModal.modalOperation)}
          onCancel={() => hideModal(enrollmentsModal.modalOperation)}
          maskClosable={false}
          destroyOnClose={true}
          width="90%"
          cancelButtonProps={{ style: { display: "none" } }}
          okButtonProps={{ style: { display: "none" } }}
          className="enrollmentProcess"
        >
          {enrollmentsModal.modalOperation == "view" ? (
            <EnrollmentsView />
          ) : enrollmentsModal.modalOperation == "add" ? (
            <EnrollmentsAdd
              course_id={course_id}
              courseDetails={courseDetails}
              hideModal={hideModal}
              setSpin={setSpin}
            />
          ) : enrollmentsModal.modalOperation == "approve" ? (
            "HELLO Approve"
          ) : enrollmentsModal.modalOperation == "delete" ? (
            "HELLO Delete"
          ) : (
            "Default"
          )}
        </Modal>

        <RadialUI
          listMenu={menulists}
          position="bottom-right"
          iconColor="#8998BA"
          toggleModal={() => showModal("add")}
        />
      </motion.div>
      <style jsx global>{`
        .ClassesEnrollments h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ClassesEnrollments .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05); /* #4E4E4E */
        }
        .enrollmentProcess .ant-modal-footer {
          display: none;
          opacity: 0;
        }
        .enrollmentProcess .ant-transfer-list {
          width: 50% !important;
        }
      `}</style>
    </Row>
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
        ✔
      </button>
      &nbsp;
      <button
        className="k-button k-grid-remove-command"
        /* onClick={() => {
          confirm("Confirm deleting: " + this.props.dataItem.ProductName) &&
            remove(this.props.dataItem);
        }} */
      >
        ✖
      </button>
    </td>
  );
};

export default ClassesEnrollments;
