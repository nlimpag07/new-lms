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
    outline,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const chosenRows = defaultWidgetValues.outlinedetails;
  /* useEffect(() => {
    console.log(chosenRows);
  }, [outline]); */
  //console.log(chosenRows);
  //return outline?(title):("Nothing");
  //console.log('Outline',outline);
  return !chosenRows.length ? (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item
          label="Outline Title"
          name={["outlinedetails", "outlinetitle"]}
        >
          <Input placeholder="Outline Title" />
        </Form.Item>
        <Form.Item>
          <Input.Group compact className="course-outline-details">
            <Form.Item
              name={["outlinedetails", "usergroup"]}
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
            <Form.Item name={["outlinedetails", "visibility"]} noStyle>
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
        <Form.Item name={["outlinedetails", "outlinedescription"]}>
          <TextArea rows={5} placeholder="Outline Description" />
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
        <div className="outlineWithValue">
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
                  label="Outline Title"
                  name={["outlinedetails", "outlinetitle"]}
                  key={`${field.key}-title`}
                >
                  <Input
                    placeholder={field.title}
                    //defaultValue={field.title}
                  />
                </Form.Item>
                <Form.Item>
                  <Input.Group compact className="course-outline-details">
                    <Form.Item
                      name={["outlinedetails", "usergroup"]}
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
                    <Form.Item name={["outlinedetails", "visibility"]} noStyle>
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
                <Form.Item name={["outlinedetails", "description"]}>
                  <TextArea rows={5} placeholder={`${field.description}`} />
                </Form.Item>
              </div>
            );
          })}
        </div>
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
