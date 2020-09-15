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
  catname: "Outline - Details",
  catValueLabel: "outlinedetails",
};

const CourseOutlineDetails = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const { duration } = defaultWidgetValues;
  return (
    <>
      <Form.Item
        label="Outline Title"
        name="outlinetitle"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input placeholder="Outline Title" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Group compact className="course-outline-details">
          <Form.Item name="userGroup" label="User Group" noStyle>
            <Select
              placeholder="User Group"
              size="medium"
              style={{ width: "50%" }}
              /* rules={[
                {
                  required: true,
                  message: "Please select User Group",
                },
              ]} */
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
              <Option value="6">6</Option>
              <Option value="7">7</Option>
            </Select>
          </Form.Item>
          <Form.Item name="visibility" noStyle>
            <Select
              placeholder="Visibility"
              size="medium"
              style={{ width: "50%" }}
            >
              <Option value="0">Public</Option>
              <Option value="1">Private</Option>
            </Select>
          </Form.Item>
        </Input.Group>
      </Form.Item>
      <Form.Item name="description">
        <TextArea
          rows={5}
          placeholder="Outline Description"
          /* onChange={onChange} */
        />
      </Form.Item>
      <style jsx global>{`
        .course-outline-details .ant-form-item {
          display: inline-block;
          width: 30%;
          margin: 15px 8px;
        }
        .course-outline-details .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CourseOutlineDetails;
