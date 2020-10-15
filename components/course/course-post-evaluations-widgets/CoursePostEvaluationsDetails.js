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
  Plusevaluationd,
  MinusCircleevaluationd,
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
  catname: "Evaluations - Details",
  catValueLabel: "evaluationdetails",
};

const CoursePostEvaluationsDetails = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    course_id,
    allOutlines,
    userGroupList,
    setEvaluationType,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  //const [userGroupList, setUserGroupList] = useState([]);
  const chosenRows = defaultWidgetValues.evaluationdetails;
  let theRequired =
    chosenRows && chosenRows.length && chosenRows[0].isRequired == 1
      ? true
      : false;
  const [isRequiredChecked, setisRequiredChecked] = useState(theRequired);
  useEffect(() => {
    //chosenRows.length && console.log("isRequired",chosenRows[0].isRequired)
    chosenRows.length
      ? setisRequiredChecked(chosenRows[0].isRequired)
      : setisRequiredChecked(false);
  }, [chosenRows]);
  const groupOptions = userGroupList.map((usergroup, index) => {
    return (
      <Option key={index} value={usergroup.id}>
        {usergroup.name}
      </Option>
    );
  });

  const evaluationTypeList = [
    { id: 1, name: "Rating" },
    { id: 2, name: "Single Question" },
    { id: 3, name: "Comment" },
  ];
  const evaluationTypesOptions = evaluationTypeList.map((type, index) => {
    return (
      <Option key={index} value={type.id}>
        {type.name}
      </Option>
    );
  });

  function immediateOnChange(e) {
    setEvaluationType(e);
  }
  function requiredOnChange(e) {
    setisRequiredChecked(e.target.checked);
  }

  //console.log("Chosen Rows", chosenRows);
  //console.log(isRequiredChecked)
 
  return !chosenRows.length ? (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item
          label="Evaluation Title"
          name={["evaluationdetails", "title"]}
        >
          <Input placeholder="Evaluation Title" />
        </Form.Item>
        <Form.Item>
          <Form.Item
            name={["evaluationdetails", "userGroup"]}
            label="User Group"
            noStyle
          >
            <Select placeholder="User Group" size="medium">
              {groupOptions}
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Form.Item
            name={["evaluationdetails", "evaluationTypeId"]}
            label="Evaluation Type"
            noStyle
          >
            <Select
              placeholder="Evaluation Type"
              size="medium"
              /* style={{ width: "50%" }} */
              onChange={immediateOnChange}
            >
              {evaluationTypesOptions}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          name={["evaluationdetails", "isRequired"]}
          noStyle
          valuePropName="checked"
        >
          <Checkbox>Required</Checkbox>
        </Form.Item>

        <style jsx global>{`
          .course-evaluation-details .ant-form-item {
            display: inline-block;
            width: 30%;
            margin: 15px 8px;
          }
          .course-evaluation-details .ant-select-selector {
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
        <div className="evaluationWithValue">
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
                  name={["evaluationdetails", "title"]}
                  key={`${field.key}-title`}
                >
                  <Input placeholder={field.title} />
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name={["evaluationdetails", "userGroup"]}
                    label="User Group"
                    noStyle
                  >
                    <Select
                      placeholder={
                        field.usergroup ? field.usergroup : "User Group"
                      }
                      size="medium"
                    >
                      {groupOptions}
                    </Select>
                  </Form.Item>
                </Form.Item>
                <Form.Item>
                  <Form.Item
                    name={["evaluationdetails", "evaluationTypeId"]}
                    label="Evaluation Type"
                    noStyle
                  >
                    <Select
                      placeholder={
                        field.evaluationTypeName
                          ? field.evaluationTypeName
                          : "Evaluation Type"
                      }
                      size="medium"
                      /* style={{ width: "50%" }} */
                    >
                      {evaluationTypesOptions}
                    </Select>
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  name={["evaluationdetails", "isRequired"]}
                  noStyle
                  //valuePropName="checked"
                  valuePropName={
                    chosenRows[0].isRequired == 1 && isRequiredChecked
                      ? isRequiredChecked
                      : "checked"
                  }
                >
                  <Checkbox
                    checked={isRequiredChecked}
                    onChange={requiredOnChange}
                  >
                    Required
                  </Checkbox>
                </Form.Item>
              </div>
            );
          })}
        </div>
      </Form.Item>
      <style jsx global>{`
        .course-evaluation-details .ant-form-item {
          display: inline-block;
          width: 30%;
          margin: 15px 8px;
        }
        .course-evaluation-details .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </>
  );
};

export default CoursePostEvaluationsDetails;
