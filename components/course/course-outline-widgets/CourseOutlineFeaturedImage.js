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
  FileImageOutlined,
} from "@ant-design/icons";
/**TextArea declaration */
const { TextArea } = Input;
const { Dragger } = Upload;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Outline - Featured Media",
  catValueLabel: "Featured Image",
  catFormName: "outlinefeaturedimage",
};
const CourseOutlineFeaturedImage = (props) => {
  const {
    shouldUpdate,
    showModal,
    defaultWidgetValues,
    setdefaultWidgetValues,
    isOkButtonDisabled,
    setIsOkButtonDisabled,
  } = props;
  var featured_image = defaultWidgetValues.outlinefeaturedimage
    ? defaultWidgetValues.outlinefeaturedimage
    : "";
  //console.log(defaultWidgetValues.featuredimage)

  return (
    <>
      <Form.Item label={widgetFieldLabels.catname} shouldUpdate={shouldUpdate}>
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
                              () =>
                                modalFormBody(
                                  isOkButtonDisabled,
                                  setIsOkButtonDisabled
                                )
                            )
                          }
                        >
                          <FileImageOutlined /> Upload
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
                            value={featured_image}
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
                              () =>
                                modalFormBody(
                                  isOkButtonDisabled,
                                  setIsOkButtonDisabled
                                )
                            )
                          }
                        >
                          <FileImageOutlined /> Upload
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
const modalFormBody = (isOkButtonDisabled, setIsOkButtonDisabled) => {
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
        setIsOkButtonDisabled(false);
      });
    } else {
      setFileList("");
      setImageUrl("");
      setLoading(false);
      setIsOkButtonDisabled(true);
    }
  };
  const onRemove = (info) => {
    setFileList("");
    setImageUrl("");
    setLoading(false);
    setIsOkButtonDisabled(true);
  };
  const beforeUpload = (file) => {
    setLoading(true);
    if (
      file.type !== "image/png" ||
      file.type !== "image/jpeg" ||
      file.type !== "image/jpg"
    ) {
      setalertMessage(`${file.name} is not an Image file`);
    }
    return (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    );
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
            Click or drag Image file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Please upload a .PNG, .JPEG, .JPG only.
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
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
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
export default CourseOutlineFeaturedImage;
