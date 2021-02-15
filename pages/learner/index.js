/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/
/* Imported Courses Components **/
//import AdminDashboard from "../../../components/course/CourseList";
/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";

import StatusBar from "../../components/status_bar/StatusBar";

import RecentCourses from "../../components/learners-course/RecentCourses";
import ToDos from "../../components/todos/ToDos";

import Graph from "../../components/graph/Graph";
import LeaderBoard from "../../components/leaderboard/LeaderBoard";

import RecentActivities from "../../components/recent-activities/RecentActivities";
import SocialMedia from "../../components/social-media/SocialMedia";
import cookie from "cookie";
import { useCourseList } from "../../providers/CourseProvider";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
var apiBaseUrl = process.env.apiBaseUrl;
const LearnerIndex = (props) => {
  console.log("props From DashBoard GetInitialProps", props);
  const { courses, learner, user } = props;

  useEffect(() => {}, []);
  useEffect(() => {}, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder">
        <Row className="widget-container" gutter={[16, 32]}>
          <StatusBar learner={learner} />
        </Row>        
        <Row className="widget-container" gutter={[16, 32]}>
          <RecentCourses courses={learner} />
          <ToDos />
        </Row>
        {/*2nd Level*/}
        <Row gutter={[16, 32]}>
          <Graph />
          <LeaderBoard />
        </Row>
        <Row gutter={[16, 32]}>
          <RecentActivities />
          <SocialMedia />
        </Row>
      </Layout>

      <style jsx global>{``}</style>
    </MainThemeLayout>
  );
};
LearnerIndex.getInitialProps = async (ctx) => {
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
    url: apiBaseUrl + "/Dashboard",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const result = await axios(config);
  res = result.data;
  const data = res;
  return { ...data };
};
export default withAuth(LearnerIndex);
