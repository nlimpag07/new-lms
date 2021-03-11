import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Row,
  Col,
  Spin,
  Input,
  Form,
  Select,
  Button,
  message,
  Tag,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import moment from "moment";
import { CompactPicker, AlphaPicker, CirclePicker } from "react-color";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const PreassessmentsDetails = ({
  PreassessmentData,
  dataProps,
  hideModal,
  setRunSpin,
  categories,
}) => {
  console.log("dataProps", dataProps);
  const { userFullName, id, createdAt, userId } = dataProps;

  const router = useRouter();
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });

  useEffect(() => {}, []);

  var lastSelectedIndex = 0;
  const the_data =
    PreassessmentData && PreassessmentData.length ? PreassessmentData : [];
  const ddata = the_data.filter((dataItem) => dataItem.userId === userId);
  //console.log("ddata", ddata);
  //const [Data, setData] = useState(ddata);

  const QuestionsAnswers =
    ddata.length &&
    ddata.map((data, index) => {
      //console.log("data", data);
      let splitRes = data.result.split("/");
      const q = splitRes[0];
      const a = splitRes[1];
      let catList = data.category.length
        ? data.category.map((cat, index) => {
            return <Tag key={index}>{cat.name}</Tag>;
          })
        : [];
      return (
        <div className="q_container" key={`qh-${index}`}>
          <div className="q_holder">{q}</div>
          <div className="a_holder">{a}</div>
          <div className="c_holder">{catList}</div>
        </div>
      );
    });

  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Col xs={24} sm={24} md={12}>
        Student Name: {userFullName}
      </Col>
      <Col xs={24} sm={24} md={12}>
        Date Taken: {moment(createdAt).format("YYYY-MM-DD h:mm a")}
      </Col>
      <Col xs={24} sm={24} md={24} style={{ marginTop: "2rem" }}>
        {QuestionsAnswers}
      </Col>
      <style jsx global>{`
        .colorAvatar:hover {
          cursor: pointer;
        }
        #detailsPicklistPreassessments {
          position: relative;
          width: 100%;
        }
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          padding: 5% 0;
        }
        .q_container {
          margin-bottom: 1rem;
        }
        .q_holder,
        .a_holder,
        .c_holder {
          padding: 0.2rem 0;
        }
      `}</style>
    </Row>
  );
};
const categoryRender = (props) => {
  console.log("props", props.dataItem);
  let theCat =
    props.dataItem && props.dataItem.category ? props.dataItem.category : [];
  let catListRender = theCat.length
    ? theCat.map((cat, index) => {
        return <Tag key={index}>{cat.categoryName}</Tag>;
      })
    : [];
  return <td>{catListRender}</td>;
};

export default PreassessmentsDetails;
