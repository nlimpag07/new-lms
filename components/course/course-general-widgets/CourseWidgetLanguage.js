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
  Tooltip
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
  catname: "Picklist - Language",
  catValueLabel: "picklistlanguage",
};

const CourseWidgetLanguage = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    isOkButtonDisabled,
    setIsOkButtonDisabled,
  } = props;
  const [allCourseLanguage, setAllCourseLanguage] = useState();
  const chosenRows = defaultWidgetValues.courselanguage;
  //console.log(chosenRows)
  useEffect(() => {
    var data = JSON.stringify({});
    var config = {
      method: "get",
      url: apiBaseUrl + "/picklist/language",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        setAllCourseLanguage(response.data.result);
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
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      courselanguage: newValues,
    });
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
                        console.log("Individual Fields:", field);
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
      <Tooltip
                                    placement="right"
                                    title="Add/Manage Language"
                                    arrowPointAtCenter
                                    destroyTooltipOnHide
                                  >
        <PlusOutlined
          onClick={() =>
            showModal(
              widgetFieldLabels.catname,
              widgetFieldLabels.catValueLabel,
              () =>
                modalFormBody(
                  allCourseLanguage,
                  chosenRows,
                  isOkButtonDisabled,
                  setIsOkButtonDisabled
                )
            )
          }
        />
      </Tooltip>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (
  allCourseLanguage,
  chosenRows,
  isOkButtonDisabled,
  setIsOkButtonDisabled
) => {
  const [sourceData, setsourceData] = useState([]);
  const data = [];
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const baseColumns = [
    {
      title: "Language",
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
    //enable or disable the submit button
    if (chosenRows.length || selectedRowKeys.length) {
      setIsOkButtonDisabled(false)
    }else{
      setIsOkButtonDisabled(true);
    }
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
      let datamap = allCourseLanguage.map((language, index) => {
        let theChosen = chosenRows.filter((item) => {
          let newitem = false;
          if (item.languageId == language.id) {
            newitem = true;
          }
          return newitem;
        });
        let theitem = {
          key: index,
          id: theChosen.length ? theChosen[0].id : 0,
          title: language.name,
          languageId: language.id,
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
      let theSource = allCourseLanguage.map((language, index) => {
        let item = {
          key: index,
          id: 0,
          title: language.name,
          languageId: language.id,
          isticked: false,
        };
        return item;
      });
      setsourceData(theSource);
    }
  }, []);

  const [filtration, setFiltration] = useState({
    filterTable: null,
    columns: baseColumns,
    baseData: sourceData,
  });

  const search = (value) => {
    const filterTable = sourceData.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFiltration({ ...filtration, filterTable: filterTable });
  };

  return (
    <Form.List name="courselanguage">
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
                    key={`language_id-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Course Language ID" value={field.id} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "title"]}
                    initialValue={field.title}
                    key={`language-${field.key}`}
                    hidden
                  >
                    <Input
                      placeholder="Course Language Title"
                      value={field.title}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "languageId"]}
                    initialValue={field.languageId}
                    key={`languageId-${field.key}`}
                    hidden
                  >
                    <Input
                      placeholder="languageId Title"
                      value={field.languageId}
                    />
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
            <Input.Search
              style={{ margin: "0 0 10px 0" }}
              placeholder="Search Language..."
              enterButton
              onSearch={search}
            />
            <Table
              rowSelection={rowSelection}
              columns={filtration.columns}
              /* dataSource={sourceData} */
              dataSource={
                filtration.filterTable == null
                  ? sourceData
                  : filtration.filterTable
              }
            />
          </div>
        );
      }}
    </Form.List>
  );
};
export default CourseWidgetLanguage;
