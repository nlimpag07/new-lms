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

const RecentActivities = () => {
  const [curGridStyle, setCurGridStyle] = useState("list");

  
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
          <h3 className="widget-title">Recent Activites</h3>
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
      <div className="common-holder">
        <Row
          gutter={[16, 16]}
          style={{ padding: "10px 0" }}
          className="recent-activities"
        >
          {GridType(curGridStyle)}
        </Row>
      </div>
      <style jsx global>{`
        .recent-activities .grid-list .ant-card-cover {
          width: auto;
        }
      `}</style>
    </Col>
  );
};

const GridType = (gridType) => {
  switch (gridType) {
    default:
      return (
        <>
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
                  <CloudUploadOutlined key="Publish" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Activity title Grid"
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
                  <CloudUploadOutlined key="Publish" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Activity title Grid"
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
                  <CloudUploadOutlined key="Publish" />,
                  <EditOutlined key="edit" />,
                  <EyeOutlined key="View" />,
                ]}
              >
                <Meta
                  title="Activity title Grid"
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
                  title="Activity title List"
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
                  title="Activity title List"
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

export default RecentActivities;
