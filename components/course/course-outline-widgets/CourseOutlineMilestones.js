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
  Upload,
  Table,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PlusOutlined,
  MinusCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useCourseList } from "../../../providers/CourseProvider";
import axios from "axios";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

/**TextArea declaration */
const { Dragger } = Upload;
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Outline - Milestones",
  catValueLabel: "outlinemilestones",
};

const CourseOutlineMilestones = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const [allMilestones, setAllMilestones] = useState();
  const chosenRows = defaultWidgetValues.outlinemilestones;
  

  const onRemove = (id) => {
    let newValues = chosenRows.filter((value) => value.id !== id);
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      outlinemilestones: newValues,
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
                          value: field.name,
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
                                <img src={`${apidirectoryUrl}/`} />
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
                          console.log("Individual Fields:", field);
                          return (
                            <div key={field.key}>
                              <Form.Item
                                required={false}
                                key={field.key}
                                gutter={[16, 16]}
                                style={{ width: "30%" }}
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
                                  <img title={field.value} alt={field.value} src={`${apidirectoryUrl}/Images/CourseOutlineMilestone/${field.resourceFile}`} style={{ width: "100%" }} />
                                  <Input
                                    placeholder={widgetFieldLabels.catname}
                                    key={field.key}
                                    value={field.value}
                                    title={field.value}
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
              () => modalFormBody(allMilestones, chosenRows)
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};

//Image
const modalFormBody = (allMilestones, chosenRows) => {
  console.log(chosenRows);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const dataList = [];
  if (chosenRows.length) {
    chosenRows.map((chosen, index) => {
      dataList.push({
        uid: index,
        id: chosen.id,
        title: chosen.name,
        name: chosen.name,
        courseOutlineId: chosen.courseOutlineId,
        isticked: chosen.isticked,
        status: "done",
        originFileObj: chosen.originFileObj?chosen.originFileObj:'',
      });
    });
  }
  useEffect(() => {
    setFileList(dataList);
  }, []);
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const handleChange = (info) => {
    //setLoading(true);    
    //console.log(info.file, info.fileList);
    setFileList(info.fileList);    
  };
  //console.log(fileList);
  const onRemove = (info) => {
    setFileList("");
    setImageUrl("");
    setLoading(false);
  };
  return (
    <Form.Item name="outlinemilestones">
      <Dragger
        /* {...props} */
        onChange={handleChange}
        multiple={true}
        /* beforeUpload={beforeUpload} */
        fileList={fileList}
        /* onRemove={onRemove} */
        progress={{ type: "line", strokeWidth: 2, showInfo: true }}
      >
        <div>
          {loading ? (
            <LoadingOutlined />
          ) : (
            <div className="ant-upload-text">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Please upload an image file only.
              </p>
            </div>
          )}
        </div>
      </Dragger>
    </Form.Item>
  );
};

export default CourseOutlineMilestones;
