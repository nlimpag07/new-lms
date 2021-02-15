import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { Input, InputNumber, Form, Radio, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InfoCircleFilled } from "@ant-design/icons";

const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Assessment - Duration",
  catValueLabel: "assessmentduration",
};

const CourseAssessmentsDuration = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    course_id,
    allOutlines,
    setAssessBaseType,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userGroupList, setUserGroupList] = useState([]);
  const chosenRows = defaultWidgetValues.assessmentduration;
  const [isDurationBased, setisDurationBased] = useState(0);
  
  useEffect(() => {
    
   
    chosenRows.length? setisDurationBased(chosenRows[0].basedType):setisDurationBased(0);
  }, [chosenRows]);

  function immediateOnChange(e) {
    setisDurationBased(e.target.value);
    setAssessBaseType(e.target.value);   
  }  
  return !chosenRows.length ? (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item
          label="Duration Type"
          name={["assessmentduration", "basedType"]}
          style={{ marginBottom: "10px" }}
          valuePropName={isDurationBased}
        >
          <Radio.Group onChange={immediateOnChange} value={isDurationBased} >
            <Radio value={0}>No Limit</Radio>
            <Radio value={1}>Exam-based</Radio>
            <Radio value={2}>Question-based</Radio>
          </Radio.Group>
        </Form.Item>
        {isDurationBased === 1 && (
          <Form.Item style={{ marginBottom: "10px" }}>
            <Form.Item name={["assessmentduration", "examDuration"]} noStyle>
              <InputNumber
                min={0}
                max={500}
                placeholder="Exam Duration (Minutes)"
                style={{ width: "50%" }}
              />
            </Form.Item>
            <span style={{ fontStyle: "italic", color: "#999999" }}>
              {" "}
              <InfoCircleFilled /> (Mins) Assessment Time Limit
            </span>
          </Form.Item>
        )}
        <style jsx global>{`
          .course-assessment-details .ant-form-item {
            display: inline-block;
            width: 30%;
            margin: 15px 8px;
          }
          .course-assessment-details .ant-select-selector {
            font-weight: normal !important;
            text-transform: Capitalize !important;
          }
        `}</style>
      </Form.Item>
    </>
  ) : (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item
          label="Duration Type"
          name={["assessmentduration", "basedType"]}
          style={{ marginBottom: "10px" }}
          valuePropName={isDurationBased}
        >
          <Radio.Group onChange={immediateOnChange} value={isDurationBased} >
            <Radio value={0}>No Limit</Radio>
            <Radio value={1}>Exam-based</Radio>
            <Radio value={2}>Question-based</Radio>
          </Radio.Group>
        </Form.Item>
        {isDurationBased === 1 && (
          <Form.Item style={{ marginBottom: "10px" }}>
            <Form.Item name={["assessmentduration", "examDuration"]} noStyle valuePropName={chosenRows[0].examDuration}>
              <InputNumber
                min={0}
                max={500}
                placeholder={chosenRows[0].examDuration?chosenRows[0].examDuration:"Exam Duration (Minutes)"}
                style={{ width: "50%" }}
                //value={chosenRows[0].examDuration}
              />
            </Form.Item>
            <span style={{ fontStyle: "italic", color: "#999999" }}>
              {" "}
              <InfoCircleFilled /> (Mins) Assessment Time Limit
            </span>
          </Form.Item>
        )}
        <style jsx global>{`
          .course-assessment-details .ant-form-item {
            display: inline-block;
            width: 30%;
            margin: 15px 8px;
          }
          .course-assessment-details .ant-select-selector {
            font-weight: normal !important;
            text-transform: Capitalize !important;
          }
        `}</style>
      </Form.Item>
    </>
  );
};

export default CourseAssessmentsDuration;
