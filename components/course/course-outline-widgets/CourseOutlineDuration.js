import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import {
  Row,
  Modal,
  Card,
  Input,
  InputNumber,
  Form,
  Collapse,
  Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Outline - Duration",
  catValueLabel: "outlineduration",
};

const CourseOutlineDuration = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const { outlineduration } = defaultWidgetValues;
  //console.log(outlineduration)
  return (
    <>
      <Form.Item style={{ marginBottom: 0 }} className="course-duration-panel">
        <Form.Item name="outlineduration">
        <InputNumber
              min={1}
              placeholder="Numbers Only"
              style={{ width: "100%" }}
            />
         {/*  <Select placeholder={outlineduration?outlineduration:"Duration"} size="medium">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
          </Select> */}
        </Form.Item>
        <Form.Item>
          <div className="s-description">Minutes</div>
        </Form.Item>
      </Form.Item>

      <style jsx global>{`
        .course-duration-panel .ant-form-item {
          display: inline-block;
          width: 30%;
          margin: 0 8px;
        }
        .course-duration-panel .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CourseOutlineDuration;
