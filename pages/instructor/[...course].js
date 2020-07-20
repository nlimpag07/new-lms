import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";

import CourseList from "../../components/course/CourseList";
import ToDos from "../../components/todos/ToDos";

import Graph from "../../components/graph/Graph";
import LeaderBoard from "../../components/leaderboard/LeaderBoard";

import RecentActivities from "../../components/recent-activities/RecentActivities";
import SocialMedia from "../../components/social-media/SocialMedia";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const Course = () => {
  const [curGridStyle, setCurGridStyle] = useState("grid");

  useEffect(() => {
    //setCurGridStyle();
  }, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder courses-class" id="courses-class">
        <CourseList />
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

export default withAuth(Course);
