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
            //console.log(thisPicklist);
            return (
              <Form.List name={widgetFieldLabels.catValueLabel}>
                {(fields, { add, remove }) => {
                  return (
                    <Row className="" gutter={[4, 8]}>
                      {fields.map((field, index) => {
                        field = {
                          ...field,
                          value: thisPicklist[index].name,
                        };
                        return (
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
              () => modalFormBody(courseAllList)
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (courseAllList) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([""]);
  const [fileList, seFileList] = useState("");
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm("picklistrelatedcourses");
  //const { id, title, code } = courseAllList;
  console.log(form);
  const columns = [
    {
      title: "Course",
      dataIndex: "name",
    },
    {
      title: "Pre-requisite",
      dataIndex: "isPreRequisite",
    },
  ];
  const data = [];
  courseAllList.map((courses, index) => {
    data.push({
      key: courses.id,
      name: courses.title,
      isPreRequisite: courses.id,
    });
  });
  var formRef = React.createRef();
  //console.log(data);
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);   
  };
  console.log("selectedRowKeys changed: ", selectedRowKeys);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  return (
    <>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.name !== currentValues.name
        }
      >
        {({ getFieldValue }) => {
          console.log(getFieldValue);
          return getFieldValue("name") ? (
            <Form.Item
              name="name"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input value={selectedRowKeys} />
            </Form.Item>
          ) : (
            <Form.Item
              name="name"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        }}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </Form.Item>
    </>
  );
};
export default CourseWidgetRelatedCourses;
