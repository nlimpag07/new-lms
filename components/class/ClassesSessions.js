import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Calendar, Badge, Row, Col, Modal, Drawer, Spin } from "antd";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
const SessionOperationOptions = dynamic(() =>
  import("./SessionOperations/SessionOperationOptions")
);
const SessionAdd = dynamic(() => import("./SessionOperations/SessionAdd"));
const SessionView = dynamic(() => import("./SessionOperations/SessionView"));
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

const ClassesSessions = ({ course_id }) => {
  const router = useRouter();
  const [spin, setSpin] = useState(true);

  const [sessionList, setSessionList] = useState("");
  const [calSessionModal, setCalSessionModal] = useState({
    title: "",
    date: "",
    visible: false,
    modalOperation: "general",
    width: 0,
  });
  const [dateSessionList, setDateSessionList] = useState("");
  const [instructorsList, setInstructorsList] = useState("");
  const [courseType, setCourseType] = useState(0);
  const [selectedRecord, setSelectedRecord] = useState("");
  useEffect(() => {
    var conf = {
      method: "get",
      url: apiBaseUrl + "/Courses/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { id: course_id },
    };
    async function getCourseDetails(conf) {
      try {
        const response = await axios(conf);
        if (response) {
          let theRes = response.data;
          console.log("Course", response.data);
          // wait for response if the verification is true
          if (theRes) {
            theRes.courseInstructor && theRes.courseInstructor.length
              ? setInstructorsList(theRes.courseInstructor)
              : setInstructorsList([]);
            theRes.courseType && theRes.courseType.length
              ? setCourseType(theRes.courseType[0].courseTypeId)
              : setCourseType(0);
          } else {
            setInstructorsList([]);
            setCourseType(0);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'
        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: data.message + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
      //setLoading(false);
    }
    getCourseDetails(conf);
  }, []);

  useEffect(() => {
    if (spin) {
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
            //setOutcomeList(response.data.result);
            let theRes = response.data.result;
            console.log("Session Response", response.data);
            // wait for response if the verification is true
            if (theRes) {
              //console.log(theRes)

              const ddata = theRes.length
                ? theRes.map((dataItem) =>
                    Object.assign({ selected: false }, dataItem)
                  )
                : null;
              setSessionList(ddata);
              setSpin(false);
            } else {
              const ddata = userlist.result
                ? userlist.result.map((dataItem) =>
                    Object.assign({ selected: false }, dataItem)
                  )
                : null;
              setSessionList(ddata);
              setSpin(false);
            }
          }
        } catch (error) {
          const { response } = error;
          const { request, data } = response; // take everything but 'request'

          console.log("Error Response", data.message);

          Modal.error({
            title: "Error: Unable to Retrieve data",
            content: data.message + " Please contact Technical Support",
            centered: true,
            width: 450,
            onOk: () => {
              //setdrawerVisible(false);
              visible: false;
            },
          });
        }
        //setLoading(false);
      }
      fetchData(config);
    }
  }, [spin]);

  function getListData(value) {
    let cellDate = moment(value).format("YYYY-MM-DD");
    let nowDate = moment().format("YYYY-MM-DD");
    let datalist;
    if (sessionList && sessionList.length) {
      datalist = sessionList.filter((session, index) => {
        //sd - startDate from api
        //ed - endDate from api
        let sd = moment(session.startDate).format("YYYY-MM-DD");
        let ed = moment(session.endDate).format("YYYY-MM-DD");

        if (
          moment(cellDate).isSameOrAfter(sd) &&
          moment(cellDate).isSameOrBefore(ed)
        ) {
          let isActivetype;
          moment(ed).isBefore(nowDate)
            ? (isActivetype = "error")
            : (isActivetype = "success");
          session["isActivetype"] = isActivetype;

          return session;
        }
        //console.log(sd);
      });
    }
    return datalist || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge status={item.isActivetype} text={item.title} />
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }

  //console.log(sessionList);

  const onOpenModal = (date, calSessionModal) => {
    //console.log(date);
    let sessModalArr = calSessionModal;
    setCalSessionModal({
      ...sessModalArr,
      title: "Sessions List",
      date: moment(date).format("YYYY-MM-DD HH:mm"),
      visible: true,
      width: "90%",
    });
    let theList = getListData(date);
    setDateSessionList(theList);
    //console.log("New List",theList);
  };
  const onCloseModal = (calSessionModal) => {
    //let sessModalArr = calSessionModal;
    setCalSessionModal({
      title: "",
      date: "",
      visible: false,
      modalOperation: "general",
      width: 0,
    });
    setDateSessionList("");
    setSelectedRecord("");
  };
  //console.log(calSessionModal);
  function dateFullCellRender(value) {
    const listData = getListData(value);
    return (
      <div
        className="ant-picker-cell-inner ant-picker-calendar-date"
        onClick={() => onOpenModal(value, calSessionModal)}
      >
        <div className="ant-picker-calendar-date-value">
          <h2>{value.date()}</h2>
        </div>
        <div className="ant-picker-calendar-date-content">
          <ul className="events">
            {listData.map((item) => (
              <li key={item.id}>
                <Badge status={item.isActivetype} text={item.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  return (
    //GridType(gridList)
    <Row
      className="widget-container"
      /* gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} */
      style={{ margin: "1rem 0" }}
    >
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
        <Col
          className="gutter-row widget-holder-col ClassesSessions"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <motion.div initial="hidden" animate="visible" variants={list}>
            <div className="common-holder">
              <h1>Sessions</h1>
              {courseType != 2 ? (
                <Calendar
                  /*dateCellRender={dateCellRender}*/
                  dateFullCellRender={dateFullCellRender}
                  monthCellRender={monthCellRender}
                  /* onSelect={(date) => onOpenModal(date, calSessionModal)} */
                  mode="month"
                />
              ) : (
                <div>You cannot set Sessions on Self-Paced type courses.</div>
              )}
            </div>
          </motion.div>
        </Col>
      )}
      <Modal
        title={`${calSessionModal.title}`}
        centered
        visible={calSessionModal.visible}
        onOk={() => onCloseModal(calSessionModal.modalOperation)}
        onCancel={() => onCloseModal(calSessionModal.modalOperation)}
        maskClosable={false}
        destroyOnClose={true}
        width={calSessionModal.width}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="csModal"
      >
        {calSessionModal.modalOperation == "view" ? (
          <SessionView
            course_id={course_id}
            spin={spin}
            setSpin={setSpin}
            setCalSessionModal={setCalSessionModal}
            calSessionModal={calSessionModal}
            instructorsList={instructorsList}
            selectedRecord={selectedRecord}
            setSelectedRecord={setSelectedRecord}
          />
        ) : calSessionModal.modalOperation == "add" ? (
          <SessionAdd
            course_id={course_id}
            spin={spin}
            setSpin={setSpin}
            setCalSessionModal={setCalSessionModal}
            calSessionModal={calSessionModal}
            instructorsList={instructorsList}
          />
        ) : calSessionModal.modalOperation == "approve" ? (
          "HELLO Approve"
        ) : calSessionModal.modalOperation == "delete" ? (
          "HELLO Delete"
        ) : (
          <SessionOperationOptions
            course_id={course_id}
            spin={spin}
            setSpin={setSpin}
            setCalSessionModal={setCalSessionModal}
            calSessionModal={calSessionModal}
            dateSessionList={dateSessionList}
            setDateSessionList={setDateSessionList}
            setSelectedRecord={setSelectedRecord}
          />
        )}
      </Modal>
      <style jsx global>{`
        .ClassesSessions h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .csModal .ant-modal-footer {
          display: none;
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
          padding: 34vh 0;
          width: 100%;
        }
        ul.events {
          list-style: none;
          padding: 0;
        }

        .ClassesSessions
          .ant-picker-calendar-full
          .ant-picker-panel
          .ant-picker-calendar-date {
          border: 1px solid #f0f0f0;
          margin: 0 !important;
        }
        .ClassesSessions .ant-picker-calendar-mode-switch {
          display: none !important;
        }
      `}</style>
    </Row>
  );
};

export default ClassesSessions;
