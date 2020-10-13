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
  Radio,
  Select,
  Checkbox,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseOutlined,
  InfoCircleFilled,
} from "@ant-design/icons";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Assessment - Items",
  catValueLabel: "assessmentitems",
};

const CourseAssessmentsItems = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    assessBaseType,
  } = props;
  //console.log("Base Type: ", assessBaseType);
  var assItemList = defaultWidgetValues.assessmentConstItems;
  var chosenRows = defaultWidgetValues.assessmentitems;
  /* if(chosenRows.length){
    let choosed = chosenRows.map((chosen,index)=>{
      let newOutline = assItemList.filter((outline)=>chosen.preRequisiteId == outline.id)
      chosen['title']= newOutline[0].title;
      return chosen;
    })
    chosenRows = choosed;
  } */
  console.log('Chosen Rows',chosenRows);
  /* useEffect(() => {
    var data = JSON.stringify({});
    var config = {
      method: "get",
      url: apiBaseUrl + "/picklist/outline",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        setassItemList(response.data.result);
        //console.log(response.data)
      } else {
        console.log(
          "Network Error: Please contact your administrator to fix this issue."
        );
      }
    }
    fetchData(config);
  }, []); */

  const onRemove = (name) => {
    let newValues = chosenRows.filter((value) => value.name !== name);
    console.log("NewValues:", newValues);
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      assessmentitems: newValues,
    });
  };

  return (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        shouldUpdate={shouldUpdate}
      >
        {({ getFieldValue }) => {
          var thisPicklist =
            getFieldValue(widgetFieldLabels.catValueLabel) || [];
          if (thisPicklist.length) {
            //console.log('received picklist value: ', thisPicklist);
            return (
              <Form.List name={widgetFieldLabels.catValueLabel}>
                {(fields, { add, remove }) => {
                  return (
                    <Row className="" gutter={[4, 8]}>
                      {thisPicklist.map((field, index) => {
                        field = {
                          ...field,                          
                          key: index,
                          value: field.name,
                          id: field.id,
                        };
                        //console.log('Individual Fields:', field)
                        return (
                          <div key={field.key}>
                            <Form.Item
                              required={false}
                              key={field.key}
                              gutter={[16, 16]}
                            >
                              <Form.Item
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
                              </Form.Item>
                              {fields.length >= 1 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ margin: "0 8px" }}
                                  key={`del-${field.key}`}
                                  onClick={() => {
                                    remove(field.name);
                                    onRemove(field.value);
                                  }}
                                />
                              ) : null}
                            </Form.Item>
                          </div>
                        );
                      })}
                    </Row>
                  );
                }}
              </Form.List>
            );
          } else {
            //NLI: EDIT COURSE: ---This is used in edit course
            //console.log(chosenRows)
            if (chosenRows) {
              return (
                <Form.List name={widgetFieldLabels.catValueLabel}>
                  {(fields, { add, remove }) => {
                    return (
                      <Row className="" gutter={[4, 8]}>
                        {chosenRows.map((field, index) => {
                          field = {
                            ...field,
                            key: index,
                            value: field.name,
                          };
                          //console.log("ChosenRows Individual Fields:", field);
                          return (
                            <div key={field.key}>
                              <Form.Item
                                required={false}
                                key={field.key}
                                gutter={[16, 16]}
                              >
                                <Form.Item
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
                                </Form.Item>
                                {chosenRows.length >= 1 ? (
                                  <CloseOutlined
                                    className="dynamic-delete-button"
                                    style={{ margin: "0 8px" }}
                                    key={`del-${field.key}`}
                                    onClick={() => {
                                      remove(field.name);
                                      onRemove(field.value);
                                    }}
                                  />
                                ) : null}
                              </Form.Item>
                            </div>
                          );
                        })}
                      </Row>
                    );
                  }}
                </Form.List>
              );
            }
          }
        }}
      </Form.Item>
      <span>
        <PlusOutlined
          onClick={() =>
            showModal(
              widgetFieldLabels.catname,
              widgetFieldLabels.catValueLabel,
              () => modalFormBody(assItemList, chosenRows, assessBaseType)
            )
          }
        />
      </span>
      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (assItemList, chosenRows, assessBaseType) => {
  const data = [];
  //console.log('chosenRows on Modal',chosenRows)
  var last = chosenRows.length ? chosenRows[chosenRows.length - 1].id+1 : 0;
  last = last ? last : 0;
  const [questionType, setquestionType] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {}, []);

  const questionTypeOnChange = (value) => {
    console.log("Selected Value: ", value);
    setquestionType(value);
  };
  return (
    <Form.Item style={{ marginBottom: "0px" }}>
      <Form.Item name={["assessmentitems", "id"]} initialValue={last} hidden>
        <Input value={last} />
      </Form.Item>
      <Form.Item
        name={["assessmentitems", "assessmentItemTypeId"]}
        label="Question Type"
        rules={[
          {
            required: true,
            message: "Please Select Question Type!",
          },
        ]}
      >
        <Select
          placeholder="Select a Question Type"
          size="medium"
          style={{ marginBottom: "0px" }}
          value={questionType}
          onChange={questionTypeOnChange}
        >
          <Option value={1}>Essay</Option>
          <Option value={2}>Multiple Choice</Option>
          <Option value={3}>True / False</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={["assessmentitems", "name"]}
        label="Question"
        rules={[
          {
            required: true,
            message: "Please input your question!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      {/* //If Essay, Display required length */}
      {questionType === 1 && (
        <Form.Item label="Required Length">
          <Input.Group compact>
            <Form.Item
              name={["assessmentitems", "minLength"]}
              noStyle
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <InputNumber placeholder="Min" />
            </Form.Item>{" "}
            <Form.Item
              name={["assessmentitems", "maxLength"]}
              noStyle
              rules={[
                {
                  required: true,
                  message: "Required",
                },
              ]}
            >
              <InputNumber placeholder="Max" />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      )}

      {/* //If Multiple Choice -Shuffle choices option */}
      {questionType === 2 && (
        <Form.Item label="Choices:">
          <Form.Item
            name={["assessmentitems", "courseAssessmentItemChoices", "choice1"]}
            noStyle
            key={1}
          >
            <Input placeholder="choice 1" />
          </Form.Item>
          <Form.Item
            name={["assessmentitems", "courseAssessmentItemChoices", "choice2"]}
            noStyle
            key={2}
          >
            <Input placeholder="choice 2" />
          </Form.Item>
          <Form.Item
            name={["assessmentitems", "courseAssessmentItemChoices", "choice3"]}
            noStyle
            key={3}
          >
            <Input placeholder="choice 3" />
          </Form.Item>
        </Form.Item>
      )}
      {questionType === 2 && (
        <Form.Item>
          <Form.Item
            name={["assessmentitems", "isShuffle"]}
            noStyle
            valuePropName="checked"
          >
            <Checkbox>Shuffle Choices (optional)</Checkbox>
          </Form.Item>
        </Form.Item>
      )}
      {/* //If True / False, Display choices */}
      {questionType === 3 && (
        <Form.Item label="Choices">
          <Form.Item
            name={["assessmentitems", "isTrue"]}
            noStyle
            rules={[
              {
                required: true,
                message: "Required",
              },
            ]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value="True">True</Radio.Button>
              <Radio.Button value="False">False</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <span style={{ fontStyle: "italic", color: "#999999" }}>
            {" "}
            <InfoCircleFilled /> Select the correct answer.
          </span>
        </Form.Item>
      )}

      {/* //Duration Display */}
      {assessBaseType === 2 && (
        <Form.Item
          name={["assessmentitems", "duration"]}
          label="Duration (Secs)"
          rules={[
            {
              required: true,
              message: "Please input duration!",
            },
          ]}
        >
          <InputNumber placeholder="Seconds" />
        </Form.Item>
      )}
    </Form.Item>
  );
};
export default CourseAssessmentsItems;
