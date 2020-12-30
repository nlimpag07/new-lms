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
import StatusList from "./StatusList";
import StatusAdd from "./StatusAdd";

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

const Statuses = ({ data, ps }) => {
  //console.log(data);
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [statusesModal, setStatusesModal] = useState({
    visible: false,
    modalOperation: "",
    dataProps: null,
    width: "auto",
  });
  const [statusDetails, setStatusDetails] = useState("");
  const [spin, setSpin] = useState(true);
  const [statusSelect, setStatusSelect] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [page, setPage] = useState({
    currentPage: 0,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
    orderBy: "",
  });
  const {
    currentPage,
    pageSize,
    totalPages,
    totalRecords,
    orderBy,
    result,
  } = data;

  useEffect(() => {
    if (spin) {
      setPage({
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        totalRecords: totalRecords,
        orderBy: orderBy,
      });
      setStatusData(result);
      setSpin(false);
    }
  }, [spin]);

  useEffect(() => {}, []);

  const showModal = (modalOperation, props) => {
    setStatusesModal({
      visible: true,
      modalOperation: modalOperation,
      dataProps: props,
    });
  };
  const hideModal = (modalOperation) => {
    setStatusesModal({
      visible: false,
      modalOperation: modalOperation,
    });
  };

  function onChange(value) {
    setSpin(true);
    //console.log(`selected ${value}`);
    const sessOpt =
      statusSelect.length &&
      statusSelect.filter((option) => option.id === value);

    if (sessOpt.length) {
      let theSession = sessOpt[0];
      console.log("Selected Session", theSession);
      let sDate = moment(theSession.startDate).format("YYYY/MM/DD h:mm a");
      let eDate = moment(theSession.endDate).format("YYYY/MM/DD h:mm a");
      const sessionName = `${theSession.title} - (${sDate} - ${eDate})`;

      /* For Update: Temporariy code */
      console.log(statusDetails);
      let courseName = statusDetails.title;
      let courseId = course_id;
      /* End of Temporariy code */

      let learnerList;
      //check if there are learners

      theSession.learnerSession && theSession.learnerSession.length
        ? (learnerList = theSession.learnerSession)
        : (learnerList = []);

      /* var config = {
          method: "get",
          url: apiBaseUrl + "/Attendance/" + theSession.id,
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
                
              } else {
                
              }
            }
          } catch (error) {
            const { response } = error;
            console.log("Error Response", response);   
            
          }
          //setLoading(false);
        }
        fetchData(config); */

      setStatusData({
        trigger: theSession.id,
        title: sessionName,
        enrolleeList: learnerList,
      });
    } else {
      //No session seen
      setStatusData({
        trigger: false,
        title: "",
        enrolleeList: [],
      });
    }
    setSpin(false);
  }
  function onBlur() {
    //console.log("blur");
  }
  function onFocus() {
    //console.log("focus");
  }
  function onSearch(val) {
    console.log("search:", val);
    setSearchLoading(!searchLoading);
  }

  /* const sessionOptionList =
    statusSelect.length &&
    statusSelect.map((option, index) => {
      const sDate = moment(option.startDate).format("YYYY/MM/DD h:mm a");
      const eDate = moment(option.endDate).format("YYYY/MM/DD h:mm a");
      let sessionNames = `${option.title} - (${sDate} - ${eDate})`;
      let optValue = option.id;
      return (
        <Option key={index} label={sessionNames} value={optValue}>
          {sessionNames}
        </Option>
      );
    }); */

  return (
    //GridType(gridList)

    <motion.div initial="hidden" animate="visible" variants={list}>
      <Row
        className="widget-container"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ margin: "1rem 0" }}
      >
        <Col
          className="gutter-row widget-holder-col Statuses"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <h1>Picklists: Status</h1>
          <Row className="widget-header-row" justify="start">
            <Col xs={24} xs={24} sm={12} md={8} lg={8}>
              <Search
                placeholder="Search a Status"
                enterButton="Search"
                size="large"
                loading={searchLoading}
                onSearch={onSearch}
              />
            </Col>
          </Row>
          <Row className="PicklistStatuses">
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
                  <StatusList
                    statusData={statusData}
                    page={page}
                    setPage={setPage}
                    setSpin={setSpin}
                    spin={spin}
                    showModal={showModal}
                    hideModal={hideModal}
                  />
                </Col>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title={`Status - ${statusesModal.modalOperation}`}
        centered
        visible={statusesModal.visible}
        onOk={() => hideModal(statusesModal.modalOperation)}
        onCancel={() => hideModal(statusesModal.modalOperation)}
        maskClosable={false}
        destroyOnClose={true}
        width={statusesModal.width}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="PicklistStatusesModal"
      >
        {statusesModal.modalOperation == "edit" ? (
          "Hello Edit"
        ) : statusesModal.modalOperation == "add" ? (
          <StatusAdd />
        ) : statusesModal.modalOperation == "approve" ? (
          "Hello Approve"
        ) : statusesModal.modalOperation == "delete" ? (
          "HELLO Delete"
        ) : (
          "Default"
        )}
      </Modal>
      <SaveUI
        listMenu={menulists}
        position="bottom-right"
        iconColor="#8998BA"
        toggleModal={() => showModal("add")}
      />
      <style jsx global>{`
        .PicklistStatuses {
          margin-top: 1rem;
        }
        .Statuses h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .Statuses .k-grid-header {
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
        .PicklistStatusesModal .ant-modal-footer {
          display: none;
          opacity: 0;
        }
      `}</style>
    </motion.div>
  );
};

export default Statuses;