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

/**TextArea declaration */
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Picklist - Related Courses",
  catValueLabel: "picklistrelatedcourses",
};

const CourseWidgetRelatedCourses = (props) => {
  const { shouldUpdate, showModal } = props;
  const { courseAllList, setCourseAllList } = useCourseList();

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
            console.log('received picklist value: ', thisPicklist);
            return (
              <Form.List name={widgetFieldLabels.catValueLabel}>
                {(fields, { add, remove }) => {
                  return (
                    <Row className="" gutter={[4, 8]}>
                      {fields.map((field, index) => {
                        
                        field = {
                          ...field,
                          value: thisPicklist[index].course_title,
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
              () =>
                modalFormBody(courseAllList, widgetFieldLabels.catValueLabel)
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (courseAllList, formname) => {
  const [chosenKeys, setChosenKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);
  //const { id, title, code } = courseAllList;
  const [form] = Form.useForm();
  const columns = [
    {
      title: "Course",
      dataIndex: "title",
    },
    {
      title: "Pre-requisite",
      dataIndex: "isreq",
    },
  ];
  const data = [];
  courseAllList.map((courses, index) => {
    data.push({
      key: index,
      inputkey: courses.id,
      title: courses.title,
      isreq: courses.id,
    });
  });

  //console.log(data);
  /* const onSelectChange = (selectedRowKeys,selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    console.log(selectedRows)
  }; */
  //console.log("selectedRowKeys changed: ", selectedRowKeys);
  /* const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }; */
  useEffect(() => {
    if(!chosenKeys.length){
    var initialrows = []; 
    setSelectedRows(initialrows);
    }
  }, [chosenKeys]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setChosenKeys(selectedRowKeys);
      setSelectedRows(selectedRows);      
    },
    /* onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    }, */
  };
  return (
    <Form.List name="relatedcourses">
      {(fields, { add, remove }) => {
        //console.log(chosenRows);
       /*  console.log("================================")
      console.log('chosenRows: ', selectedRows);
      console.log("================================") */
        return (
          <div>
            {selectedRows.map((field, index) => {
              field = {
                ...field,
                name: index,
              };
              //console.log(field);
              return (
                <div key={index}>
                  <Form.Item
                    name={[field.name, "course_id"]}
                    initialValue={field.inputkey}
                    key={`course_id-${field.key}`}
                    hidden
                  ><Input placeholder="Course ID" value={field.inputkey} /></Form.Item>
                  <Form.Item
                    name={[field.name, "course_title"]}
                    initialValue={field.title}
                    key={`course-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Course Title" value={field.title} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "isreq"]}
                    initialValue={field.isreq}
                    key={`isprerequesite-${index}`}
                    hidden
                  >
                    <Input placeholder="Course Requisite" value={field.isreq} />
                  </Form.Item>

                  {/* <MinusCircleOutlined
                  onClick={() => {
                    remove(field.name);
                  }}
                /> */}
                </div>
              );
            })}

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
            />

            {/* <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    onValueChange('Dummy')
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item> */}
          </div>
        );
      }}
    </Form.List>
  );
};
export default CourseWidgetRelatedCourses;
