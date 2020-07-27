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
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
/**TextArea declaration */
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Picklist - Featured Media",
  catValueLabel: "picklistfeaturedimage",
};

const CourseWidgetFeaturedImage = (props) => {
  const { shouldUpdate, showModal } = props;

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
          console.log(thisPicklist);
          return thisPicklist.length ? (
            <Input.Group size="large">
              {thisPicklist.map((thePicklist, index) => (
                <Input
                  size="small"
                  maxLength={30}
                  key={index}
                  id={index}
                  className="user"
                  value={thePicklist.featuredImage}
                  readOnly
                />
              ))}
            </Input.Group>
            
          ) : (
            <Form.Item nostyle style={{ marginBottom: "0" }}>
              <Input.Group
                compact
                style={{ textAlign: "center", marginBottom: "15px" }}
              >
                <Form.Item
                name="featuredImage"
                label="Featured Image"
                  nostyle
                  style={{ width: "calc(70% - 8px)", margin: "0 8px" }}
                  /* rules={[
                    {
                      required: true,
                    },
                  ]} */
                >
                  <Input
                    xs={4}
                    size="large"
                    maxLength={30}
                    key={`${widgetFieldLabels.catValueLabel} - Image`}
                    id={widgetFieldLabels.catValueLabel}
                    className={`${widgetFieldLabels.catValueLabel}-image`}
                    readOnly
                    placeholder={`${widgetFieldLabels.catname} - Image`}
                  />
                </Form.Item>
                <Form.Item nostyle style={{ marginBottom: "0" }}>
                  <Button
                    size="large"
                    onClick={() =>
                      showModal(
                        widgetFieldLabels.catname,
                        widgetFieldLabels.catValueLabel,
                        modalFormBody("image")
                      )
                    }
                  >
                    <FileImageOutlined /> Upload
                  </Button>
                </Form.Item>
              </Input.Group>
              <Input.Group compact style={{ textAlign: "center" }}>
                <Form.Item
                  name="featuredVideo"
                  label="Featured Video"
                  nostyle
                  style={{ width: "calc(70% - 8px)", margin: "0 8px" }}
                  /* rules={[
                    {
                      required: true,
                    },
                  ]} */
                >
                  <Input
                    xs={4}
                    size="large"
                    maxLength={30}
                    key={`${widgetFieldLabels.catValueLabel} - Video`}
                    id={widgetFieldLabels.catValueLabel}
                    className={`${widgetFieldLabels.catValueLabel}-video`}
                    readOnly
                    placeholder={`${widgetFieldLabels.catname} - Video`}
                  />
                </Form.Item>
                <Form.Item nostyle style={{ marginBottom: "0" }}>
                  <Button
                    size="large"
                    onClick={() =>
                      showModal(
                        widgetFieldLabels.catname,
                        widgetFieldLabels.catValueLabel,
                        modalFormBody("video")
                      )
                    }
                  >
                    <VideoCameraOutlined /> Upload
                  </Button>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          );
          /* if (thisPicklist.length) {
            return (
              <Form.List name={widgetFieldLabels.catValueLabel}>
                {(fields, { add, remove }) => {
                  return (
                    <Row className="" gutter={[4, 8]}>
                      {fields.map((field, index) => {
                        
                        field = {
                          ...field,
                          value: thisPicklist[index].image,
                        };
                        console.log(thisPicklist[index])
                        return (
                          <Form.Item
                            required={false}
                            key={field.key}
                            gutter={[16, 16]}
                          >
                            <Form.Item noStyle key={field.key}>
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
          } */
        }}
      </Form.Item>
      {/* <span>
        <PlusOutlined
          onClick={() =>
            showModal(
              widgetFieldLabels.catname,
              widgetFieldLabels.catValueLabel,
              modalFormBody
            )
          }
        />
      </span> */}

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = (media) => {
  switch (media) {
    case "image":
      return (
        <>
          <Form.Item
            name="featuredImage"
            label="Featured Image"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          {/*  <Form.Item
            name="video"
            label="Featured Video"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item> */}
        </>
      );
      break;
    case "video":
      return (
        <>
          <Form.Item
            name="featuredVideo"
            label="Featured Video"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </>
      );
      break;

    default:
      return (
        <>
          <div>Please Select Media type</div>
        </>
      );
      break;
  }
};
export default CourseWidgetFeaturedImage;
