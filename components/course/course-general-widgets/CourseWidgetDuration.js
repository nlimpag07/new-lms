import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import {
  Row,
  Modal,
  Card,
  Input,
  InputNumber,
  Form,
  Collapse,
  Select,
  TimePicker,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Picklist - Duration",
  catValueLabel: "picklistduration",
};

const CourseWidgetDuration = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const { duration } = defaultWidgetValues;
  const format = "HH:mm";

  return (
    <>
      <Form.Item style={{ marginBottom: 0 }} className="course-duration-panel">
        <Form.Item
          name="durationTime"
        >
          {/* <TimePicker
            format={format}
            showNow={false}
            placeholder="Select Time (H:M)"
          /> */}
          <InputNumber min={1} placeholder="Enter Number" style={{width:"100%"}} />
        </Form.Item>
        <Form.Item
          name="durationType"
        >
          <Select placeholder="Duration Type" size="medium">
            <Option value="Minutes">Minutes</Option>
            <Option value="Hours">Hours</Option>
            <Option value="Days">Days</Option>
          </Select>
        </Form.Item>
      </Form.Item>

      <style jsx global>{`
        .course-duration-panel .ant-form-item {
          display: inline-block;
          width: 30%;
          margin: 15px 8px;
        }
        .course-duration-panel .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CourseWidgetDuration;
