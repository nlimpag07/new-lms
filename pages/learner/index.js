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
const LearnerIndex = () => {
  //console.log(courselist);
  const [curGridStyle, setCurGridStyle] = useState("grid");
  const {courseAllList, setCourseAllList } = useCourseList();
  const [myAuthoredCourses, setMyAuthoredCourses] = useState(courseAllList);
 
  //console.log(courseAllList);
  useEffect(() => {
    
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
          <RecentCourses />
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
        
      `}</style>
    </MainThemeLayout>
  );
};

export default withAuth(LearnerIndex);
