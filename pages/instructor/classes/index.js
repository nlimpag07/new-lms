/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/
/* Imported Courses Components **/
import ClassesCourseList from "../../../components/class/ClassesCourseList";
/**End Of Imported Courses Components **/
import cookie from "cookie";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../../components/theme-layout/MainThemeLayout";
import withAuth from "../../../hocs/withAuth";
import { useAuth } from "../../../providers/Auth";
//import { CourseListProvider } from "../../../providers/CourseProvider";

import Error from "next/error";

import { useRouter } from "next/router";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const Classes = () => {
  const router = useRouter();
  var urlPath = router.asPath;
  var urlquery = router.query.course;

  useEffect(() => {
    //setLoading(false);
  }, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder courses-class" id="courses-class">
        <ClassesCourseList />
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

export default withAuth(Classes);
