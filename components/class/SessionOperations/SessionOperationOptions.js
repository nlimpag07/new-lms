import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";

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
  Table,
  Tag,
  Space,
  Popconfirm,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EditOutlined,
  UnorderedListOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";

import DateFormatter from "../../dateFormatter/DateFormatter";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const SessionOperationOptions = ({
  course_id,
  spin,
  setSpin,
  setCalSessionModal,
  calSessionModal,
  dateSessionList,
  setDateSessionList,
  setSelectedRecord,
}) => {
  /*const [grid,setGrid] = useState(gridList);*/
  useEffect(() => {}, []);

  const onAddEditView = (action, rec) => {
    let sessModalArr = calSessionModal;
    setCalSessionModal({
      ...sessModalArr,
      title: "Session - " + action,
      modalOperation: action,
      width: "35%",
    });
    action == "view" && setSelectedRecord(rec);
    action == "add" && setSelectedRecord("");
    //console.log("On Add", sessModalArr);
  };
  //console.log(dateSessionList);
  const confirmDelete = (rec) => {
    var config = {
      method: "delete",
      url: apiBaseUrl + "/CourseSession/" + rec.id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { id: rec.id },
    };
    async function delData(config) {
      try {
        const response = await axios(config);
        if (response) {
          //setAssessmentList(response.data.result);
          console.log("Response", response.data);
          message.success(response.data.message);
          setCalSessionModal({
            title: "",
            date: "",
            visible: false,
            modalOperation: "general",
            width: 0,
          });
          setSpin(true);
        }
      } catch (error) {
        const { response } = error;
        //const { request, ...errorObject } = response; // take everything but 'request'
        console.log(response.data.message);
        message.error(response.data.message);

        /* Modal.error({
          title: "Unable to Delete",
          content: response.data.message,
          centered: true,
          width: 450,
        }); */
      }
      //setLoading(false);
    }
    delData(config);
  };

  const columns = [
    {
      title: "Running Date",
      dataIndex: "startDate",
      key: "startDate",
      width:"25%",
      render: (date, record) => {
        //console.log("record", record);
        return (
          <>
            <Tag color={`geekblue`} key={record.id}>
              {moment(date).format("YYYY-MM-DD HH:mm")}
            </Tag>
            {" => "}
            <Tag color={`volcano`} key={`nth${record.id}`}>
              {moment(record.endDate).format("YYYY-MM-DD HH:mm")}
            </Tag>
            {/* <Tag color={`geekblue`} key={record.index}>
              {date.format("YYYY-MM-DD HH:mm")}
            </Tag>
            {" => "}
            <Tag color={`volcano`} key={record.index + 1}>
              {date.format("YYYY-MM-DD HH:mm")}
            </Tag> */}
          </>
        );
      },
    },

    {
      title: "Session Title",
      dataIndex: "title",
      key: "title",
      width:"50%",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "Status",
      dataIndex: "isActivetype",
      key: "isActivetype",
      width:"100px",
      render: (text, record) => {
        return text == "success" ? (
          <>
            <Tag color={`green`} key={record.id}>
              Active
            </Tag>
          </>
        ) : (
          <>
            <Tag color={`volcano`} key={record.id}>
              Inactive
            </Tag>
          </>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            key={`view-${record.id}`}
            type="link"
            onClick={() => onAddEditView("view", record)}
          >
            View
          </Button>
          {/* <Button type="link" onClick={() => onAddEditView("delete")}>Delete</Button> */}
          <Popconfirm
            title="Are you sure to delete this?"
            onConfirm={() => confirmDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button key={`view-${record.id}`} type="link">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <Row
      className="widget-container"
      /* gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }} */
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
              <Table
                columns={columns}
                dataSource={dateSessionList}
                pagination={{ defaultPageSize: 5 }}
                size="small"
                rowKey="id"
              />
            </Col>
          </Row>
          <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }}>
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
