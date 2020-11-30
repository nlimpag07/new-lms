import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, List, Badge } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
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

const data = [
  {
    title: "8:00 AM ILT Session",
    avatar: <Badge status="success" text="14/08/2020" />,
    overdue: "",
  },
  {
    title: "10:00 AM ILT Session",
    avatar: <Badge status="error" text="14/06/2020" />,
    overdue: "Overdue",
  },
  {
    title: "1:00 PM ILT Session",
    avatar: <Badge status="error" text="18/06/2020" />,
    overdue: "Overdue",
  },
  {
    title: "8:00 AM ILT Session",
    avatar: <Badge status="success" text="25/08/2020" />,
    overdue: "",
  },
  {
    title: "8:00 AM ILT Session",
    avatar: <Badge status="success" text="14/08/2020" />,
    overdue: "",
  },
  {
    title: "10:00 AM ILT Session",
    avatar: <Badge status="error" text="14/06/2020" />,
    overdue: "Overdue",
  },
  {
    title: "1:00 PM ILT Session",
    avatar: <Badge status="error" text="18/06/2020" />,
    overdue: "Overdue",
  },
  {
    title: "8:00 AM ILT Session",
    avatar: <Badge status="success" text="25/08/2020" />,
    overdue: "",
  },
];

const ToDos = () => {
  const [curGridStyle, setCurGridStyle] = useState("list");

  /*const [grid,setGrid] = useState(gridList);
   useEffect(() => {
    setGrid(gridList);
  }, []); */
  return (
    //GridType(gridList)
    <Col className="gutter-row widget-holder-col" xs={24} sm={24} md={8} lg={8}>
      <Row className="widget-header-row" justify="start">
        <Col xs={22}>
          <h3 className="widget-title">To Do's</h3>
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
      <Row gutter={[16, 16]} style={{ padding: "10px 0" }}>
        <Col xs={24}>{GridType(curGridStyle)}</Col>
      </Row>
    </Col>
  );
};

const GridType = (gridType) => {
  return (
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            item.overdue == "" ? (
              <a key="list-loadmore-edit">Join</a>
            ) : (
              <a key="list-loadmore-edit">View</a>
            ),
          ]}
        >
          <List.Item.Meta
            avatar={item.avatar}
            title={<a href="https://ant.design">{item.title}</a>}
            description="Los Angeles battles huge wildfires."
          />
          <div>{item.overdue}</div>
        </List.Item>
      )}
    />
  );
};

export default ToDos;
