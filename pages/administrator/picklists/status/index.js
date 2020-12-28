/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/
/* Imported Courses Components **/
import Statuses from "../../../../components/picklists/status/Statuses";
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

const PicklistStatusIndex = ({ data, ps, token, apiBaseUrl }) => {
  const router = useRouter();
  var urlPath = router.asPath;
  var urlquery = router.query.course;

  useEffect(() => {
    //setLoading(false);
  }, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder courses-class" id="courses-class">
        <Statuses data={data} ps={ps} />
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
PicklistStatusIndex.getInitialProps = async (ctx) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = null;
  var pageSize = 20;
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
    url: apiBaseUrl + "/settings/status?pageSize=" + pageSize,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const result = await axios(config);
  res = result.data;
  const data = res;

  return {
    data: data,
    ps: pageSize,
    token: token,
    apiBaseUrl: apiBaseUrl,
  };
};

export default withAuth(PicklistStatusIndex);
