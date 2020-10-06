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
  Collapse,
  Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Plusassessmentd, MinusCircleassessmentd } from "@ant-design/icons";
/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;

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
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [userGroupList, setUserGroupList] = useState([]);
  const chosenRows = defaultWidgetValues.assessmentdetails;
  /* useEffect(() => {
    console.log(chosenRows);
  }, [assessment]); */
  //console.log(chosenRows);
  //return assessment?(title):("Nothing");
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
        <Form.Item name={["assessmentdetails", "assessmentdescription"]}>
          <TextArea rows={5} placeholder="assessment Description" />
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

export default CourseAssessmentsDetails;
