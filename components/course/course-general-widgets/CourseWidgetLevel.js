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
  SettingFilled,
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
  catname: "Picklist - Level",
  catValueLabel: "picklistlevel",
};

const CourseWidgetLevel = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    isOkButtonDisabled,
    setIsOkButtonDisabled,
  } = props;
  const [allCourseLevel, setAllCourseLevel] = useState();
  const chosenRows = defaultWidgetValues.courselevel;
  //console.log(chosenRows)
  useEffect(() => {
    var data = JSON.stringify({});
    var config = {
      method: "get",
      url: apiBaseUrl + "/picklist/courselevel",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };
    async function fetchData(config) {
      const response = await axios(config);
      if (response) {
        setAllCourseLevel(response.data.result);
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
    setdefaultWidgetValues({ ...defaultWidgetValues, courselevel: newValues });
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
                              {fields.length >= 1 ? (
                                <SettingFilled
                                  className="dynamic-delete-button"
                                  style={{ margin: "0 8px" }}
                                  key={`del-${field.key}`}
                                  onClick={() => {
                                    /* remove(field.name);
                                    onRemove(field.id); */
                                    showModal(
                                      widgetFieldLabels.catname,
                                      widgetFieldLabels.catValueLabel,
                                      () =>
                                        modalFormBody(
                                          allCourseLevel,
                                          thisPicklist,
                                          isOkButtonDisabled,
                                          setIsOkButtonDisabled
                                        )
                                    );
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
                                {chosenRows.length >= 1 ? (
                                  <SettingFilled
                                    className="dynamic-delete-button"
                                    style={{ margin: "0 8px" }}
                                    key={`del-${field.key}`}
                                    onClick={() => {
                                      /* remove(field.name);
                                      onRemove(field.id); */
                                      showModal(
                                        widgetFieldLabels.catname,
                                        widgetFieldLabels.catValueLabel,
                                        () =>
                                          modalFormBody(
                                            allCourseLevel,
                                            chosenRows,
                                            isOkButtonDisabled,
                                            setIsOkButtonDisabled
                                          )
                                      );
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
      {chosenRows.length < 1 ? (
        <span>
          <PlusOutlined
            onClick={() =>
              showModal(
                widgetFieldLabels.catname,
                widgetFieldLabels.catValueLabel,
                () =>
                  modalFormBody(
                    allCourseLevel,
                    chosenRows,
                    isOkButtonDisabled,
                    setIsOkButtonDisabled
                  )
              )
            }
          />
        </span>
      ) : null}
      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (
  allCourseLevel,
  chosenRows,
  isOkButtonDisabled,
  setIsOkButtonDisabled
) => {
  const [sourceData, setsourceData] = useState([]);
  const data = [];
  /* allCourseLevel.map((level, index) => {
    data.push({
      key: index,
      id: level.id,
      title: level.name,
      levelId:level.id,
      isticked:false,
    });
  }); */
  /* console.log(data);
  console.log("=================");
  console.log(chosenRows); */

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "Level",
      dataIndex: "title",
    },
    /*  {
      title: "Pre-requisite",
      dataIndex: "isreq",
    }, */
  ];

  //for multiple selection code
  /* const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    let rowData = selectedRows.map((entry, index) => {
      entry.isticked = true;
      return entry; 
    });
    setSelectedRows(rowData);
  }; */
  //For single selection Code
  const onSelectRow = (selected, selectedRows, changeRows) => {
    setSelectedRowKeys([selected.key]);
    let rowData = [];
    rowData.push({ ...selected, isticked: true });
    setSelectedRows(rowData);
    //enable or disable the submit button
    if (chosenRows.length || selected) {
      setIsOkButtonDisabled(false)
    }else{
      setIsOkButtonDisabled(true);
    }
    //console.log("selected", selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    /* onChange: onSelectChange, */
    onSelect: onSelectRow,
  };
  useEffect(() => {
    if (chosenRows.length) {
      let defaultKeys = [];
      let defaultRows = [];
      let datamap = allCourseLevel.map((level, index) => {
        let theChosen = chosenRows.filter((item) => {
          let newitem = false;
          if (item.levelId == level.id) {
            newitem = true;
          }
          return newitem;
        });
        let theitem = {
          key: index,
          id: theChosen.length ? theChosen[0].id : 0,
          title: level.name,
          levelId: level.id,
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
      let theSource = allCourseLevel.map((level, index) => {
        let item = {
          key: index,
          id: 0,
          title: level.name,
          levelId: level.id,
          isticked: false,
        };
        return item;
      });
      setsourceData(theSource);
    }
  }, []);
  //console.log(selectedRows)
  return (
    <Form.List name="courselevel">
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
                    key={`level_id-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Level ID" value={field.id} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "title"]}
                    initialValue={field.title}
                    key={`level-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Level Title" value={field.title} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "levelId"]}
                    initialValue={field.levelId}
                    key={`levelId-${field.key}`}
                    hidden
                  >
                    <Input placeholder="LevelId Title" value={field.levelId} />
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
                <div>Hello</div>
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
export default CourseWidgetLevel;
