/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/

/* Imported Courses Components Dynamically **/
import dynamic from "next/dynamic";
const CourseList = dynamic(() => import("../../../components/course/CourseList"));
const CourseAdd = dynamic(() => import("../../../components/course/CourseAdd"));
/**End Of Imported Courses Components **/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../../components/theme-layout/MainThemeLayout";
import withAuth from "../../../hocs/withAuth";

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
  //console.log(props);
  const router = useRouter();
  var urlPath = router.asPath;
  var theContent;
  if (urlPath) {
    urlPath.endsWith("list") && (theContent = <CourseList />);
    urlPath.endsWith("add") && (theContent = <CourseAdd />);
    urlPath.endsWith("edit") && (theContent = "HELLO Edit");
    urlPath.endsWith("publish") && (theContent = "HELLO Publish");
    //console.log(urlPath);
  }

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
