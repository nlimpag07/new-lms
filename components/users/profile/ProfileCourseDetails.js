import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Row, Col, Modal, Empty, Tag, Divider, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.apiBaseUrl;

const ProfileCourseDetails = ({
  modal2Visible,
  setModal2Visible,
  assessmentDetails,
}) => {
  const router = useRouter();
  const [assessmentTitle, setAssessmentTitle] = useState("");
  console.log("assessmentDetails", assessmentDetails);

  useEffect(() => {
    /* let userData = JSON.parse(localStorage.getItem("userDetails"));
    const { firstName, lastName } = userData;
    let theFullName = `${firstName}, ${lastName}`; */
    setAssessmentTitle(assessmentDetails ? assessmentDetails.title : "");
  }, [modal2Visible]);

  //console.log(userFullName);
  var courseInstructorsList;
  var courseCode;
  var rating;
  var courseOutlines;
  if (assessmentDetails) {
    //assessmentTitle = assessmentDetails.title;
    /* courseInstructorsList = assessmentDetails.course.courseInstructor && assessmentDetails.course.courseInstructor.length
      ? assessmentDetails.course.courseInstructor.map((instructor, index) => {
          let instructorFullName =
            instructor.user.firstName + ", " + instructor.user.lastName;

          return <Tag key={index}>{instructorFullName}</Tag>;
        })
      : null; */
    courseCode = assessmentDetails.course
      ? assessmentDetails.course.code
      : null;
    rating = assessmentDetails.result ? assessmentDetails.result : null;
    /* courseOutlines = assessmentDetails.course.courseOutline.length
      ? assessmentDetails.course.courseOutline.map((outline, index) => {
          let outlineNewDetails = {
            number: index + 1,
            outlineId: outline.id,
            title: outline.title,
          };
          if (outline.learnerCourseOutline.length) {
            outlineNewDetails = {
              ...outlineNewDetails,
              status: outline.learnerCourseOutline[0].status.name,
              score: outline.learnerCourseOutline[0].score,
              hoursTaken: outline.learnerCourseOutline[0].hoursTaken,
            };
          } else {
            outlineNewDetails = {
              ...outlineNewDetails,
              status: "-",
              score: "-",
              hoursTaken: "-",
            };
          }

          return outlineNewDetails;
        })
      : []; */
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
        .ProfileCourseDetails h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ProfileCourseDetails .k-grid-header {
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

export default ProfileCourseDetails;
