import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Row, Col } from "antd";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const linkUrl = Cookies.get("usertype");
const CourseOverviewWidget = ({ course_details }) => {
  const router = useRouter();
  var aspath = router.asPath.split("/");
  aspath = `${aspath[2]}/${aspath[3]}`;
  const route = router.route;

  const { relatedCourse, description, courseInstructor } = course_details;
  //console.log(course_details);
  useEffect(() => {}, []);

  return (
    <div className="tab-content">
      <Row className="Course-Tags">
        <Col xs={24}>
          <p>{decodeURI(description)}</p>
        </Col>
      </Row>
      <Row className="Course-Tags related-courses">
        <Col xs={24}>
          <h3>RELATED COURSES</h3>
          {relatedCourse.length
            ? relatedCourse.map((rltdCourse, index) => (
                <Link
                  key={index}
                  href={`${route}`}
                  as={`/${linkUrl}/${aspath}/${rltdCourse.courseRelated.course.id}`}
                >
                  <a>{rltdCourse.courseRelated.course.title}</a>
                </Link>
              ))
            : "None"}
        </Col>
      </Row>
      <Row className="Course-Tags related-courses">
        <Col xs={24}>
          <h3>THE INSTRUCTOR</h3>
          {courseInstructor.length
            ? courseInstructor.map((instructor, index) => (
                <span key={index}>
                  {instructor.user.firstName} {instructor.user.lastName}
                  {", "}
                </span>
              ))
            : "None"}
        </Col>
      </Row>

      <style jsx global>{``}</style>
    </div>
  );
};

export default CourseOverviewWidget;
