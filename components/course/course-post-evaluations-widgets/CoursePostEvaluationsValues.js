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
  catname: "Evaluations - Questions",
  catValueLabel: "evaluationvalues",
};

const CoursePostEvaluationsValues = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    evaluationType,
  } = props;
  //console.log("Evaluation Type: ", evaluationType);
  var assItemList = defaultWidgetValues.evaluationvalues;
  var chosenRows = defaultWidgetValues.evaluationvalues;
  /* if(chosenRows.length){
    let choosed = chosenRows.map((chosen,index)=>{
      let newOutline = assItemList.filter((outline)=>chosen.preRequisiteId == outline.id)
      chosen['title']= newOutline[0].title;
      return chosen;
    })
    chosenRows = choosed;
  } */
  //console.log("Chosen Rows", chosenRows);
  /* useEffect(() => {    
  }, []); */

  const onRemove = (name) => {
    let newValues = chosenRows.filter((value) => value.optionname !== name);
    //console.log("NewValues:", newValues);
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      evaluationvalues: newValues,
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
                          name:index,
                          key: index,
                          value: field.optionname,
                          id: index,
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
                                    onRemove(field.optionname);
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
            if (chosenRows) {
              return (
                <Form.List name={widgetFieldLabels.catValueLabel}>
                  {(fields, { add, remove }) => {
                    return (
                      <Row className="" gutter={[4, 8]}>
                        {chosenRows.map((field, index) => {
                          field = {
                            ...field,
                            name:index,
                            key: index,
                            value: field.optionname,
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
                                      onRemove(field.optionname);
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
              () => modalFormBody(assItemList, chosenRows, evaluationType)
            )
          }
        />
      </span>
      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (assItemList, chosenRows, evaluationType) => {
  useEffect(() => {}, []);

  return (
    <Form.Item name="optionname" label="Option Name" rules={[
      {
        required: true,
        message: "Please input Option Name!",
      },
    ]}>
        <Input placeholder="Option Name" />
    </Form.Item>
  );
};
export default CoursePostEvaluationsValues;
