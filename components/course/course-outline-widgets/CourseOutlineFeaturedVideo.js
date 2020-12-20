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
  Button,
  Upload,
  Alert,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PlusOutlined,
  MinusCircleOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  InboxOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
/**TextArea declaration */
const { TextArea } = Input;
const { Dragger } = Upload;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Outline - Featured Interactive Video",
  catValueLabel: "Featured Interactive Video",
  catFormName: "outlinefeaturedvideo",
};

const CourseOutlineFeaturedVideo = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  var featured_video = defaultWidgetValues.outlinefeaturedvideo
    ? defaultWidgetValues.outlinefeaturedvideo
    : "";

  return (
    <>
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        {({ getFieldValue }) => {
          var thisPicklist = getFieldValue(widgetFieldLabels.catFormName) || [];
          //console.log(thisPicklist)
          if (thisPicklist.length) {
            return (
              <Form.List name={widgetFieldLabels.catFormName}>
                {(fields, { add, remove }) => {
                  return (
                    <Input.Group compact style={{ textAlign: "center" }}>
                      {fields.map((field, index) => {
                        field = {
                          ...field,
                          value: thisPicklist[index].file.name,
                        };
                        return (
                          <Form.Item
                            required={false}
                            key={`${widgetFieldLabels.catFormName}-${field.key}`}
                            style={{
                              width: "80%",
                              margin: "0",
                            }}
                          >
                            <Form.Item noStyle key={field.key}>
                              <Input
                                placeholder={widgetFieldLabels.catValueLabel}
                                size="medium"
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
                          </Form.Item>
                        );
                      })}
                      <Form.Item style={{ marginBottom: "0" }}>
                        <Button
                          size="medium"
                          onClick={() =>
                            showModal(
                              widgetFieldLabels.catname,
                              widgetFieldLabels.catFormName,
                              modalFormBody
                            )
                          }
                        >
                          <VideoCameraOutlined /> Upload
                        </Button>
                      </Form.Item>
                    </Input.Group>
                  );
                }}
              </Form.List>
            );
          } else {
            return (
              <Form.List name={widgetFieldLabels.catFormName}>
                {(fields, { add, remove }) => {
                  return (
                    <Input.Group compact style={{ textAlign: "center" }}>
                      <Form.Item
                        required={false}
                        key={`${widgetFieldLabels.catFormName}-0`}
                        style={{
                          width: "80%",
                          margin: "0",
                        }}
                      >
                        <Form.Item
                          noStyle
                          key={`${widgetFieldLabels.catFormName}-01`}
                        >
                          <Input
                            placeholder={widgetFieldLabels.catValueLabel}
                            size="medium"
                            key={`${widgetFieldLabels.catFormName}-02`}
                            value={featured_video}
                            readOnly
                          />
                        </Form.Item>
                      </Form.Item>

                      <Form.Item style={{ marginBottom: "0" }}>
                        <Button
                          size="medium"
                          onClick={() =>
                            showModal(
                              widgetFieldLabels.catname,
                              widgetFieldLabels.catFormName,
                              modalFormBody
                            )
                          }
                        >
                          <VideoCameraOutlined /> Upload
                        </Button>
                      </Form.Item>
                    </Input.Group>
                  );
                }}
              </Form.List>
            );
          }
        }}
      </Form.Item>
      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = () => {
  const [fileList, setFileList] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setalertMessage] = useState("");

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const handleChange = (info) => {
    setLoading(true);
    //console.log("set Loading to True");
    setFileList(info.fileList.filter((file) => !!file.status));
    //setFileList(info);
    info.fileList = info.fileList.filter((file) => !!file.status);
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    if (Array.isArray(fileList) && fileList.length) {
      getBase64(fileList[0].originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
        setalertMessage("");
        setLoading(false);
      });
    } else {
      setFileList("");
      setImageUrl("");
      setLoading(false);
    }
  };
  const onRemove = (info) => {
    setFileList("");
    setImageUrl("");
    setLoading(false);
  };
  const beforeUpload = (file) => {
    setLoading(true);
    if (file.type !== "application/x-zip-compressed") {
      setalertMessage(`${file.name} is not a ZIP file`);
    }
    return file.type === "application/x-zip-compressed";
  };
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <div className="ant-upload-text">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag an .ZIP file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Please upload an .ZIP file or leave it blank.
          </p>
        </div>
      )}
    </div>
  );
  return (
    <>
      {alertMessage ? <Alert message={alertMessage} type="error" /> : null}
      <Form.Item name="name">
        <Dragger
          onChange={handleChange}
          multiple={false}
          beforeUpload={beforeUpload}
          fileList={fileList.fileList}
          onRemove={onRemove}
        >
          {imageUrl ? (
            <video
              controls
              src={imageUrl}
              alt="avatar"
              style={{ width: "100%" }}
            />
          ) : (
            uploadButton
          )}
        </Dragger>
        {/* <Upload onChange={handleChange} multiple={false} beforeUpload={() => false} fileList={fileList.fileList}>
        <Button>
          <UploadOutlined /> Upload
        </Button>
      </Upload> */}
        {/* <Input type="file" onChange={handleChange} /> */}
      </Form.Item>
    </>
  );
};
export default CourseOutlineFeaturedVideo;
