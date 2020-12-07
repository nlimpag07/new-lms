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
  catname: "Picklist - Passing Grade",
  catValueLabel: "picklistpassinggrade",
};

const CourseWidgetPassingGrade = (props) => {
  const { shouldUpdate, showModal } = props;

  return (
    <>
      <Form.Item style={{ marginBottom: 0 }} className="course-PassingGrade-panel">
        <Form.Item
          name="passingGrade"
        >
          <InputNumber placeholder="Passing Grade" style={{ width: "100%" }} min={1} />
          {/* <Select placeholder="Passing Grade" size="medium">
              <Option value="75">75</Option>
              <Option value="80">80</Option>
              <Option value="85">85</Option>
              <Option value="90">90</Option>
              <Option value="95">95</Option>
              <Option value="100">100</Option>
            </Select>  */}           
        </Form.Item>
        <Form.Item>
          <div style={{ margin: '0 8px',display:'block' }}>%</div>            
        </Form.Item>
        
      </Form.Item>

      <style jsx global>{`
        .course-PassingGrade-panel .ant-form-item{
          display: inline-block;
          width:30%;
          margin:15px 8px;
        }
        .course-PassingGrade-panel .ant-select-selector{
          font-weight:normal !important;
          text-transform:Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CourseWidgetPassingGrade;
