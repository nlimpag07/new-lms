import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import axios from "axios";

import {
  Row,
  Modal,
  Card,
  Input,
  InputNumber,
  Form,
  Checkbox,
  Select,
  DatePicker,
  Divider,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Plusassessmentd,
  MinusCircleassessmentd,
  InfoCircleFilled,
} from "@ant-design/icons";
/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Assessment - Details",
  catValueLabel: "assessmentdetails",
};

const CourseAssessmentsDetails = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    course_id,
    allOutlines,
    userGroupList,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  //const [userGroupList, setUserGroupList] = useState([]);
  const chosenRows = defaultWidgetValues.assessmentdetails;
  let theImmediate =
    chosenRows && chosenRows.length ? chosenRows[0].isImmediate : false;
  const [isImmediateChecked, setisImmediateChecked] = useState(theImmediate);

  useEffect(() => {   
    chosenRows.length
      ? setisImmediateChecked(chosenRows[0].isImmediate)
      : setisImmediateChecked(false);
  }, [chosenRows]);

  const groupOptions = userGroupList.map((usergroup, index) => {
    return (
      <Option key={index} value={usergroup.id}>
        {usergroup.name}
      </Option>
    );
  });

  const outlineOptions = allOutlines.map((outline, index) => {
    return (
      <Option key={index} value={outline.id}>
        {outline.title}
      </Option>
    );
  });
  function immediateOnChange(e) {
    setisImmediateChecked(e.target.checked);
  }
  const onDateChange = (date, dateString) => {

  };

  const dateFormat = "YYYY-MM-DD";
  return !chosenRows.length ? (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item
          label="Assessment Title"
          name={["assessmentdetails", "assessmenttitle"]}
        >
          <Input placeholder="Assessment Title" />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name={["assessmentdetails", "assessmentTypeId"]}
            label="Assessment type"
            noStyle
          >
            <Select placeholder="Assessment type" size="medium">
              <Option value="1">Assignment</Option>
              <Option value="2">Exam</Option>
              <Option value="3">Quiz</Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Form.Item
            name={["assessmentdetails", "courseOutlineId"]}
            label="Linked Course Outline"
            noStyle
          >
            <Select placeholder="Linked Course Outline" size="medium">
              {outlineOptions}
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Input.Group compact className="course-assessment-details">
            <Form.Item
              name={["assessmentdetails", "userGroup"]}
              label="User Group"
              noStyle
            >
              <Select
                placeholder="User Group"
                size="medium"
                style={{ width: "50%" }}
              >
                {groupOptions}
              </Select>
            </Form.Item>
            <Form.Item name={["assessmentdetails", "passingGrade"]} noStyle>
              <Select
                placeholder="Passing Grade"
                size="medium"
                style={{ width: "50%" }}
              >
                <Option value="75">75</Option>
                <Option value="80">80</Option>
                <Option value="85">85</Option>
                <Option value="90">90</Option>
                <Option value="95">95</Option>
                <Option value="100">100</Option>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Divider orientation="left" plain style={{ fontWeight: "500" }}>
          Assessment Completion
        </Divider>
        <Form.Item style={{ marginBottom: "10px" }}>
          <Form.Item
            name={["assessmentdetails", "isImmediate"]}
            noStyle
            valuePropName="checked"
          >
            <Checkbox onChange={immediateOnChange}>Immediate</Checkbox>
          </Form.Item>
          <span style={{ fontStyle: "italic", color: "#999999" }}>
            {" "}
            <InfoCircleFilled /> needs to be completed right after the course
          </span>
        </Form.Item>
        {!isImmediateChecked && (
          <Form.Item>
            <Form.Item name={["assessmentdetails", "deadlineDate"]} noStyle>
              <RangePicker format={dateFormat} style={{ width: "60%" }} />
            </Form.Item>
            <span style={{ fontStyle: "italic", color: "#999999" }}>
              {" "}
              <InfoCircleFilled /> Set a deadline
            </span>
          </Form.Item>
        )}
        <Divider orientation="left" plain style={{ fontWeight: "500" }}>
          Assessment Retakes
        </Divider>
        <Form.Item style={{ marginBottom: "10px" }}>
          <Form.Item name={["assessmentdetails", "attempts"]} noStyle>
            <InputNumber
              min={0}
              max={10}
              placeholder="Number of Attempts"
              style={{ width: "50%" }}
            />
          </Form.Item>
          <span style={{ fontStyle: "italic", color: "#999999" }}>
            {" "}
            <InfoCircleFilled /> 0 for unlimited attempts
          </span>
        </Form.Item>
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
        <div className="assessmentWithValue">
          {chosenRows.map((field, index) => {
            field = {
              ...field,
              name: index,
              key: index,
            };
            //console.log("Individual Fields:", field);
            return (
              <div key={field.key}>
                <Form.Item
                  label="Assessment Title"
                  name={["assessmentdetails", "assessmenttitle"]}
                  key={`${field.key}-title`}
                >
                  <Input placeholder={field.title} />
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name={["assessmentdetails", "assessmentTypeId"]}
                    label="Assessment type"
                    noStyle
                  >
                    <Select
                      size="medium"
                      placeholder={field.assessmentTypeName}
                    >
                      <Option value="1">Assignment</Option>
                      <Option value="2">Exam</Option>
                      <Option value="3">Quiz</Option>
                    </Select>
                  </Form.Item>
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name={["assessmentdetails", "courseOutlineId"]}
                    label="Linked Course Outline"
                    noStyle
                  >
                    <Select placeholder={field.courseOutlineName} size="medium">
                      {outlineOptions}
                    </Select>
                  </Form.Item>
                </Form.Item>
                <Form.Item>
                  <Input.Group compact className="course-assessment-details">
                    <Form.Item
                      name={["assessmentdetails", "userGroup"]}
                      label="User Group"
                      noStyle
                    >
                      <Select
                        placeholder={field.userGroup}
                        size="medium"
                        style={{ width: "50%" }}
                      >
                        {groupOptions}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={["assessmentdetails", "passingGrade"]}
                      noStyle
                    >
                      <Select
                        placeholder={`${field.passingGrade} %`}
                        size="medium"
                        style={{ width: "50%" }}
                      >
                        <Option value="75">75</Option>
                        <Option value="80">80</Option>
                        <Option value="85">85</Option>
                        <Option value="90">90</Option>
                        <Option value="95">95</Option>
                        <Option value="100">100</Option>
                      </Select>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                <Divider orientation="left" plain style={{ fontWeight: "500" }}>
                  Assessment Completion
                </Divider>
                <Form.Item style={{ marginBottom: "10px" }}>
                  <Form.Item
                    name={["assessmentdetails", "isImmediate"]}
                    noStyle
                    valuePropName={chosenRows[0].isImmediate==true && isImmediateChecked?isImmediateChecked:"checked"}
                    //valuePropName="checked"
                  >
                    <Checkbox
                      /* value={isImmediateChecked}*/
                      checked={isImmediateChecked} 
                      onChange={immediateOnChange}
                    >
                      Immediate
                    </Checkbox>
                  </Form.Item>
                  <span style={{ fontStyle: "italic", color: "#999999" }}>
                    {" "}
                    <InfoCircleFilled /> needs to be completed right after the
                    course
                  </span>
                </Form.Item>
                {!isImmediateChecked && (
                  <Form.Item>
                    <Form.Item
                      name={["assessmentdetails", "deadlineDate"]}
                      noStyle
                    >
                      <RangePicker
                        format={dateFormat}
                        placeholder={[field.fromDate, field.toDate]}
                        style={{ width: "60%" }}
                      />
                    </Form.Item>
                    <span style={{ fontStyle: "italic", color: "#999999" }}>
                      {" "}
                      <InfoCircleFilled /> Set a deadline
                    </span>
                  </Form.Item>
                )}
                <Divider orientation="left" plain style={{ fontWeight: "500" }}>
                  Assessment Retakes
                </Divider>
                <Form.Item style={{ marginBottom: "10px" }}>
                  <Form.Item name={["assessmentdetails", "attempts"]} noStyle>
                    <InputNumber
                      min={0}
                      max={10}
                      placeholder={field.attempts}
                      style={{ width: "50%" }}
                    />
                  </Form.Item>
                  <span style={{ fontStyle: "italic", color: "#999999" }}>
                    {" "}
                    <InfoCircleFilled /> 0 for unlimited attempts
                  </span>
                </Form.Item>
              </div>
            );
          })}
        </div>
      </Form.Item>
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
    </>
  );
};

export default CourseAssessmentsDetails;
