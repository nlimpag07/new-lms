/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const LearnersMyProfile = dynamic(() =>
  import("../../components/learners-course/Outlines")
);
const CourseAssessmentsList = dynamic(() =>
  import(
    "../../components/learners-course/CourseAssessments/CourseAssessmentsList"
  )
);
/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar, Tabs, Switch } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";
import Error from "next/error";
import { useRouter } from "next/router";
import cookie from "cookie";
import Cookies from "js-cookie";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const apidirectoryUrl = process.env.directoryUrl;
const homeUrl = process.env.homeUrl;
const linkUrl = Cookies.get("usertype");
const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

const { Meta } = Card;
const { TabPane } = Tabs;
const Profile = ({ u, query }) => {
  /* Object.keys(query).length === 0 && query.constructor === Object
    ? console.log("Q", "Empty")
    : console.log("Q", query); */
  console.log("U", u);
  const router = useRouter();
  const [theLabel, setTheLabel] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const theKey = router.query.q ? router.query.q : "çourses";
  //console.log(theKey);
  useEffect(() => {
    var config = {
      /* method: "get",
      url: apiBaseUrl + "/courseoutline/" + course_id, */
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    axios
      .all([
        axios.get(apiBaseUrl + "/Learner/MyCourse", config),
        /* axios.get(apiBaseUrl + "/courseoutcome/" + course_id, config),
        axios.get(apiBaseUrl + "/coursecompetencies/" + course_id, config),
        axios.get(apiBaseUrl + "/enrollment/" + course_id, config), */
      ])
      .then(
        axios.spread((
          mycourses /* , courseoutcome, competencies, enrollments */
        ) => {
          /* console.log('Course Outline: ',!!courseoutline.data.response)*/
          console.log("Courses: ", mycourses.data);
          mycourses.data ? setMyCourses(mycourses.data) : setMyCourses([]);
          /*  courseoutcome.data.result
              ? setCourse_outcome(courseoutcome.data)
              : setCourse_outcome(null);
            competencies.data.result
              ? setCourse_competencies(competencies.data)
              : setCourse_competencies(null);
            enrollments.data.result
              ? setCourse_enrollments(enrollments.data)
              : setCourse_enrollments(null);
            enrollments.data.result
              ? setCourse_reviews(enrollments.data)
              : setCourse_reviews(null); */
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
    /* async function fetchData(config) {      
      const response = await axios(config);
      if (response) {
        //localStorage.setItem("courseAllList", JSON.stringify(response.data));
        //setCourseAllList(response.data);
        console.log(response.data);
      } else {
        //const userData = JSON.parse(localStorage.getItem("courseAllList"));
        //setCourseAllList(userData);
      }
    }
    fetchData(config); */
  }, [u.id]);

  /* 
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


  const learnerId = courseDetails.id;
  const courseId = router.query.courseId;
  const theOutline = router.query.outlines;
  let manageQueryLength = router.query ? Object.keys(router.query).length : 0;
  var isApproved = courseDetails.course ? 1 : 0;
*/
  useEffect(() => {
    setTheLabel(theKey);
  }, []);

  const onChangeTab = (activeKey) => {
    //console.log(activeKey);
    router.push(`/${linkUrl}/profile?q=${activeKey}`);
  };

  useEffect(() => {}, []);

  return (
    <MainThemeLayout>
      <Layout
        className="main-content-holder outlinesDetailsTabber"
        id="courses-class"
      >
        <Row>
          <Col>
            <h2 className="widget-title">{`${u.firstName} ${u.lastName}`}</h2>
          </Col>
        </Row>
        <Tabs defaultActiveKey={theLabel} onChange={onChangeTab}>
          <TabPane tab="Courses" key="courses">
            <h1>Courses</h1>
            {/* <LearnersMyProfile
              cDetails={cDetails}
              course_id={courseId}
              learnerId={learnerId}
              listOfOutlines={outlines}
            /> */}
          </TabPane>
          <TabPane tab="Assessments" key="assessments">
            <h1>Assessments</h1>
            {/* <CourseAssessmentsList
              cDetails={cDetails}
              course_id={courseId}
              learnerId={learnerId}
              listOfOutlines={outlines}
            /> */}
          </TabPane>
          <TabPane tab="Competencies" key="competencies">
            <h1>Competencies</h1>
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

Profile.getInitialProps = async (ctx) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = null;
  var userData;
  var uID;
  var res;

  const request = ctx.req;
  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || "");
    token = request.cookies.token;
    uID = request.cookies.uID;
    //res = null;
  } else {
    userData = JSON.parse(localStorage.getItem("userDetails"));
    token = userData.token;
    uID = userData.id;
  }

  try {
    var config = {
      method: "get",
      url: apiBaseUrl + `/Users/${uID}`,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config);
    res = result.data;
    //console.log(res);
    return { u: res, query: ctx.query };
  } catch (error) {
    const { response } = error;
    const { request, data } = response; // take everything but 'request'
    /* const errRes = ctx.res;
    if (errRes) {
      errRes.writeHead(301, {Location: `/learner/my-courses/${ctx.query.courseId}/learning-outlines`});
      errRes.end();
    } */
    return { u: { err: data.message }, q: ctx.query };
  }
};

export default withAuth(Profile);
