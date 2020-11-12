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

const BeforeAssessment = ({ setTakeAssessment, setOutlineFinishModal,outlineFinishModal }) => {
  return setTakeAssessment ? (
    <Result
      status="success"
      title="Congratulations! You have successfully completed the lesson."
      subTitle="Please take the assessment exam to proceed to the next lesson."
      extra={[
        <Button
          type="primary"
          shape="round"
          key="console"
          size="large"
          onClick={setTakeAssessment}
        >
          Take the Assessment
        </Button>,
      ]}
    />
  ) : (
    <Row>
      <Modal
        title={`Outline No Assessment`}
        centered
        visible={outlineFinishModal}
        onOk={() => setOutlineFinishModal(false)}
        /* onCancel={OnAssessmentModalClose} */
        onCancel={() => setOutlineFinishModal(false)}
        maskClosable={false}
        destroyOnClose={true}
        width="90%"
        className="outlineAssessmentModal"
        maskStyle={{ backgroundColor: "rgb(0 0 0 / 91%)" }}
      >
        <Result
          status="success"
          title="Congratulations! You have successfully completed the lesson."
          subTitle="You may close this now."
          extra={[
            <Button
              type="primary"
              shape="round"
              key="console"
              size="large"
              onClick={()=>window.location.reload()}
            >
              Go back to Outlines
            </Button>,
          ]}
        />
      </Modal>
      <style jsx global>{`
        .outlineAssessmentModal .ant-modal-header,
        .outlineAssessmentModal .ant-modal-footer {
          display: none;
        }
        .outlineAssessmentModal .ant-modal-body {
          padding: 0;
        }
        .outlineAssessmentModal .ant-modal-close {
          top: -0.5rem;
          right: -0.5rem;
          display: none;
        }
        .outlineAssessmentModal .assessmentModalBody {
          padding: 2rem 3rem 3rem;
          color: #4d4d4d !important;
        }
        .assessmentModalMask {
          background-color: rgb(0 0 0 / 91%);
        }
        .assessmentModalBody .ant-spin-blur {
          opacity: 0 !important;
        }
      `}</style>
    </Row>
  );
};

export default BeforeAssessment;
