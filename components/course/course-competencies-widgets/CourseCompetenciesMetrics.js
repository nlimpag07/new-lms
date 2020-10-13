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
  catname: "Competency - Metrics",
  catValueLabel: "competencymetrics",
};

const CourseCompetenciesMetrics = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const { competencymetrics } = defaultWidgetValues;
  //console.log("competencymetrics", competencymetrics);
  var chosen =
    competencymetrics && competencymetrics.length ? competencymetrics[0] : null;
  var className = chosen ? "competencyWithValue" : "competencyWithNoValue";
  return (
    <div className={className}>
      <Input.Group compact>
        <Form.Item style={{ marginBottom: "10px", width: "30%" }}>
          <span>Lessons to Complete</span>
        </Form.Item>
        <Form.Item name={["competencymetrics", "lessonCompleted"]} noStyle>
          <InputNumber
            min={0}
            max={10}
            placeholder={chosen ? chosen.lessonCompleted : "Number of Lessons"}
            style={{ width: "50%", marginLeft: "15px" }}
          />
        </Form.Item>
      </Input.Group>
      <Input.Group compact>
        <Form.Item style={{ marginBottom: "10px", width: "30%" }}>
          <span>Milestones to Reach</span>
        </Form.Item>
        <Form.Item name={["competencymetrics", "milestonesReached"]} noStyle>
          <InputNumber
            min={0}
            max={10}
            placeholder={
              chosen ? chosen.milestonesReached : "Number of Lessons"
            }
            style={{ width: "50%", marginLeft: "15px" }}
          />
        </Form.Item>
      </Input.Group>
      <Input.Group compact>
        <Form.Item style={{ marginBottom: "10px", width: "30%" }}>
          <span>Assessments Submitted</span>
        </Form.Item>
        <Form.Item name={["competencymetrics", "assessmentsSubmitted"]} noStyle>
          <InputNumber
            min={0}
            max={10}
            placeholder={
              chosen ? chosen.assessmentsSubmitted : "Number of Assessments"
            }
            style={{ width: "50%", marginLeft: "15px" }}
          />
        </Form.Item>
      </Input.Group>
      <Input.Group compact>
        <Form.Item style={{ marginBottom: "10px", width: "30%" }}>
          <span>Final Grade</span>
        </Form.Item>
        <Form.Item name={["competencymetrics", "final"]} noStyle>
          <InputNumber
            min={0}
            max={10}
            placeholder={chosen ? chosen.final : "Final Grade"}
            style={{ width: "50%", marginLeft: "15px" }}
          />
        </Form.Item>
      </Input.Group>

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
    </div>
  );
};

export default CourseCompetenciesMetrics;
