/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/
/* Imported Courses Components **/
import CourseList from "../../../components/course/CourseList";
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
import { useCourseList } from "../../../providers/CourseProvider";

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
const CancelToken = axios.CancelToken;
let cancel;
const Course = (props) => {
  const { courselist } = props;
  //console.log(courselist)
  const { courseAllList, setCourseAllList } = useCourseList();
  //const [allCourses, setAllCourses] = useState(courselist);
  const router = useRouter();
  var urlPath = router.asPath;
  var urlquery = router.query.course;
  useEffect(() => {
    if (cancel !== undefined) {
      cancel();
    }
    setCourseAllList(courselist);
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

Course.getInitialProps = async (ctx) => {
  const CancelToken = axios.CancelToken;
  let cancel;
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
    url: apiBaseUrl + "/courses",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    }),
  };
  try {
    const result = await axios(config);
    res = result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request Cancelled");
    }
    console.log("Error Response", error);
  }
  return { courselist: res };
};

export default withAuth(Course);
