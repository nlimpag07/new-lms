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
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userGroupList, setUserGroupList] = useState([]);
  const chosenRows = defaultWidgetValues.assessmentdetails;
  const [isImmediateChecked, setisImmediateChecked] = useState(true);
  useEffect(() => {
    var config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      await axios
        .all([axios.get(apiBaseUrl + "/Settings/usergroup", config)])
        .then(
          axios.spread((usergroup) => {
            !usergroup.data.response
              ? setUserGroupList(usergroup.data.result)
              : setUserGroupList([]);
          })
        )
        .catch((errors) => {
          // react on errors.
          console.error(errors);
        });
      /* const response = await axios(config);
      if (response) {
        setUserGroupList(response.data.result);
        console.log(response.data.result);
      } else {
      } */
      //setLoading(false);
    }

    fetchData(config);
  }, []);

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
    //console.log(`checked = ${e.target.checked}`);
  }
  const onDateChange = (date, dateString) => {
    console.log(date, dateString);
    console.log("startDate", dateString[0]);
    console.log("===================");
    console.log("endDate", dateString[1]);
  };
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
              {/* <Option value="1">Administrator</Option>
              <Option value="2">Human Resource</Option>
              <Option value="3">Manager</Option> */}
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
                {/* <Option value="1">Administrator</Option>
                <Option value="2">Human Resource</Option>
                <Option value="3">Manager</Option> */}
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
          <Form.Item name={["assessmentdetails", "isImmediate"]} noStyle valuePropName="checked">
            <Checkbox onChange={immediateOnChange}>
              Immediate
            </Checkbox>
          </Form.Item>
          <span style={{ fontStyle: "italic", color: "#999999" }}>
            {" "}<InfoCircleFilled /> needs to be completed right after the course
          </span>
        </Form.Item>
        {!isImmediateChecked && (
          <Form.Item>
            <Form.Item name={["assessmentdetails", "deadlineRange"]} noStyle>
              <RangePicker onChange={onDateChange} style={{ width: "60%" }} />
            </Form.Item>
            <span style={{ fontStyle: "italic", color: "#999999" }}>
              {" "}<InfoCircleFilled /> Set a deadline
            </span>
          </Form.Item>
        )}
         <Divider orientation="left" plain style={{ fontWeight: "500" }}>
          Assessment Retakes
        </Divider>
        <Form.Item style={{ marginBottom: "10px" }}>          
          <Form.Item
            name={["assessmentdetails", "attempts"]}            
            noStyle
          ><Input placeholder="Number of Attempts" style={{ width: "50%" }} />            
          </Form.Item>
          <span style={{ fontStyle: "italic", color: "#999999" }}>
            {" "}<InfoCircleFilled /> 0 for unlimited attempts
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
        <Form.List name={widgetFieldLabels.catValueLabel}>
          {(fields, { add, remove }) => {
            return (
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
                        label="assessment Title"
                        name={[field.name, "assessmenttitle"]}
                        key={`${field.key}-title`}
                      >
                        <Input
                          placeholder={field.title}
                          //defaultValue={field.title}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Input.Group
                          compact
                          className="course-assessment-details"
                        >
                          <Form.Item
                            name={[field.name, "usergroup"]}
                            label="User Group"
                            noStyle
                          >
                            <Select
                              placeholder={`${field.usergroup}`}
                              size="medium"
                              style={{ width: "50%" }}
                              //defaultActiveFirstOption={`${field.usergroupid}`}
                            >
                              <Option value="1">Administrator</Option>
                              <Option value="2">Human Resource</Option>
                              <Option value="3">Manager</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item name={[field.name, "visibility"]} noStyle>
                            <Select
                              placeholder={`${
                                field.visibility == 1 ? "Private" : "Public"
                              }`}
                              size="medium"
                              style={{ width: "50%" }}
                            >
                              <Option value="0">Public</Option>
                              <Option value="1">Private</Option>
                            </Select>
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                      <Form.Item name={[field.name, "description"]}>
                        <TextArea
                          rows={5}
                          placeholder={`${field.description}`}
                        />
                      </Form.Item>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </Form.List>
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

export default CourseAssessmentsDuration;
