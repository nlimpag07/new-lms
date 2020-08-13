import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";

import StatusBar from "../../components/status_bar/StatusBar";

import AuthoredCourses from "../../components/course/AuthoredCourses";
import ToDos from "../../components/todos/ToDos";

import Graph from "../../components/graph/Graph";
import LeaderBoard from "../../components/leaderboard/LeaderBoard";

import RecentActivities from "../../components/recent-activities/RecentActivities";
import SocialMedia from "../../components/social-media/SocialMedia";
import cookie from "cookie";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const InstructorIndex = ({ courselist, token, apiBaseUrl }) => {
  const [curGridStyle, setCurGridStyle] = useState("grid");
  const [myAuthoredCourses, setMyAuthoredCourses] = useState(courselist);

  useEffect(() => {
    /* if (!courselist) {
      var config = {
        method: "get",
        url: apiBaseUrl + "/courses",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      };
      async function fetchData(config) {
        // You can await here
        const result = await axios(config);
        setMyAuthoredCourses(result.data.slice(0, 4));
        // ...
      }
      fetchData(config);
    } else {
      setMyAuthoredCourses(courselist.slice(0, 4));
    } */


    //setCurGridStyle();
    //USE userData for the conditionals
    /* let myData = JSON.parse(localStorage.getItem("userDetails"));
    setUserData(myData); */
    let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    if(allCourses){
      setMyAuthoredCourses(allCourses.slice(0,4));
    }else{
      setMyAuthoredCourses(courselist.slice(0,4));
    }
    
    /* setMyAuthoredCourses(
      allCourses.filter((getCourse) => getCourse.isPublished == 1)
    ); */
  }, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder">
        <StatusBar />
        <Row
          className="widget-container"
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "1rem 0" }}
        >
          <AuthoredCourses authoredCoursesList={myAuthoredCourses} />
          <ToDos />
        </Row>
        {/*2nd Level*/}
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "1rem 0" }}
        >
          <Graph />
          <LeaderBoard />
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "1rem 0" }}
        >
          <RecentActivities />
          <SocialMedia />
        </Row>
      </Layout>

      <style jsx global>{`
        .status-col {
          background: #eeeeee;
          padding: 8px 0;
          min-height: 150px;
        }
      `}</style>
    </MainThemeLayout>
  );
};
InstructorIndex.getInitialProps = async (ctx) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = null;
  var userData;
  var res;
  const request = ctx.req;
  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || "");
    token = request.cookies.token;
    res = null;
  } else {
    userData = JSON.parse(localStorage.getItem("userDetails"));
    token = userData.token;

    var config = {
      method: "get",
      url: apiBaseUrl + "/courses",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    const result = await axios(config);
    res = result.data;
  }

  const data = res;
  //console.log(apiBaseUrl);
  return { courselist: data, token: token, apiBaseUrl: apiBaseUrl };
};
export default withAuth(InstructorIndex);
