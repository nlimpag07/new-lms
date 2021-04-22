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
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
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
  catname: "Outline - Prerequisite",
  catValueLabel: "outlineprerequisite",
};

const CourseOutlinePrerequisite = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    outlineList,
    isOkButtonDisabled,
    setIsOkButtonDisabled,
  } = props;
  //console.log('List: ',outlineList);
  //const [outlineList, setoutlineList] = useState();
  var chosenRows = defaultWidgetValues.outlineprerequisite;

  const onRemove = (id) => {
    let newValues = chosenRows.filter((value) => value.id !== id);
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      outlineprerequisite: newValues,
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
                            value: field.title,
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
      {outlineList ? (
        <span>
          <PlusOutlined
            onClick={() =>
              showModal(
                widgetFieldLabels.catname,
                widgetFieldLabels.catValueLabel,
                () =>
                  modalFormBody(
                    outlineList,
                    chosenRows,
                    isOkButtonDisabled,
                    setIsOkButtonDisabled
                  )
              )
            }
          />
        </span>
      ) : (
        <span>There is no course outline added yet.</span>
      )}

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (
  outlineList,
  chosenRows,
  isOkButtonDisabled,
  setIsOkButtonDisabled
) => {
  const data = [];
  const [sourceData, setsourceData] = useState([]);

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
    //console.log(selectedRows);
    if (chosenRows.length || selectedRowKeys.length) {
      setIsOkButtonDisabled(false)
    }else{
      setIsOkButtonDisabled(true);
    }
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
      let datamap = outlineList.map((outline, index) => {
        let theChosen = chosenRows.filter((item) => {
          let newitem = false;
          if (outline.id == item.preRequisiteId) {
            newitem = true;
          }
          return newitem;
        });
        let theitem = {
          key: index,
          id: theChosen.length ? theChosen[0].id : 0,
          title: outline.title,
          preRequisiteId: outline.id,
        };

        if (theChosen.length) {
          defaultRows.push(theitem);
          defaultKeys.push(theitem.key);
        }
        return theitem;
      });

      setsourceData(datamap);
      //console.log(datamap);
      setSelectedRowKeys(defaultKeys);
      setSelectedRows(defaultRows);
    } else {
      let theSource = outlineList.map((outline, index) => {
        let item = {
          key: index,
          id: 0,
          title: outline.title,
          preRequisiteId: outline.id,
        };
        return item;
      });
      setsourceData(theSource);
    }
  }, []);
  return (
    <Form.List name="outlineprerequisite">
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
                    hidden
                  >
                    <Input placeholder="Outline ID" value={field.id} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "title"]}
                    initialValue={field.title}
                    key={`outline-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Outline Title" value={field.title} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "preRequisiteId"]}
                    initialValue={field.preRequisiteId}
                    key={`outline_prereq-${field.key}`}
                    hidden
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

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={sourceData}
            />
          </div>
        );
      }}
    </Form.List>
  );
};
export default CourseOutlinePrerequisite;
