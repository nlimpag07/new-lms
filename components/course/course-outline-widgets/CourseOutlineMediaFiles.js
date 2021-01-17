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
  Alert,
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
  catname: "Outline - Media Files",
  catValueLabel: "outlinemediafiles",
};

const CourseOutlineMediaFiles = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    isOkButtonDisabled,
    setIsOkButtonDisabled,
  } = props;
  const [allMediaFiles, setAllMediaFiles] = useState();
  const chosenRows = defaultWidgetValues.outlinemediafiles;

  const onRemove = (id) => {
    let newValues = chosenRows.filter((value) => value.id !== id);
    setdefaultWidgetValues({
      ...defaultWidgetValues,
      outlinemediafiles: newValues,
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
                      {thisPicklist[0].fileList.map((field, index) => {
                        field = {
                          ...field,
                          name: index,
                          key: index,
                          value: field.name,
                          id: field.id,
                        };
                        /* field = {
                          ...field,
                          name: index,
                          key: index,
                          value: thisPicklist[index].file.name,
                        }; */
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
                                <Input
                                  type="file"
                                  placeholder={widgetFieldLabels.catValueLabel}
                                  size="medium"
                                  key={`0-${field.key}`}
                                  hidden
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
                                  <Input
                                    type="file"
                                    placeholder={
                                      widgetFieldLabels.catValueLabel
                                    }
                                    size="medium"
                                    key={`0-${field.key}`}
                                    hidden
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
              () =>
                modalFormBody(
                  allMediaFiles,
                  chosenRows,
                  isOkButtonDisabled,
                  setIsOkButtonDisabled
                )
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};

//Image
const modalFormBody = (
  allMediaFiles,
  chosenRows,
  isOkButtonDisabled,
  setIsOkButtonDisabled
) => {
  //console.log(chosenRows);
  const [fileList, setFileList] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setalertMessage] = useState("");

  const dataList = [];
  if (chosenRows.length) {
    chosenRows.map((chosen, index) => {
      dataList.push({
        uid: index,
        id: chosen.id ? chosen.id : 0,
        title: chosen.name,
        name: chosen.name,
        courseOutlineId: chosen.courseOutlineId,
        isticked: chosen.isticked,
        status: "done",
        originFileObj: chosen.originFileObj ? chosen.originFileObj : "",
      });
    });
  }
  useEffect(() => {
    setFileList({ file: "", fileList: dataList });
  }, []);
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  /* const handleChange = (info) => {
    //setLoading(true);
    //console.log(info.file, info.fileList);
    setFileList(info);
  }; */
  //console.log(fileList);
  const onRemove = (info) => {
    setFileList("");
    setImageUrl("");
    setLoading(false);
  };
  /* const beforeUpload = () => {
    return setLoading(true);
    //return false;
  }; */
  const handleChange = (info) => {
    setLoading(true);
    setFileList(info.fileList.filter((file) => !!file.status));
    //setFileList(info);
    info.fileList = info.fileList.filter((file) => !!file.status);
    let thefileList = [...info.fileList];
    if (Array.isArray(thefileList) && thefileList.length) {
      info.fileList.map((list, index) => {
        if (!list.id) {
          list["id"] = 0;
        }
        return list;
      });
      setLoading(false);
      setFileList(info);
      //setalertMessage("");
    } else {
      setFileList("");
      setImageUrl("");
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    setLoading(true);
    if (
      file.type !== "application/pdf" ||
      file.type !== "application/msword" ||
      file.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setalertMessage(
        `Unsupported file detected. Files not supported are not added to the list.`
      );
    }
    return (
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
  };
  /* const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <div className="ant-upload-text">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag doc, docx, pdf file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Please upload doc, docx, pdf file only.
          </p>
        </div>
      )}
    </div>
  );
  console.log(alertMessage) */;
  return (
    <>
      {alertMessage ? <Alert message={alertMessage} type="error" /> : null}
      <Form.Item name="outlinemedia">
        <Dragger
          onChange={handleChange}
          multiple={true}
          beforeUpload={beforeUpload}
          fileList={fileList.fileList}
          onClick={() => setalertMessage("")}
          /* onRemove={onRemove} */
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
                  Click or drag doc, docx, pdf file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Please upload doc, docx, pdf file only.
                </p>
              </div>
            )}
          </div>
        </Dragger>
      </Form.Item>
    </>
  );
};

/* const modalFormBody = (allMediaFiles, chosenRows) => {
  const data = [];
  allMediaFiles.map((type, index) => {
    data.push({
      key: index,
      id: type.id,
      title: type.name,
    });
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fileList, setFileList] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const columns = [
    {
      title: "Type",
      dataIndex: "title",
    },    
  ];

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
    //console.log(selectedRows);
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
    <Form.List name="outlinemediafiles">
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
                </div>
              ) : (
                <div>Data Empty</div>
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
}; */
export default CourseOutlineMediaFiles;
