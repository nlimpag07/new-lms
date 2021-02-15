import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Row, Col, Modal, Empty, Tag, Divider, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.apiBaseUrl;

const CourseAssessmentDetails = ({
  modal2Visible,
  setModal2Visible,
  assessmentDetails,
}) => {
  const router = useRouter();
  const [assessmentTitle, setAssessmentTitle] = useState("");
  console.log("assessmentDetails", assessmentDetails);

  useEffect(() => {
    setAssessmentTitle(assessmentDetails ? assessmentDetails.title : "");
  }, [modal2Visible]);

  //console.log(userFullName);
  var courseInstructorsList;
  var courseCode;
  var rating;
  var courseOutlines;
  if (assessmentDetails) {
    courseCode = assessmentDetails.course
      ? assessmentDetails.course.code
      : null;
    rating = assessmentDetails.result ? assessmentDetails.result : null;
  }
  //console.log(courseOutlines);

  const columns = [
    {
      title: "Step",
      dataIndex: "number",
    },
    {
      title: "Lesson",
      dataIndex: "title",
    },
    {
      title: "Result",
      dataIndex: "status",
      render: (stat) =>
        stat == "Passed" ? (
          <Tag style={{ borderColor: "#85D871", color: "#85D871" }}>{stat}</Tag>
        ) : stat == "Failed" ? (
          <Tag style={{ borderColor: "#E65050", color: "#E65050" }}>{stat}</Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Final Score",
      dataIndex: "score",
    },
    {
      title: "Hours Taken",
      dataIndex: "hoursTaken",
    },
  ];

  return (
    //GridType(gridList)
    <Row>
      <Modal
        title={<h2 className="myTranscriptTitle">{assessmentTitle}</h2>}
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width="50%"
        className="assessmentDetailsModal"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 32, lg: 32 }}>
          <Col>
            <p>
              This is to know how much you have learned during the course. This
              exam is consisting of 10 multiple choice questions. If you are
              ready, click BEGIN.
            </p>
            <p>Good luck!</p>
          </Col>
        </Row>
      </Modal>

      {/* <CourseCircularUi /> */}
      <style jsx global>{`
        .CourseAssessmentDetails h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .CourseAssessmentDetails .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .myTranscriptTitle {
          margin-bottom: 0;
          color: #e69138;
        }
        .finalScoreBig {
          font-size: 22px;
          font-weight: bold;
          color: #e69138;
        }
        .divSeparator {
          margin-bottom: 10px;
          line-height: 2rem;
        }
        .assessmentDetailsModal .ant-modal-footer {
          display: none;
        }
      `}</style>
    </Row>
  );
};

export default CourseAssessmentDetails;
