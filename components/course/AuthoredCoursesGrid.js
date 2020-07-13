import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Modal, Divider, Card, Avatar } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const AuthoredCourses = (props) => {
  const { gridList } = props;
  /*const [grid,setGrid] = useState(gridList);
   useEffect(() => {
    setGrid(gridList);
  }, []); */
  return (
    GridType(gridList)
  );
};


const GridType = (gridType) => {
    switch(gridType) {

      case "grid":   return (
        <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
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
            /* avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        } */
            title="Card title Grid"
            description={
              <div>
                <div>Instructor-led Training</div>
                <div>Public</div>
              </div>
            }
          />
        </Card>
      </Col>
        );
      case "list":   return (
        <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
        <Card
          extra="Published"
          hoverable
          style={{ width: "auto" }}
          cover={<Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
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
            /* avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        } */
            title="Card title List"
            description={
              <div>
                <div>Instructor-led Training</div>
                <div>Public</div>
              </div>
            }
          />
        </Card>
      </Col>
        );

      default:      return (
        <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
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
            /* avatar={
          <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        } */
            title="Card title"
            description={
              <div>
                <div>Instructor-led Training</div>
                <div>Public</div>
              </div>
            }
          />
        </Card>
      </Col>
        );
    }
  }

export default AuthoredCourses;
