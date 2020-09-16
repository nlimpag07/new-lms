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
  const { title, description, visibility, userGroupId } = outline;
  const chosenRows = defaultWidgetValues.outlinedetails;
  /* useEffect(() => {
    console.log(chosenRows);
  }, [outline]); */
  // console.log(chosenRows);
  //return outline?(title):("Nothing");
  return !chosenRows.length ? (
    <>
      <Form.List name={widgetFieldLabels.catValueLabel}>
        {(fields, { add, remove }) => {
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
              <Form.Item name="outlinedescription">
                <TextArea rows={5} placeholder="Outline Description" />
              </Form.Item>
            </>
          );
        }}
      </Form.List>
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
  ) : (
    <>
      <Form.List name={widgetFieldLabels.catValueLabel}>
        {(fields, { add, remove }) => {
          //console.log(chosenRows);
          return (
            <>
              {chosenRows.map((field, index) => {
                field = {
                  ...field,
                  key: index,
                };
                console.log("Individual Fields:", field);
                return (
                  <div key={field.key}>
                    {/* <Form.Item
                      key={field.key}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        placeholder={widgetFieldLabels.catname}
                        value={field.title}
                      />
                    </Form.Item> */}
                    <Form.Item
                      label="Outline Title"
                      key={`${field.key}-title`}
                      /*  rules={[
                        {
                          required: true,
                        },
                      ]} */
                    >
                      <Input placeholder="Outline Title" value={field.title} />
                    </Form.Item>
                    <Form.Item>
                      <Input.Group compact className="course-outline-details">
                        <Form.Item name="userGroup" label="User Group" noStyle>
                          <Select
                            placeholder="User Group"
                            size="medium"
                            style={{ width: "50%" }}
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
                    <Form.Item name="outlinedescription">
                      <TextArea rows={5} placeholder="Outline Description" />
                    </Form.Item>

                    {/* <Form.Item
                      noStyle
                      key={field.key}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        placeholder={widgetFieldLabels.catname}
                        style={{ width: "85%" }}
                        key={field.key}
                        value={field.value}
                        readOnly
                      />
                    </Form.Item> */}
                  </div>
                );
              })}
            </>
          );
        }}
      </Form.List>
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
