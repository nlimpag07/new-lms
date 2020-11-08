/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const LearnersMyCourseOutlines = dynamic(() =>
  import("../../../../components/learners-course/Outlines")
);

/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../../../components/theme-layout/MainThemeLayout";
import withAuth from "../../../../hocs/withAuth";
import Error from "next/error";
import { useRouter } from "next/router";
import cookie from "cookie";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const CourseOutlines = ({ courseDetails }) => {
  const router = useRouter();
  //check if Err response
  var isError = courseDetails.err ? true : false;
  //console.log(isError);

  var urlPath = router.asPath;
  var theContent; //content assignment variable
  let getlength = Object.keys(router.query).length;
  //console.log(getlength);
  //console.log("My Learner Course", courseDetails);
  var outlines = courseDetails.course
    ? courseDetails.course.courseOutline
    : null;
  //the pages to manage. If url query router.query.manage[0] is not listed,
  //redirect to 404
  //Entrapment: set maximum query length to 3 return 404 otherwise
  const learnerId=courseDetails.id
  const courseId = router.query.courseId;
  const theOutline = router.query.outlines;
  let manageQueryLength = router.query ? Object.keys(router.query).length : 0;
  var isApproved = courseDetails.course ? 1 : 0;
  /* var isApproved =
    courseDetails.course & (courseDetails.course.isApproved == 1) ? 1 : 0; */
  if (manageQueryLength == 2 && theOutline == "learning-outlines" && !isError) {
    let course_id = courseId;
    const parsed = parseInt(course_id);
    if (!isNaN(parsed)) {
      course_id = parsed;
    } else {
      return <Error statusCode={404} />;
    }
    course_id &&
      (theContent = (
        <LearnersMyCourseOutlines
          course_id={course_id}
          learnerId={learnerId}
          outlineList={outlines}
        />
      )); // url /view/courseId - viewing the course General
  } else {
    return <Error statusCode={404} />;
  }
  /* const managePages = ["add", "edit", "view", "publish"];
  //check if the value of router.query.manage[0] is in managePages
  const isPageIncluded = managePages.includes(router.query.manage[0]);
  const courseSubPanels = [
    "course-outline",
    "learning-outcomes",
    "assessments",
    "instructors",
    "competencies",
    "evaluations",
  ];
  const isSubPanelsIncluded = courseSubPanels.includes(router.query.manage[2]);

  //if isPageIncluded is false. url course/[...manage] not in isPageIncluded return to 404
  if (!isPageIncluded) {
    return <Error statusCode={404} />;
  }
  //if url course/edit with no courseId return to 404
 

  //Entrapment: set maximum query length to 3 return 404 otherwise
  const thePage = router.query.manage;
  const manageQueryLength = router.query.manage.length;

  if (manageQueryLength == 1) {
    if (urlPath.endsWith("edit") || urlPath.endsWith("view")) {
      return <Error statusCode={404} />;
    }
    //allow Manage[0] pages
    urlPath.endsWith("add") && (theContent = <CourseAdd />);
    urlPath.endsWith("publish") && (theContent = "HELLO Publish");
  } else if (
    manageQueryLength == 2 &&
    (thePage[0] == "view" || thePage[0] == "edit")
  ) {
    let course_id = thePage[1];
    const parsed = parseInt(course_id);
    if (!isNaN(parsed)) {
      course_id = parsed;
    } else {
      return <Error statusCode={404} />;
    }
    thePage[0] == "view" &&
      (theContent = <CourseView course_id={thePage[1]} />); // url /view/courseId - viewing the course General
    //console.log(thePage[1]);
    thePage[0] == "edit" && (theContent = <CourseEdit />); // url /edit/couseId - Editing Course General
  } else if (
    manageQueryLength == 3 &&
    isSubPanelsIncluded &&
    (thePage[0] == "view" || thePage[0] == "edit")
  ) {
    thePage[0] == "view" &&
      thePage[2] == "course-outline" &&
      (theContent = "HELLO View Course Outline"); // viewing the course
    thePage[0] == "view" &&
      thePage[2] == "learning-outcomes" &&
      (theContent = "HELLO View Course learning-outcomes"); // viewing the course
    thePage[0] == "view" &&
      thePage[2] == "assessments" &&
      (theContent = "HELLO View Course assessments"); // viewing the course
    thePage[0] == "view" &&
      thePage[2] == "instructors" &&
      (theContent = "HELLO View Course instructors"); // viewing the course
    thePage[0] == "view" &&
      thePage[2] == "competencies" &&
      (theContent = "HELLO View Course competencies"); // viewing the course
    thePage[0] == "view" &&
      thePage[2] == "evaluations" &&
      (theContent = "HELLO View Course post-evaluation"); // viewing the course
    
    thePage[0] == "edit" &&
      thePage[2] == "course-outline" &&
      (theContent = "HELLO Edit Course Outline"); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "learning-outcomes" &&
      (theContent = "HELLO Edit Course learning-outcomes"); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "assessments" &&
      (theContent = "HELLO View Edit assessments"); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "instructors" &&
      (theContent = "HELLO View Edit instructors"); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "competencies" &&
      (theContent = "HELLO View Edit competencies"); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "evaluations" &&
      (theContent = "HELLO View Edit post-evaluation"); // Editing the course
  } else {
    return <Error statusCode={404} />;
  } */

  //console.log(router.query.manage.length);

  //

  useEffect(() => {}, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder courses-class" id="courses-class">
        {theContent}
      </Layout>

      <style jsx global>{`
        /* .status-col {
          background: #eeeeee;
          padding: 8px 0;
          min-height: 150px;
        } */
      `}</style>
    </MainThemeLayout>
  );
};

CourseOutlines.getInitialProps = async (ctx) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = null;
  var userData;
  var res;
  const cId = ctx.query.courseId;
  const request = ctx.req;
  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || "");
    token = request.cookies.token;
    //res = null;
  } else {
    userData = JSON.parse(localStorage.getItem("userDetails"));
    token = userData.token;
  }

  try {
    var config = {
      method: "get",
      url: apiBaseUrl + `/Learner/MyCourse/${cId}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config);
    res = result.data;
    const data = res;
    //console.log(data);
    return { courseDetails: data };
  } catch (error) {
    const { response } = error;
    const { request, data } = response; // take everything but 'request'
    /* const errRes = ctx.res;
    if (errRes) {
      errRes.writeHead(301, {Location: `/learner/my-courses/${ctx.query.courseId}/learning-outlines`});
      errRes.end();
    } */
    return { courseDetails: { err: data.message } };
  }
};

export default withAuth(CourseOutlines);
