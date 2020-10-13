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
  catname: "Competency - Details",
  catValueLabel: "competencydetails",
};

const CourseCompetenciesDetails = (props) => {
  const {
    shouldUpdate,
    showModal,
    competency,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const chosenRows = defaultWidgetValues.competencydetails;
  /* useEffect(() => {
    console.log(chosenRows);
  }, [competency]); */
  //console.log(chosenRows);
  //return competency?(title):("Nothing");
  //console.log('Outline',competency);
  return !chosenRows.length ? (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item
          label="Competency Title"
          name={["competencydetails", "competencytitle"]}
        >
          <Input placeholder="Competency Title" />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name={["competencydetails", "usergroup"]}
            label="User Group"
            noStyle
          >
            <Select placeholder="User Group" size="medium">
              <Option value="1">Administrator</Option>
              <Option value="2">Human Resource</Option>
              <Option value="3">Manager</Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item name={["competencydetails", "competencydescription"]}>
          <TextArea rows={5} placeholder="Description" />
        </Form.Item>

        <style jsx global>{`
          .course-competency-details .ant-form-item {
            display: inline-block;
            width: 30%;
            margin: 15px 8px;
          }
          .course-competency-details .ant-select-selector {
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
        <div className="competencyWithValue">
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
                  label="Competency Title"
                  name={["competencydetails", "competencytitle"]}
                  key={`${field.key}-title`}
                >
                  <Input
                    placeholder={field.title}
                    //defaultValue={field.title}
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name={["competencydetails", "usergroup"]}
                    label="User Group"
                    noStyle
                  >
                    <Select placeholder={field.usergroup} size="medium">
                      <Option value="1">Administrator</Option>
                      <Option value="2">Human Resource</Option>
                      <Option value="3">Manager</Option>
                    </Select>
                  </Form.Item>
                </Form.Item>                
                <Form.Item name={["competencydetails", "description"]}>
                  <TextArea rows={5} placeholder={`${field.description}`} />
                </Form.Item>
              </div>
            );
          })}
        </div>
      </Form.Item>

      <style jsx global>{`
        .course-competency-details .ant-form-item {
          display: inline-block;
          width: 30%;
          margin: 15px 8px;
        }
        .course-competency-details .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CourseCompetenciesDetails;
