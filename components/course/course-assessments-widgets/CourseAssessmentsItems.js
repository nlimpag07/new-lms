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
  Table,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PlusOutlined,
  MinusCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

/**TextArea declaration */
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
  //console.log(chosenRows);
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

  const onRemove = (id) => {
    let newValues = chosenRows.filter((value) => value.id !== id);
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
                          name: index,
                          key: index,
                          value: field.title,
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
                              {/* {fields.length >= 1 ? (
                                <MinusCircleOutlined
                                  className="dynamic-delete-button"
                                  style={{ margin: "0 8px" }}
                                  key={`del-${field.key}`}
                                  onClick={() => {
                                    remove(field.name);
                                    onRemove(field.id);
                                  }}
                                />
                              ) : null} */}
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
                            name: index,
                            key: index,
                            value: field.name,
                          };
                          //console.log("Individual Fields:", field);
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
                                      onRemove(field.id);
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
              () => modalFormBody(assItemList, chosenRows)
            )
          }
        />
      </span>
      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (assItemList, chosenRows) => {
  const data = [];

  assItemList.map((outline, index) => {
    data.push({
      key: index,
      id: outline.id,
      title: outline.title,
      preRequisiteId: outline.id,
    });
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "Prerequisite",
      dataIndex: "title",
    },
    /*  {
      title: "Pre-requisite",
      dataIndex: "isreq",
    }, */
  ];

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
    console.log(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };
  useEffect(() => {
    if (chosenRows.length) {
      let defaultKeys = [];
      let defaultRows = [];
      chosenRows.map((chosen, index) => {
        data.filter((item) => {
          if (item.id == chosen.preRequisiteId) {
            defaultRows.push(item);
            defaultKeys.push(item.key);
          }
        });
      });
      //console.log(thekeys)
      setSelectedRowKeys(defaultKeys);
      setSelectedRows(defaultRows);
    }
  }, []);
  return (
    <Form.List name="assessment_items">
      {(fields, { add, remove }) => {
        return (
          <div>
            {selectedRows.map((field, index) => {
              field = {
                ...field,
                name: index,
              };
              return field ? (
                <div key={index}>
                  <Form.Item
                    name={[field.name, "id"]}
                    initialValue={field.id}
                    key={`outline_id-${field.key}`}
                    
                  >
                    <Input placeholder="Outline ID" value={field.id} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "title"]}
                    initialValue={field.title}
                    key={`outline-${field.key}`}
                    
                  >
                    <Input placeholder="Outline Title" value={field.title} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "preRequisiteId"]}
                    initialValue={field.preRequisiteId}
                    key={`outline_prereq-${field.key}`}
                    
                  >
                    <Input
                      placeholder="Outline preRequisiteId"
                      value={field.preRequisiteId}
                    />
                  </Form.Item>
                </div>
              ) : (
                <div>Sorry... There is no data at the moment.</div>
              );
            })}
            
          </div>
        );
      }}
    </Form.List>
  );
};
export default CourseAssessmentsItems;
