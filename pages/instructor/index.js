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
const InstructorIndex = () => {
  //console.log(courselist);
  const [curGridStyle, setCurGridStyle] = useState("grid");
  const { courseAllList, setCourseAllList } = useCourseList();
  const [myAuthoredCourses, setMyAuthoredCourses] = useState(courseAllList);

  //console.log(courseAllList);
  useEffect(() => {}, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder">
        <Row className="widget-container" gutter={[16, 32]}>
          <StatusBar />
        </Row>
        <Row className="widget-container" gutter={[16, 32]}>
          <AuthoredCourses />
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

export default withAuth(InstructorIndex);
