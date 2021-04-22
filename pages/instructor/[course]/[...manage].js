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
const CourseOutlines = dynamic(() =>
  import("../../../components/course/CourseOutlines")
);
const CourseOutcomes = dynamic(() =>
  import("../../../components/course/CourseOutcomes")
);
const CourseInstructors = dynamic(() =>
  import("../../../components/course/CourseInstructors")
);
const CourseAssessments = dynamic(() =>
  import("../../../components/course/CourseAssessments")
);
const CourseCompetencies = dynamic(() =>
  import("../../../components/course/CourseCompetencies")
);
const CoursePostEvaluations = dynamic(() =>
  import("../../../components/course/CoursePostEvaluations")
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
import cookie from "cookie";
import { useCourseList } from "../../../providers/CourseProvider";
import { CourseDetailsProvider } from "../../../providers/CourseDStatuses";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
const CancelToken = axios.CancelToken;
let cancel;
const CourseManagement = (props) => {
  const router = useRouter();
  var urlPath = router.asPath;
  const { courselist } = props;
  const { courseAllList, setCourseAllList } = useCourseList();
  //console.log("Manage InitialProps", courselist);
  useEffect(() => {
    if (cancel !== undefined) {
      cancel();
    }
    setCourseAllList(courselist);
  }, []);

  var theContent; //content assignment variable

  //console.log(props);
  //the pages to manage. If url query router.query.manage[0] is not listed,
  //redirect to 404
  const managePages = ["add", "edit", "view", "publish"];
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
    let theCourse = courselist.result
      ? courselist.result.filter((course) => course.id == thePage[1])
      : null;
    thePage[0] == "view" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseView course_id={thePage[1]} theCourse={theCourse} />
        </CourseDetailsProvider>
      )); // url /view/courseId - viewing the course General
    //console.log(thePage[1]);
    thePage[0] == "edit" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseEdit course_id={thePage[1]} theCourse={theCourse} />
        </CourseDetailsProvider>
      )); // url /edit/couseId - Editing Course General
  } else if (
    manageQueryLength == 3 &&
    isSubPanelsIncluded &&
    /* thePage[0] == "view" ||  */ thePage[0] == "edit"
  ) {
    thePage[0] == "edit" &&
      thePage[2] == "course-outline" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseOutlines course_id={thePage[1]} />
        </CourseDetailsProvider>
      )); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "learning-outcomes" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseOutcomes course_id={thePage[1]} />
        </CourseDetailsProvider>
      )); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "assessments" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseAssessments course_id={thePage[1]} />
        </CourseDetailsProvider>
      )); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "instructors" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseInstructors course_id={thePage[1]} />
        </CourseDetailsProvider>
      )); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "competencies" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CourseCompetencies course_id={thePage[1]} />
        </CourseDetailsProvider>
      )); // Editing the course
    thePage[0] == "edit" &&
      thePage[2] == "evaluations" &&
      (theContent = (
        <CourseDetailsProvider course_id={thePage[1]}>
          <CoursePostEvaluations course_id={thePage[1]} />
        </CourseDetailsProvider>
      )); // Editing the course
  } else {
    return <Error statusCode={404} />;
  }

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
CourseManagement.getInitialProps = async (ctx) => {
  const CancelToken = axios.CancelToken;
  let cancel;
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = null;
  var userData;
  var res;
  const request = ctx.req;
  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || "");
    token = request.cookies.token;
    //res = null;
  } else {
    userData = JSON.parse(localStorage.getItem("userDetails"));
    token = userData.token;
  }

  var config = {
    method: "get",
    url: apiBaseUrl + "/courses",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    }),
  };
  try {
    const result = await axios(config);
    res = result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request Cancelled");
    }
    console.log("Error Response", error);
  }
  return { courselist: res };
};
export default withAuth(CourseManagement);
