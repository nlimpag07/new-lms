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
  catname: "Picklist - Type",
  catValueLabel: "picklisttype",
};

const CourseWidgetType = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const [allCourseType, setAllCourseType] = useState();
  const chosenRows = defaultWidgetValues.coursetype;
  //console.log(chosenRows)
  useEffect(() => {
    var data = JSON.stringify({});
    var config = {
      method: "get",
      url: apiBaseUrl + "/picklist/coursetype",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        setAllCourseType(response.data.result);
        //console.log(response.data)
      } else {
        console.log(
          "Network Error: Please contact your administrator to fix this issue."
        );
      }
    }
    fetchData(config);
  }, []);

  const onRemove = (id) => {
    let newValues = chosenRows.filter((value) => value.id !== id);
    setdefaultWidgetValues({ ...defaultWidgetValues, coursetype: newValues });
  };

  return (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
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
                                {/* {chosenRows.length >= 1 ? (
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
              () => modalFormBody(allCourseType, chosenRows)
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (allCourseType, chosenRows) => {
  const [sourceData, setsourceData] = useState([]);
  const data = [];
  /* allCourseType.map((type, index) => {
    data.push({
      key: index,
      id: type.id,
      title: type.name,
    });
  }); */

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "Type",
      dataIndex: "title",
    },
    /*  {
      title: "Pre-requisite",
      dataIndex: "isreq",
    }, */
  ];

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    let rowData = selectedRows.map((entry, index) => {
      entry.isticked = true;
      return entry;
    });
    setSelectedRows(rowData);
    //setSelectedRows(selectedRows);
    //console.log(rowData);
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
      let datamap = allCourseType.map((type, index) => {
        let theChosen = chosenRows.filter((item) => {
          let newitem = false;
          if (item.courseTypeId == type.id) {
            newitem = true;
          }
          return newitem;
        });
        let theitem = {
          key: index,
          id: theChosen.length ? theChosen[0].id : 0,
          title: type.name,
          courseTypeId: type.id,
          isticked: theChosen.length ? true : false,
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
      let theSource = allCourseType.map((type, index) => {
        let item = {
          key: index,
          id: 0,
          title: type.name,
          courseTypeId: type.id,
          isticked: false,
        };
        return item;
      });
      setsourceData(theSource);
    }
  }, []);
  return (
    <Form.List name="coursetype">
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
                    key={`type_id-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Course Type ID" value={field.id} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "title"]}
                    initialValue={field.title}
                    key={`type-${field.key}`}
                    hidden
                  >
                    <Input
                      placeholder="Course Type Title"
                      value={field.title}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "courseTypeId"]}
                    initialValue={field.courseTypeId}
                    key={`courseTypeId-${field.key}`}
                    hidden
                  >
                    <Input placeholder="typeId Title" value={field.courseTypeId} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "isticked"]}
                    initialValue={field.isticked}
                    key={`isticked-${field.key}`}
                    hidden
                  >
                    <Input
                      placeholder="isTicked Title"
                      value={field.isticked}
                    />
                  </Form.Item>
                </div>
              ) : (
                <div>Data Empty</div>
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
export default CourseWidgetType;
