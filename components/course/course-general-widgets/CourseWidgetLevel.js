
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
  catname: "Picklist - Level",
  catValueLabel: "picklistlevel",
};

const CourseWidgetLevel = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
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
        setAllCourseLevel(response.data);   
        //console.log(response.data)     
      } else {
        console.log("Network Error: Please contact your administrator to fix this issue.")
      }
    }
    fetchData(
      config
    );
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
                      {fields.map((field, index) => {
                        field = {
                          ...field,
                          value: thisPicklist[index].title,
                          id: thisPicklist[index].id,
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
          } else {
            return <></>;
          }
        }}
      </Form.Item>
      <span>
        <PlusOutlined
          onClick={() =>
            showModal(
              widgetFieldLabels.catname,
              widgetFieldLabels.catValueLabel,
              () => modalFormBody(allCourseLevel, chosenRows)
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (allCourseLevel, chosenRows) => {
  const data = [];
  allCourseLevel.map((level, index) => {
    data.push({
      key: index,
      id: level.id,
      title: level.name,
    });
  });

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
          if (item.id == chosen.id) {
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
                </div>
              ) : (
                <div>Hello</div>
              );
            })}

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />
          </div>
        );
      }}
    </Form.List>
  );
};
export default CourseWidgetLevel;

