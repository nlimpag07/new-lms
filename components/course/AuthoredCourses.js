import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Modal, Divider, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
import { motion } from "framer-motion";

const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.5,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const AuthoredCourses = () => {
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));

  /*const [grid,setGrid] = useState(gridList);
   useEffect(() => {
    setGrid(gridList);
  }, []); */
  return (
    //GridType(gridList)
    <Col
      className="gutter-row widget-holder-col"
      xs={24}
      sm={24}
      md={16}
      lg={16}
    >
      <Row className="widget-header-row" justify="start">
        <Col xs={23}>
          <h3 className="widget-title">Authored Courses</h3>
        </Col>
        <Col xs={1} className="widget-switchgrid-holder">
          <button
            className="switch-grid"
            key="Switch"
            onClick={() =>
              setCurGridStyle(curGridStyle == "grid" ? "list" : "grid")
            }
          >
            <FontAwesomeIcon
              icon={["fas", `th-${curGridStyle == "grid" ? "list" : "large"}`]}
              size="lg"
            />
          </button>
        </Col>
      </Row>
      <Row
        className="AuthoredCourses-ListItems"
        gutter={[16, 16]}
        style={{ padding: "10px 0" }}
      >
        {GridType(curGridStyle, setModal2Visible)}
      </Row>
      <Modal
        title="Publish Properties"
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
      <style jsx global>{`
        .AuthoredCourses-ListItems .ant-card-actions > li {
          padding: 12px 0;
          margin: 0;
        }
        .AuthoredCourses-ListItems .ant-card-actions > li:hover {
          background-color: #f0f0f0;
          margin: 0;
        }
        .widget-holder-col:nth-child(even) {
          padding-right: 0px !important;
          padding-left: 10px !important;
        }

        .widget-holder-col:nth-child(odd) {
          padding-left: 0px !important;
          padding-right: 10px !important;
        }
        .widget-holder-col .widget-title {
          color: #e69138;
          margin-bottom: 0;
          text-transform: uppercase;
        }
        .widget-holder-col .widget-header-row {
          background-color: #eeeeee;
          padding: 5px 10px;
          color: #e69138;
        }
        .widget-holder-col .widget-header-row .widget-switchgrid-holder {
          text-align: center;
        }
        .widget-holder-col .widget-header-row .switch-grid {
          vertical-align: middle;
          font-weight: 900;
          border: none;
          outline: none;
        }
        .widget-holder-col .widget-header-row .switch-grid:hover,
        .widget-holder-col .widget-header-row .switch-grid:focus {
          cursor: pointer;
          outline: none;
        }
        .widget-holder-col .ant-card-body {
          padding: 10px;
        }
        .widget-holder-col .ant-card-head {
          float: right;
          position: absolute;
          right: 5px;
          top: 5px;
          background-color: #62ab35bf;
          border-radius: 15px;
          padding: 0 10px;
          font-size: 12px;
          color: #ffffff;
          padding: 7px 10px;
          font-size: 12px;
          min-height: 0;
          border-bottom: none;
        }
        .widget-holder-col .ant-card-head .ant-card-extra {
          color: #ffffff;
          padding: 0 0;
          font-size: 12px;
        }
        .grid-list .ant-card-cover,
        .grid-list .ant-card-body {
          float: left;
          position: relative;
        }
        .grid-list .ant-card-actions {
          float: none;
          clear: both;
          position: relative;
        }
        .widget-holder-col .published-course .ant-card-head {
          background-color: #62ab35bf;
        }
        .widget-holder-col .unpublished-course .ant-card-head {
          background-color: #ff572294;
        }
      `}</style>
    </Col>
  );
};

const GridType = (gridType, setModal2Visible) => {
  switch (gridType) {
    default:
      return (
        <>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Card
                className="published-course"
                extra="Published"
                hoverable
                style={{ width: "auto" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <CloudDownloadOutlined
                    key="Unpublish"
                    onClick={() => setModal2Visible(true)}
                  />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" onClick={() => setModal2Visible(true)} />,
                ]}
              >
                <Meta
                  title="Card title Grid"
                  description={
                    <div>
                      <div>Instructor-led Training</div>
                      <div>Public</div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Card
                className="unpublished-course"
                extra="Unpublished"
                hoverable
                style={{ width: "auto" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <CloudUploadOutlined
                    key="Publish"
                    onClick={() => setModal2Visible(true)}
                  />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Card title Grid"
                  description={
                    <div>
                      <div>Instructor-led Training</div>
                      <div>Public</div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Card
                extra="Published"
                hoverable
                style={{ width: "auto" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                actions={[
                  <CloudUploadOutlined
                    key="Publish"
                    onClick={() => setModal2Visible(true)}
                  />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Card title Grid"
                  description={
                    <div>
                      <div>Instructor-led Training</div>
                      <div>Public</div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
        </>
      );
    case "list":
      return (
        <>
          <Col className="gutter-row grid-list" xs={24} sm={24} md={24} lg={24}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Card
                extra="Published"
                hoverable
                style={{ width: "auto" }}
                cover={
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  </Col>
                }
                actions={[
                  <CloudUploadOutlined key="Publish" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Card title List"
                  description={
                    <div>
                      <div>Instructor-led Training</div>
                      <div>Public</div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
          <Col className="gutter-row grid-list" xs={24} sm={24} md={24} lg={24}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Card
                extra="Published"
                hoverable
                style={{ width: "auto" }}
                cover={
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  </Col>
                }
                actions={[
                  <CloudUploadOutlined key="Publish" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Card title List"
                  description={
                    <div>
                      <div>Instructor-led Training</div>
                      <div>Public</div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
          <Col className="gutter-row grid-list" xs={24} sm={24} md={24} lg={24}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Card
                extra="Published"
                hoverable
                style={{ width: "auto" }}
                cover={
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  </Col>
                }
                actions={[
                  <CloudUploadOutlined key="Publish" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Card title List"
                  description={
                    <div>
                      <div>Instructor-led Training</div>
                      <div>Public</div>
                    </div>
                  }
                />
              </Card>
            </motion.div>
          </Col>
        </>
      );
  }
};

export default AuthoredCourses;
