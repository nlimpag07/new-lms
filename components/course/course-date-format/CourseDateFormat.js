import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";
import moment from "moment";
import { Row, Col, Tag, Alert } from "antd";
const CourseDateFormat = (props) => {
  const { course_id, updatedAt } = props;
  const { courseAllList } = useCourseList();
  const [currentDate, setCurrentDate] = useState("");
  const [courseStatus, setCourseStatus] = useState({
    isPublished: null,
    updatedAt: null,
  });
  useEffect(() => {
    let theDate = moment().subtract(2, "minutes").format("YYYY-MM-DD h:mm a");
    let ccStatus = {
      isPublished: 0,
      updatedAt: theDate,
    };
    if (courseAllList) {
      let theCourse = courseAllList.result.filter(
        (course) => course.id == course_id
      );

      theCourse &&
        theCourse.length &&
        (ccStatus = {
          isPublished: theCourse[0].isPublished,
          updatedAt: moment(theCourse[0].updatedAt).format("YYYY-MM-DD h:mm a"),
        });
    }
    setCourseStatus(ccStatus);
  }, [course_id]);
  const statusDisplay =
    courseStatus.isPublished === 1 ? (
      <Tag color="green" className="statusDisplayClass">
        Published
      </Tag>
    ) : (
      <Tag color="volcano" className="statusDisplayClass">
        Unpublished
      </Tag>
    );
  const dateDisplay =
    courseStatus.isPublished === 1
      ? "Updated: " + courseStatus.updatedAt
      : "Draft Saved: " + courseStatus.updatedAt;
  return (
    <>
      <Row className="cStatusClass">
        <Col xs={24} md={12} lg={12} style={{ textAlign: "left" }}>
          Status: {statusDisplay}
        </Col>
        <Col xs={24} md={12} lg={12}>
          {dateDisplay}
        </Col>
      </Row>
      {/* {courseStatus.isPublished === 1 && (
        <Row>
          <Col xs={24} md={24} lg={24} style={{ textAlign: "left" }}>
            <Alert
              message="Warning: Editing a published course will result to creating new version."
              type="warning"
              showIcon
              style={{ width: "100%" }}
            />
          </Col>
        </Row>
      )} */}

      <style jsx global>{`
        
        .statusDisplayClass {
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default CourseDateFormat;
