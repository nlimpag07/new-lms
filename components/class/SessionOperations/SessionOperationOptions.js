import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Calendar,
  Badge,
  Row,
  Col,
  Modal,
  Drawer,
  Spin,
  Button,
  List,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditOutlined,
  UnorderedListOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";

import DateFormatter from "../../dateFormatter/DateFormatter";

const SessionOperationOptions = ({
  course_id,
  spin,
  setSpin,
  setCalSessionModal,
  calSessionModal,
  dateSessionList,
  setDateSessionList,
}) => {
  /*const [grid,setGrid] = useState(gridList);*/
  useEffect(() => {}, []);

  const onAddEditView = (action) => {
    let sessModalArr = calSessionModal;
    setCalSessionModal({
      ...sessModalArr,
      title: "Session - " + action,
      modalOperation: action,
      width: "35%",
    });
    //console.log("On Add", sessModalArr);
  };
  //console.log(dateSessionList);
  return (
    //GridType(gridList)
    <Row
      className="widget-container"
      gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      {spin ? (
        <div className="spinHolder">
          <Spin
            size="small"
            tip="Retrieving data..."
            spinning={spin}
            delay={100}
          ></Spin>
        </div>
      ) : (
        <Col
          className="gutter-row widget-holder-col SessionOperationOptions"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          {/* <h1>Sessions List</h1> */}
          <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <List
                className="SessionListcontainer"
                size="large"
                itemLayout="horizontal"
                dataSource={dateSessionList}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="link" onClick={() => onAddEditView("view")}>
                        View
                      </Button>,
                      <Button type="link" onClick={() => onAddEditView("edit")}>
                        Edit
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge
                          status={item.type}
                          text={DateFormatter(item.dateTime)}
                        />
                      }
                      /* title={item.auditTrailDescription} */
                      description={<a>{item.title}</a>}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
          <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Button
                type="primary"
                shape="round"
                icon={<UnorderedListOutlined />}
                size="large"
              >
                Today's Sessions
              </Button>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12}>
              <Button
                type="primary"
                shape="round"
                icon={<PlusSquareOutlined />}
                size="large"
                onClick={() => onAddEditView("add")}
              >
                Add Session
              </Button>
            </Col>
          </Row>
        </Col>
      )}
      <style jsx global>{`
        .SessionOperationOptions h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }
        .SessionOperationOptions {
          text-align: center;
        }
        /* .SessionOperationOptions .SessionListcontainer .ant-list-item {
          padding: 8px 0;
        }
        .SessionOperationOptions .SessionListcontainer .ant-list-item span {
          font-size: 10px;
        } */
      `}</style>
    </Row>
  );
};

export default SessionOperationOptions;
