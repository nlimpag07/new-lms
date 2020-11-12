import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import { Layout, Row, Col, Button, Result, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  InfoCircleFilled,
  CloseCircleOutlined,
} from "@ant-design/icons";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const AssessmentResult = ({ onClickReload, resultInfo }) => {
  console.log(resultInfo);
  var resStatus;
  var resTitle;
  var resSubTitle;
  var resGrade;
  var buttonText = "Close";
  if (resultInfo != "error") {
    let infoStatus = resultInfo.status;
    switch (infoStatus) {
      case "Passed":
        {
          resStatus = "success";
          resTitle = `Assessment Result: Passed (Score: ${resultInfo.finalScore})`;
          resSubTitle =
            "Congratulations! You passed the assessment. You are eligible to take on the next lesson. ";
          buttonText ="Proceed"
        }
        break;
      case "Failed":
        {
          resStatus = "error";
          resTitle = `Assessment Result: Failed (Score: ${resultInfo.finalScore})`;
          resSubTitle =
            "We are sad you didn't passed the examination. But worry not, you can request for a retake for this assessment.";
            buttonText ="Request Retake"
        }
        break;
      case "For Grading":
        {
          resStatus = "info";
          resTitle = `Assessment Result: Pending`;
          resSubTitle =
            "Some questions needs instructor's grade. Once graded, your assessment result will be concluded.";
            buttonText ="Proceed"
        }
        break;
      default: {
        resStatus = "info";
        resTitle = `Assessment Result: Pending`;
        resSubTitle =
          "Some questions needs instructor's grade. Once graded, your assessment result will be concluded.";
          buttonText ="Close"
      }
    }
  } else {
    resStatus = "error";
    resTitle = "An Error Occured while processing your request";
    resSubTitle = "Please contact technical support.";
    buttonText ="Close"
  }

  return (
    <Result
      status={resStatus}
      title={resTitle}
      subTitle={resSubTitle}
      extra={[
        <Button
          type="primary"
          shape="round"
          key="console"
          size="large"
          onClick={onClickReload}
        >
          {buttonText}
        </Button>,
      ]}
    />
  );
};

export default AssessmentResult;
