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
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const { courseAllList, setCourseAllList } = useCourseList();
  const chosenRows = defaultWidgetValues.relatedcourses;
  //console.log(chosenRows)

  const onRemove = (id) => {
    //console.log("Removing: ", id);
    let newValues = chosenRows.filter((value) => value.course_id !== id);
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      relatedcourses: newValues,
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
                      {fields.map((field, index) => {
                        field = {
                          ...field,
                          value: thisPicklist[index].course_title,
                          course_id: thisPicklist[index].course_id,
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
                                    onRemove(field.course_id);
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
              () => modalFormBody(courseAllList, chosenRows)
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (courseAllList, chosenRows) => {
  const data = [];
  courseAllList.map((courses, index) => {
    data.push({
      key: index,
      inputkey: courses.id,
      title: courses.title,
      isreq: courses.id,
    });
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (chosenRows.length) {
      let defaultKeys = [];
      let defaultRows = [];
      chosenRows.map((chosen, index) => {
        data.filter((item) => {
          if (item.inputkey == chosen.course_id) {
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

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };

  return (
    <Form.List name="relatedcourses">
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
                    name={[field.name, "course_id"]}
                    initialValue={field.inputkey}
                    key={`course_id-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Course ID" value={field.inputkey} />
                  </Form.Item>
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
export default CourseWidgetRelatedCourses;
