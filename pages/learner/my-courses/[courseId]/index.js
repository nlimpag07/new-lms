/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/
/* Imported Courses Components **/
/**End Of Imported Courses Components **/
import cookie from "cookie";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../../../components/theme-layout/MainThemeLayout";
import withAuth from "../../../../hocs/withAuth";
import { useAuth } from "../../../../providers/Auth";
import { useCourseList } from "../../../../providers/CourseProvider";

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

const CourseIndex = ({ courseId }) => {
  console.log("courseId", courseId);
  const { courseAllList, setCourseAllList } = useCourseList();
  //const [allCourses, setAllCourses] = useState(courselist);
  const router = useRouter();
  var urlPath = router.asPath;
  var urlquery = router.query.course;
  
    router.push(`/learner/my-courses/${courseId}/overview`);
 
  return null;
};

CourseIndex.getInitialProps = async (ctx) => {
    const {res} = ctx;
    const cId = ctx.query.courseId
  if (res) {
    res.writeHead(301, {Location: `/learner/my-courses/${ctx.query.courseId}/learning-outlines`});
    res.end();
  }
  return {courseId:cId};
};

export default withAuth(CourseIndex);
