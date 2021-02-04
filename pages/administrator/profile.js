/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const LearnersMyProfile = dynamic(() =>
  import("../../components/learners-course/Outlines")
);
const ProfileCourseList = dynamic(() =>
  import("../../components/users/profile/ProfileCourseList")
);
/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Layout,
  Row,
  Col,
  Button,
  Card,
  Avatar,
  Tabs,
  Switch,
  Spin,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";
import Error from "next/error";
import { useRouter } from "next/router";
import cookie from "cookie";
import Cookies from "js-cookie";
import moment from "moment";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { upperCase, upperFirst } from "lodash";

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
  const [spin, setSpin] = useState(true);
  //console.log("U", u);
  const router = useRouter();
  const [theLabel, setTheLabel] = useState("");
  const [coursePage, setCoursePage] = useState("");
  const [myCourses, setMyCourses] = useState([]);
  const theKey = router.query.q ? router.query.q : "çourses";
  const [user, setUser] = useState("");

  //console.log(theKey);
  useEffect(() => {
    if (linkUrl == "learner") {
      var config = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      async function fetchData(config) {
        try {
          const response = await axios.all([
            axios.get(apiBaseUrl + "/Learner/MyCourse", config),
            /* axios.get(apiBaseUrl + "/courseoutcome/" + course_id, config),
          axios.get(apiBaseUrl + "/coursecompetencies", config),*/
          ]);
          /* console.log("response", response); */
          let courses = response[0];
          setCoursePage(courses.data.currentPage);
          setMyCourses(courses.data.result);
          setSpin(false);
        } catch (errors) {
          console.error(errors);
        }
      }
      fetchData(config);
    }

    if (u.id) {
      var pconfig = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: { id: u.positionId },
      };
      var dconfig = {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: { id: u.departmentId },
      };

      axios
        .all([
          axios.get(apiBaseUrl + "/Picklist/position/" + u.positionId, pconfig),
          axios.get(
            apiBaseUrl + "/Picklist/department/" + u.departmentId,
            dconfig
          ),
        ])
        .then(
          axios.spread((position, department) => {
            //console.log(position)
            let up = u;
            u = {
              ...up,
              position: position.data.name,
              department: department.data.name,
              userGroup: upperFirst(linkUrl),
            };
            setUser(u);
          })
        )
        /* .then((res) => {
          console.info(res);
          let up = u;
          u = { ...up, position: res.data.name };
          setUser(u);
        }) */
        .catch((error) => {
          console.log("error Response: ", error);
          /* error.response && error.response.data
            ? openMessage(error.response.data.message, false)
            : openMessage(`Error:${error}`, false); */
        });
    }
  }, []);

  useEffect(() => {
    setTheLabel(theKey);
  }, []);

  const onChangeTab = (activeKey) => {
    //console.log(activeKey);
    //router.push(`/${linkUrl}/profile?q=${activeKey}`);
  };

  /* useEffect(() => {
    if (myCourses.length) {
      setSpin(false);
    }
  }, [myCourses]); */
  console.log("User", user);
  return (
    <MainThemeLayout>
      <Layout
        className="main-content-holder outlinesDetailsTabber"
        id="courses-class"
      >
        {/* <Row>
          <Col>
            <h2 className="widget-title">PROFILE</h2>
          </Col>
        </Row> */}
        <div className="common-holder">
        <Row style={{ marginBottom: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={6}>
            <div className="userThumbnail">
              <img
                alt="img"
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} className="userDetails">
            <div className="userDetails-Holder">
              <Row style={{ margin: "1rem 0" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Name:</span> {`${user.firstName} ${user.lastName}`}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Registration Date:</span>{" "}
                  {`${user.firstName} ${user.lastName}`}
                </Col>
              </Row>
              <Row style={{ margin: "1rem 0" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Email:</span> {`${user.email}`}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Birth Date:</span>{" "}
                  {`${
                    user.birthday
                      ? moment(u.birthday).format("DD-MMM-YYYY")
                      : null
                  }`}
                </Col>
              </Row>
              <Row style={{ margin: "1rem 0" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Department:</span> {`${user.department}`}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Position:</span> {`${user.position}`}
                </Col>
              </Row>
              <Row style={{ margin: "1rem 0" }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>User Group:</span> {`${user.userGroup}`}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <span>Last Access:</span> {`${ moment().format("DD-MMM-YYYY")}`}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        </div>
        {u.isLearner != 1 ? null : (
          <div className="common-holder">
          <Row>
            <Tabs
              defaultActiveKey={theLabel}
              onChange={onChangeTab}
              className="profileTabs"
            >
              <TabPane tab="Courses" key="courses">
                {spin ? (
                  <div className="spinHolder">
                    <Spin
                      size="small"
                      tip="Retrieving data..."
                      spinning={spin}
                      delay={100}
                    ></Spin>
                  </div>
                ) : (
                  <ProfileCourseList
                    myCourses={myCourses}
                    coursePage={coursePage}
                  />
                )}
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
              <TabPane tab="Appraisals" key="Appraisals">
                <h1>Appraisals</h1>
              </TabPane>
              <TabPane tab="Attendance" key="attendance">
                <h1>Attendance</h1>
              </TabPane>
            </Tabs>
          </Row>
          </div>
        )}
      </Layout>

      <style jsx global>{`
        /* .status-col {
          background: #eeeeee;
          padding: 8px 0;
          min-height: 150px;
        } */
        .profileTabs .ant-tabs-nav::before {
          /* border: 0 !important; */
        }
        .profileTabs .ant-tabs-tab {
          /* background-color: #bcbcbc; */
          padding: 15px 20px;
          font-weight: 500;
          font-size: 1.1rem;
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
        .profileTabs .spinHolder {
          text-align: center;
          z-index: 100;
          position: relative;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          width: 100%;
        }
        .userThumbnail {
          width: 100%;
          padding: 1rem;
        }
        .userThumbnail img {
          border-radius: 50%;
          width: 300px;
          height: 300px;
        }
        .userDetails {
          font-size: 1.3rem;
          font-weight: 500;
        }
        .userDetails span {
          font-size: 1rem;
          font-weight: 400;
          vertical-align: middle;
          margin-right: 0.5rem;
        }
        .userDetails-Holder {
          padding: 2% 2%;
          border: 1px dashed #dadada;
          margin: 2% 2%;
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
