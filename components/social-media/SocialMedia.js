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
  FacebookFilled,
  InstagramFilled,
  TwitterCircleFilled,
  LinkedinFilled,
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

const SocialMedia = () => {
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
          <h3 className="widget-title">Social Media</h3>
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
      <Row
        className="SocialMedia-Items"
        gutter={[16, 16]}
        style={{ padding: "10px 0" }}
        justify="space-around"
      >
        {GridType(curGridStyle)}
      </Row>
      <style jsx global>{`
        .SocialMedia-Items .ant-col {
          text-align: center;
        }
      `}</style>
    </Col>
  );
};

const GridType = (gridType) => {
  let avatarProps = {
    size:50,
    style:{
      color: "#f56a00",
      backgroundColor: "#fde3cf",
    }
  };
  switch (gridType) {
    default:
      return (
        <>
          <Col xs={6} sm={6} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<LinkedinFilled />}
                {...avatarProps}                
              />
            </motion.div>
          </Col>
          <Col xs={6} sm={6} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<TwitterCircleFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
          <Col xs={6} sm={6} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<InstagramFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
          <Col xs={6} sm={6} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<FacebookFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
        </>
      );
    case "list":
      return (
        <>
          <Col xs={24} sm={24} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<LinkedinFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
          <Col xs={24} sm={24} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<TwitterCircleFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<InstagramFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={4} lg={4}>
            <motion.div initial="hidden" animate="visible" variants={list}>
              <Avatar
                icon={<FacebookFilled />}
                {...avatarProps} 
              />
            </motion.div>
          </Col>
        </>
      );
  }
};

export default SocialMedia;
