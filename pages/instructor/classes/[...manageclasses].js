/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const ClassesSessions = dynamic(() =>
  import("../../../components/class/ClassesSessions")
);
const ClassesEnrollments = dynamic(() => import("../../../components/class/ClassesEnrollments"));
const ClassesClass = dynamic(() => import("../../../components/class/ClassesClass"));
const ClassesAttendance= dynamic(() => import("../../../components/class/ClassesAttendance"));
/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../../components/theme-layout/MainThemeLayout";
import withAuth from "../../../hocs/withAuth";
import Error from "next/error";
import { useRouter } from "next/router";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const ClassesManagement = (props) => {
  const router = useRouter();
  var urlPath = router.asPath;
  var theContent; //content assignment variable
  //console.log(props);
  //the pages to manage. If url query router.query.manage[0] is not listed,
  //redirect to 404
  const managePages = ["sessions", "enrollments", "class", "attendance"];
  //check if the value of router.query.manage[0] is in managePages
  const isPageIncluded = managePages.includes(router.query.manageclasses[0]);
  const courseSubPanels = [
    "course-outline",
    "learning-outcomes",
    "assessments",
    "instructors",
    "competencies",
    "evaluations",
  ];
  const isSubPanelsIncluded = courseSubPanels.includes(
    router.query.manageclasses[2]
  );

  //if isPageIncluded is false. url course/[...manage] not in isPageIncluded return to 404
  if (!isPageIncluded) {
    return <Error statusCode={404} />;
  }
  //if url course/edit with no courseId return to 404
  /*  if (urlPath.endsWith("edit")) {
    return <Error statusCode={404} />;
  }
  //allow Manage[0] pages
  urlPath.endsWith("add") && (theContent = <CourseAdd />);
  urlPath.endsWith("view") && (theContent = <CourseAdd />);
  urlPath.endsWith("publish") && (theContent = "HELLO Publish"); */

  //Entrapment: set maximum query length to 3 return 404 otherwise
  const thePage = router.query.manageclasses;
  const manageQueryLength = router.query.manageclasses.length;
  //console.log(thePage);
  //theContent = "HELLO Classes"

  let course_id = thePage[1];
  const parsed = parseInt(course_id);
  if (!isNaN(parsed)) {
    course_id = parsed;
  } else {
    return <Error statusCode={404} />;
  }

  thePage[0] == "sessions" &&
    (theContent = <ClassesSessions course_id={course_id} />); // viewing the course
  thePage[0] == "enrollments" &&
    (theContent = <ClassesEnrollments course_id={course_id} />); // viewing the course
    thePage[0] == "class" &&
    (theContent = <ClassesClass course_id={course_id} />); // viewing the course
    thePage[0] == "attendance" &&
    (theContent = <ClassesAttendance course_id={course_id} />); // viewing the course    
    
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

export default withAuth(ClassesManagement);
