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
  aspath = `${aspath[2]}/${aspath[3]}`
  const route = router.route;

  
  //var pathname = router.asPath.split("/");
  /* var [courseId, setCourseId] = useState(course_id);
  const homeUrl = process.env.homeUrl;
  const { courseAllList } = useCourseList();
  const [course, setCourse] = useState("");
  const [modal2Visible, setModal2Visible] = useState("");
  var courseData = ""; */
  const { relatedCourse, description, courseInstructor } = course_details;
  console.log(course_details);

  useEffect(() => {}, []);

  return (
    <div className="tab-content">
      <Row className="Course-Tags">
        <Col xs={24}>
          <p>{decodeURI(description)}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <p>
            Ett dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Lorem ipsum dolor sit amet, consectetur
            adipisicing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
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
              <span key={index}>{instructor.user.firstName}{" "}{instructor.user.lastName}{", "}</span>
                /* <Link
                  key={index}
                  href={`${route}`}
                  as={`/${linkUrl}/${aspath}/${instructor.courseRelated.course.id}`}
                >
                  <a>{instructor.user.firstName}{" "}{instructor.user.lastName}{", "}</a>
                </Link> */
              ))
            : "None"}
        </Col>
      </Row>

      <style jsx global>{``}</style>
    </div>
  );
};

export default CourseOverviewWidget;
