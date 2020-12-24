import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Row, Col, Modal, Empty, Tag, Divider, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const apiBaseUrl = process.env.apiBaseUrl;

const TranscriptDetails = ({
  modal2Visible,
  setModal2Visible,
  transcriptDetails,
}) => {
  const router = useRouter();
  const [userFullName, setUserFullName] = useState("");
  console.log("transcriptDetails", transcriptDetails);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userDetails"));
    const { firstName, lastName } = userData;
    let theFullName = `${firstName}, ${lastName}`;
    setUserFullName(theFullName);
  }, [modal2Visible]);

  //console.log(userFullName);
  var courseTitle;
  var courseInstructorsList;
  var courseCode;
  var rating;
  var courseOutlines;
  if (transcriptDetails) {
    courseTitle = transcriptDetails.courseTitle;
    courseInstructorsList = transcriptDetails.course.courseInstructor.length
      ? transcriptDetails.course.courseInstructor.map((instructor, index) => {
          let instructorFullName =
            instructor.user.firstName + ", " + instructor.user.lastName;

          return <Tag key={index}>{instructorFullName}</Tag>;
        })
      : null;
    courseCode = transcriptDetails.course
      ? transcriptDetails.course.code
      : null;
    rating = transcriptDetails.result ? transcriptDetails.result : null;
    courseOutlines = transcriptDetails.course.courseOutline.length
      ? transcriptDetails.course.courseOutline.map((outline, index) => {
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
      : [];
  }
  console.log(courseOutlines);

  const columns = [
    {
      title: "Step",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Lesson",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Result",
      dataIndex: "status",
      key: "status",
      render: (stat, record) =>
        stat == "Passed" ? (
          <Tag
            key={record.id}
            style={{ borderColor: "#85D871", color: "#85D871" }}
          >
            {stat}
          </Tag>
        ) : stat == "Failed" ? (
          <Tag
            key={record.id}
            style={{ borderColor: "#E65050", color: "#E65050" }}
          >
            {stat}
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "Final Score",
      dataIndex: "score",
      key: "score",
    },
    {
      title: "Hours Taken",
      dataIndex: "hoursTaken",
      key: "hoursTaken",
    },
  ];

  return (
    //GridType(gridList)
    <Row>
      <Modal
        title={<h2 className="myTranscriptTitle">{userFullName}</h2>}
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width="50%"
        className="transcriptDetailsModal"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <Row gutter={{ xs: 8, sm: 16, md: 32, lg: 32 }}>
          <Col xs={24}>
            <h3>{courseTitle}</h3>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 32, lg: 32 }}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <div className="divSeparator">
              <span>
                Rating: <Tag>{rating}</Tag>
              </span>
            </div>
            <div className="divSeparator">
              <span>Instructor: {courseInstructorsList}</span>
            </div>
            <div className="divSeparator">
              <span>Code: {courseCode}</span>
            </div>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={8}
            offset={8}
            style={{ textAlign: "left" }}
          >
            <div className="divSeparator">
              Final Grade:{" "}
              <span className="finalScoreBig">
                {transcriptDetails.finalScore}
              </span>
            </div>
            <div className="divSeparator">
              Date of Completion:{" "}
              <span className="finalScoreBig">
                {transcriptDetails.finalScore}
              </span>
            </div>
          </Col>
        </Row>
        <Divider dashed style={{ borderColor: "#999999", margin: "5px 0" }} />
        <Row gutter={{ xs: 8, sm: 16, md: 32, lg: 32 }}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Table
              columns={columns}
              dataSource={courseOutlines}
              size="small"
              rowKey="number"
            />
          </Col>
        </Row>
      </Modal>

      {/* <CourseCircularUi /> */}
      <style jsx global>{`
        .TranscriptDetails h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .TranscriptDetails .k-grid-header {
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
        .transcriptDetailsModal .ant-modal-footer {
          display: none;
        }
      `}</style>
    </Row>
  );
};

export default TranscriptDetails;
