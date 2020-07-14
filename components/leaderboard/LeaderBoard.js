import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Layout,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  Card,
  Avatar,
  Badge,
} from "antd";
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

const LeaderBoard = () => {
  const [curGridStyle, setCurGridStyle] = useState("grid");

  /*const [grid,setGrid] = useState(gridList);
   useEffect(() => {
    setGrid(gridList);
  }, []); */
  return (
    //GridType(gridList)
    <Col className="gutter-row widget-holder-col" xs={24} sm={24} md={8} lg={8}>
      <Row className="widget-header-row" justify="start">
        <Col xs={22}>
          <h3 className="widget-title">LeaderBoard</h3>
        </Col>
        <Col xs={2} className="widget-switchgrid-holder">
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
      <Row className="LeaderBoard-Items" gutter={[16, 16]} style={{ padding: "10px 0" }} justify="space-between">
        {GridType(curGridStyle)}
      </Row>
      <style jsx global>{`
        .LeaderBoard-Items .ant-col {
          text-align:center;
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
              <Badge offset={[-70, 80]} count={1} style={{ backgroundColor: "#52c41a" }}>
                <Avatar
                  size={80}
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </Badge>
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Badge offset={[-70, 80]}  count={100} overflowCount={99} style={{ backgroundColor: "#52c41a" }}>
                
                <Avatar size={80} style={{
        backgroundColor: '#87d068',
      }}>USER</Avatar>
              </Badge>
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Badge offset={[-70, 80]} count={1} style={{ backgroundColor: "#52c41a" }}>
                <Avatar
                  size={80}
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </Badge>
            </motion.div>
          </Col>
        </>
      );
    case "list":
      return (
        <>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Badge offset={[-70, 80]} count={1} style={{ backgroundColor: "#52c41a" }}>
                <Avatar
                  size={80}
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </Badge>
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Badge offset={[-70, 80]}  count={100} overflowCount={99} style={{ backgroundColor: "#52c41a" }}>
                
                <Avatar size={80} style={{
        backgroundColor: '#87d068',
      }}>USER</Avatar>
              </Badge>
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Badge offset={[-70, 80]} count={1} style={{ backgroundColor: "#52c41a" }}>
                <Avatar
                  size={80}
                  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                />
              </Badge>
            </motion.div>
          </Col>
        </>
      );
  }
};

export default LeaderBoard;
