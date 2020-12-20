/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const LearnersMyCourseOutlines = dynamic(() =>
  import("../../../../components/learners-course/Outlines")
);
const CourseAssessmentsList = dynamic(() =>
  import(
    "../../../../components/learners-course/CourseAssessments/CourseAssessmentsList"
  )
);
/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar, Tabs, Switch } from "antd";
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
const { TabPane } = Tabs;
const CourseOutlines = ({ courseDetails }) => {
  const router = useRouter();
  const [theLabel, setTheLabel] = useState("");
  //check if Err response
  var isError = courseDetails.err ? true : false;
  //console.log(isError);

  var urlPath = router.asPath;
  var theContent; //content assignment variable
  let getlength = Object.keys(router.query).length;
  //console.log(getlength);
  //console.log("My Learner Course", courseDetails);
  var cDetails = courseDetails.course ? courseDetails.course : null;
  var outlines = courseDetails.course
    ? courseDetails.course.courseOutline
    : null;
  var competencies = courseDetails.course
    ? courseDetails.course.courseCompetencies
    : null;

  //console.log("cDetails", cDetails);
  //the pages to manage. If url query router.query.manage[0] is not listed,
  //redirect to 404
  //Entrapment: set maximum query length to 3 return 404 otherwise
  const learnerId = courseDetails.id;
  const courseId = router.query.courseId;
  const theOutline = router.query.outlines;
  let manageQueryLength = router.query ? Object.keys(router.query).length : 0;
  var isApproved = courseDetails.course ? 1 : 0;
  /* var isApproved =
    courseDetails.course & (courseDetails.course.isApproved == 1) ? 1 : 0; */

  useEffect(() => {
    setTheLabel(theOutline);
  }, []);

  /* if (theLabel && manageQueryLength == 2 && !isError) {
    let course_id = courseId;
    const parsed = parseInt(course_id);
    if (!isNaN(parsed)) {
      course_id = parsed;
      courseId =course_id;
    } else {
      return <Error statusCode={404} />;
    }
    switch (theLabel) {
      case "learning-outlines":
        theContent = (
          <LearnersMyCourseOutlines
            cDetails={cDetails}
            course_id={course_id}
            learnerId={learnerId}
            listOfOutlines={outlines}
          />
        );
        break;
      case "learning-assessments":
        theContent = (
          <CourseAssessmentsList
            cDetails={cDetails}
            course_id={course_id}
            learnerId={learnerId}
            listOfOutlines={outlines}
          />
        );
        break;
      default:
        break;
    }
  } else {
    return <Error statusCode={404} />;
  } */

  const onChangeTab = (activeKey) => {
    //console.log(activeKey)
    router.push(`/learner/my-courses/${courseId}/${activeKey}`);
  };
  /* if (manageQueryLength == 2 && theOutline == "learning-outlines" && !isError) {
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
          cDetails={cDetails}
          course_id={course_id}
          learnerId={learnerId}
          listOfOutlines={outlines}
        />
      )); // url /view/courseId - viewing the course General
  } else if (
    manageQueryLength == 2 &&
    theOutline == "learning-overview" &&
    !isError
  ) {
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
          cDetails={cDetails}
          course_id={course_id}
          learnerId={learnerId}
          listOfOutlines={outlines}
        />
      )); // url /view/courseId - viewing the course General
  } else if (
    manageQueryLength == 2 &&
    theOutline == "learning-assessments" &&
    !isError
  ) {
    let course_id = courseId;
    const parsed = parseInt(course_id);
    if (!isNaN(parsed)) {
      course_id = parsed;
    } else {
      return <Error statusCode={404} />;
    }
    course_id &&
      (theContent = (
        <CourseAssessmentsList
          cDetails={cDetails}
          course_id={course_id}
          learnerId={learnerId}
          listOfOutlines={outlines}
        />
      )); // url /view/courseId - viewing the course General
  } else if (
    manageQueryLength == 2 &&
    theOutline == "learning-certificates" &&
    !isError
  ) {
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
          cDetails={cDetails}
          course_id={course_id}
          learnerId={learnerId}
          listOfOutlines={outlines}
        />
      )); // url /view/courseId - viewing the course General
  } else {
    return <Error statusCode={404} />;
  } */

  useEffect(() => {}, []);

  return (
    <MainThemeLayout>
      <Layout
        className="main-content-holder outlinesDetailsTabber"
        id="courses-class"
      >
        <Row>
          <Col>
            <h2 className="widget-title">{cDetails.title}</h2>
          </Col>
        </Row>
        <Tabs defaultActiveKey={theLabel} onChange={onChangeTab}>
          {/* <TabPane tab="Overview" key="learning-overview">
            Content of Tab Pane 1
          </TabPane> */}
          <TabPane tab="Outlines" key="learning-outlines">
            <LearnersMyCourseOutlines
              cDetails={cDetails}
              course_id={courseId}
              learnerId={learnerId}
              listOfOutlines={outlines}
            />
          </TabPane>
          <TabPane tab="Assessments" key="learning-assessments">
            <CourseAssessmentsList
              cDetails={cDetails}
              course_id={courseId}
              learnerId={learnerId}
              listOfOutlines={outlines}
            />
          </TabPane>
          <TabPane tab="Certificates" key="learning-certificates">
            Needs to be addressed
          </TabPane>
        </Tabs>
      </Layout>

      <style jsx global>{`
        /* .status-col {
          background: #eeeeee;
          padding: 8px 0;
          min-height: 150px;
        } */
        .ant-tabs-nav::before {
          /* border: 0 !important; */
        }
        .ant-tabs-tab {
          /* background-color: #bcbcbc; */
          padding: 15px 20px;
          font-weight: 500;
        }
        .outlinesDetailsTabber .ant-tabs-top > .ant-tabs-nav .ant-tabs-ink-bar {
          height: 5px;
          background-color: #f9ad48;
        }
        .outlinesDetailsTabber
          .ant-tabs-tab.ant-tabs-tab-active
          .ant-tabs-tab-btn {
          color: #f9ad48;
        }
        .outlinesDetailsTabber .ant-tabs-tab:hover {
          color: #f9ad48;
        }
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
    return { courseDetails: data[0] };
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
