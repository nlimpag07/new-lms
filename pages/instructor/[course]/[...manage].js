/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const CourseList = dynamic(() =>
  import("../../../components/course/CourseList")
);
const CourseAdd = dynamic(() => import("../../../components/course/CourseAdd"));
const CourseEdit = dynamic(() =>
  import("../../../components/course/CourseEdit")
);
const CourseView = dynamic(() =>
  import("../../../components/course/CourseView")
);
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

const CourseManagement = (props) => {
  const router = useRouter();
  var urlPath = router.asPath;
  var theContent; //content assignment variable
  //console.log(props);
  //the pages to manage. If url query router.query.manage[0] is not listed,
  //redirect to 404
  const managePages = ["add", "edit", "view", "publish"];
  //check if the value of router.query.manage[0] is in managePages
  const isPageIncluded = managePages.includes(router.query.manage[0]);
  const courseSubPanels = ["course-outline", "learning-outcomes", "assessments", "instructors", "competencies", "post-evaluation"];
  const isSubPanelsIncluded = courseSubPanels.includes(router.query.manage[2]);


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
  const thePage = router.query.manage;
  const manageQueryLength = router.query.manage.length;

  if (manageQueryLength == 1) {
    if (urlPath.endsWith("edit") || urlPath.endsWith("view") ) {
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
    if(!isNaN(parsed)){course_id = parsed;}else{ return <Error statusCode={404} />; }  
    thePage[0] == "view" && (theContent = <CourseView courseId={thePage[1]} />); // url /view/courseId - viewing the course General
    thePage[0] == "edit" && (theContent = <CourseEdit />); // url /edit/couseId - Editing Course General
  } else if (
    manageQueryLength == 3 && isSubPanelsIncluded &&
    (thePage[0] == "view" || thePage[0] == "edit")
  ) {
    thePage[0] == "view" && thePage[2] == "course-outline" && (theContent = "HELLO View Course Outline"); // viewing the course
    thePage[0] == "view" && thePage[2] == "learning-outcomes" && (theContent = "HELLO View Course learning-outcomes"); // viewing the course
    thePage[0] == "view" && thePage[2] == "assessments" && (theContent = "HELLO View Course assessments"); // viewing the course
    thePage[0] == "view" && thePage[2] == "instructors" && (theContent = "HELLO View Course instructors"); // viewing the course
    thePage[0] == "view" && thePage[2] == "competencies" && (theContent = "HELLO View Course competencies"); // viewing the course
    thePage[0] == "view" && thePage[2] == "post-evaluation" && (theContent = "HELLO View Course post-evaluation"); // viewing the course

    thePage[0] == "edit" && thePage[2] == "course-outline" && (theContent = "HELLO Edit Course Outline"); // Editing the course
    thePage[0] == "edit" && thePage[2] == "learning-outcomes" && (theContent = "HELLO Edit Course learning-outcomes"); // Editing the course
    thePage[0] == "edit" && thePage[2] == "assessments" && (theContent = "HELLO View Edit assessments"); // Editing the course
    thePage[0] == "edit" && thePage[2] == "instructors" && (theContent = "HELLO View Edit instructors"); // Editing the course
    thePage[0] == "edit" && thePage[2] == "competencies" && (theContent = "HELLO View Edit competencies"); // Editing the course
    thePage[0] == "edit" && thePage[2] == "post-evaluation" && (theContent = "HELLO View Edit post-evaluation"); // Editing the course

  } else {
    return <Error statusCode={404} />;
  }


  //console.log(router.query.manage.length);
  //console.log(thePage);

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

export default withAuth(CourseManagement);
