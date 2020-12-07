import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import { Row, Modal, Card, Input, InputNumber, Form, Collapse, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Picklist - Capacity",
  catValueLabel: "picklistcapacity",
};

const CourseWidgetCapacity = (props) => {
  const { shouldUpdate, showModal } = props;

  return (
    <>
      <Form.Item style={{ marginBottom: 0 }} className="course-capacity-panel">
        <Form.Item
          name="capacity"
        >
          <InputNumber placeholder="Capacity" style={{ width: "100%" }} min={1} />
          {/* <Select placeholder="Capacity" size="medium">
              <Option value="75">75</Option>
              <Option value="80">80</Option>
              <Option value="85">85</Option>
              <Option value="90">90</Option>
              <Option value="95">95</Option>
              <Option value="100">100</Option>
            </Select> */}            
        </Form.Item>
        <Form.Item>
          <div className="s-description">Learners</div>            
        </Form.Item>
        
      </Form.Item>

      <style jsx global>{`
        .course-capacity-panel .ant-form-item{
          display: inline-block;
          width:30%;
          margin:15px 8px;
        }
        .course-capacity-panel .s-description{ margin: 0 8px;display:block;text-transform:Capitalize !important; font-weight:normal !important;}
        .course-capacity-panel .ant-select-selector{
          font-weight:normal !important;
          text-transform:Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CourseWidgetCapacity;
