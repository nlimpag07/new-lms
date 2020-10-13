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
import { PlusOutcomed, MinusCircleOutcomed } from "@ant-design/icons";
/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Outcome - Details",
  catValueLabel: "outcomedetails",
};

const CourseOutcomeDetails = (props) => {
  const {
    shouldUpdate,
    showModal,
    outcome,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { title, description, visibility, userGroupId } = outcome;
  const chosenRows = defaultWidgetValues.outcomedetails;
  /* useEffect(() => {
    console.log(chosenRows);
  }, [outcome]); */
  //console.log(chosenRows);
  //return outcome?(title):("Nothing");
  return !chosenRows.length ? (
    <div className="outComeNoValue">
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}        
      >
        <Form.Item
          label="Outcome Title"
          name={["outcomedetails", "outcometitle"]}
        >
          <Input placeholder="Outcome Title" />
        </Form.Item>
        <Form.Item>
          <Input.Group compact className="course-outcome-details">
            <Form.Item
              name={["outcomedetails", "usergroup"]}
              label="User Group"
              noStyle
            >
              <Select
                placeholder="User Group"
                size="medium"
                style={{ width: "50%" }}
              >
                <Option value="1">Administrator</Option>
                <Option value="2">Human Resource</Option>
                <Option value="3">Manager</Option>
              </Select>
            </Form.Item>
            <Form.Item name={["outcomedetails", "visibility"]} noStyle>
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
        <Form.Item name={["outcomedetails", "description"]}>
          <TextArea rows={5} placeholder="Outcome Description" />
        </Form.Item>

        <style jsx global>{`
          .course-outcome-details .ant-form-item {
            display: inline-block;
            width: 30%;
            margin: 15px 8px;
          }
          .course-outcome-details .ant-select-selector {
            font-weight: normal !important;
            text-transform: Capitalize !important;
          }
        `}</style>
      </Form.Item>
    </div>
  ) : (
    <div className="outComeWithValue">
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
        
      >
        
              <>
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
                        label="Outcome Title"
                        name={["outcomedetails", "outcometitle"]}
                        key={`${field.key}-title`}
                      >
                        <Input
                          placeholder={field.title}
                          //defaultValue={field.title}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Input.Group compact className="course-outcome-details">
                          <Form.Item
                            name={["outcomedetails", "usergroup"]}
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
                          <Form.Item name={["outcomedetails", "visibility"]} noStyle>
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
                      <Form.Item
                        name={["outcomedetails", "description"]}
                      >
                        <TextArea rows={5} placeholder={`${field.description}`} />
                      </Form.Item>
                    </div>
                  );
                })}
              </>
      </Form.Item>
      
      <style jsx global>{`
        .course-outcome-details .ant-form-item {
          display: inline-block;
          width: 30%;
          margin: 15px 8px;
        }
        .course-outcome-details .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </div>
  );
};

export default CourseOutcomeDetails;
