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
  Switch,
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
    let newValues = chosenRows.filter((value) => value.id !== id);
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
                      {thisPicklist.map((field, index) => {
                        field = {
                          ...field,
                          name: index,
                          key: index,
                          value: field.title,
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
  const [sourceData, setsourceData] = useState([]);

  var data = [];
  courseAllList = courseAllList.result;
  //console.log(courseAllList)
  /* courseAllList.map((courses, index) => {
    let isreqvalue = 0;
    if (chosenRows.length) {
      chosenRows.map((chosen, index) => {
        if (courses.id == chosen.id) {
          isreqvalue = chosen.isreq;
        }
      });
      data.push({
        key: index,
        id: courses.id,
        title: courses.title,
        isreq: isreqvalue,
      });
    } else {
      data.push({
        key: index,
        id: courses.id,
        title: courses.title,
        isreq: isreqvalue,
      });
    }
  }); */

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
      render: (dataIndex, record, index) => (
        <Switch
          onChange={() => onSwitchChange(record, index)}
          defaultChecked={dataIndex}
        />
      ),
    },
  ];

  useEffect(() => {
    //console.log("ChosenRows in Modal: ", chosenRows);
    /* if (chosenRows.length) {
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
      setSelectedRowKeys(defaultKeys);
      setSelectedRows(defaultRows);
    } */
    if (chosenRows.length) {
      let defaultKeys = [];
      let defaultRows = [];
      let datamap = courseAllList.map((course, index) => {
        let theChosen = chosenRows.filter((item) => {
          let newitem = false;
          if (course.id == item.courseRelatedId) {
            newitem = true;
          }
          return newitem;
        });
        let theitem = {
          key: index,
          id: theChosen.length ? theChosen[0].id : 0,
          title: course.title,
          isreq: theChosen.length ? theChosen[0].isreq:0,
          courseRelatedId: course.id,
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
      let theSource = courseAllList.map((course, index) => {
        let item = {
          key: index,
          id: 0,
          title: course.title,
          isreq: 0,
          courseRelatedId: course.id,
          isticked: false,
        };
        return item;
      });
      setsourceData(theSource);
    }
  }, []);
  const onSwitchChange = (record, index) => {
    //console.log(record);

    /* console.log("isreq value: ",record.isreq)*/
    /* let isreqValue = record.isreq == 1 ? 0 : 1;
    //console.log("isreq New value: ",isreqValue)
    let theRecord = { ...record, isreq: isreqValue };
    console.log("the new record: ", theRecord); */

    /* let dataRecords = data.map((thedata) => {
      if (thedata.key == record.key) {
        thedata.isreq = record.isreq == 1 ? 0 : 1;
        //console.log("Changed Data: ", thedata);
      }      
      return thedata;
    });
    data = dataRecords; */
    //console.log(data)

    //let ddata = [...data,theRecord]
    //setSelectedRows([theRecord]);
    //onSelectChange(selectedRowKeys,theRecords);

    let theRecords = selectedRows.map((selectedrow) => {
      if (selectedrow.key == record.key) {
        selectedrow.isreq = record.isreq == 1 ? 0 : 1;
      }
      return selectedrow;
    });
    setSelectedRows([...theRecords]);
    //onSelectChange(selectedRowKeys,theRecords);
  };
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
  /*console.log("Updata Data List: ", data);
  console.log("=========================");
  console.log("Selected Rows:", selectedRows);*/
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
                    name={[field.name, "id"]}
                    initialValue={field.id}
                    key={`course_id-${field.key}`}
                    hidden
                  >
                    <Input placeholder="Course ID" value={field.id} />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "title"]}
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
                  <Form.Item
                    name={[field.name, "courseRelatedId"]}
                    initialValue={field.courseRelatedId}
                    key={`courseRelatedId-${field.key}`}
                    hidden
                  >
                    <Input placeholder="courseRelatedId Title" value={field.courseRelatedId} />
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
export default CourseWidgetRelatedCourses;
