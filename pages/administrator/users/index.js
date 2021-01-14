/** NLI
 * Use NextJs Conditional Importing
 * To Load Import Only the needed component
 **/
/* Imported Courses Components **/
import UsersList from "../../../components/users/UsersList";
/**End Of Imported Courses Components **/
import cookie from "cookie";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Card, Avatar, Modal } from "antd";
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

const Users = ({ userslist, error, token, apiBaseUrl }) => {
  const router = useRouter();
  var urlPath = router.asPath;
  var urlquery = router.query.course;
  useEffect(() => {
    //setLoading(false);
    if (error) {
      console.log("Error", error);
      Modal.error({
        title: "Error: Unable to Retrieve data",
        content: error,
        centered: true,
        width: 450,
        onOk: () => {
          //setdrawerVisible(false);
          visible: false;
        },
      });
    }
  }, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder courses-class" id="courses-class">
        <UsersList userlist={userslist} />
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
Users.getInitialProps = async (ctx) => {
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
    url: apiBaseUrl + "/Users",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
  let resultData = null;
  let error = null;
  try {
    const result = await axios(config);
    resultData = result.data;
  } catch (error) {
    error.response && error.response.data
      ? (error = error.response.data.message)
      : (error = `${error}, Please contact Technical Support`);
  }
  return {
    userslist: resultData,
    error: error,
    token: token,
    apiBaseUrl: apiBaseUrl,
  };
};

export default withAuth(Users);
