import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useRouter } from "next/router";
import {
  Calendar,
  Badge,
  Row,
  Col,
  Modal,
  Button,
  Form,
  Select,
  Input,
  Switch,
  Spin,
  message,
  Result,
} from "antd";
import Cookies from "js-cookie";

const CourseProhibit = ({ title, subTitle, url, asUrl }) => {
  const router = useRouter();
  return (
    //GridType(gridList)
    <Result
      status="403"
      title={title}
      subTitle={subTitle}
      extra={
        <Button
          type="primary"
          onClick={() =>
            router.push(
              url,
              asUrl
            )
          }
        >
          View Course Details To Clone
        </Button>
      }
    />
  );
};

export default CourseProhibit;
