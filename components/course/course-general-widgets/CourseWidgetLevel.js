import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

import { Row, Modal, Card, Input, InputNumber, Form, Collapse } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
const { Meta } = Card;
/**TextArea declaration */
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Picklist - Level",
  catValueLabel: "picklistlevel",
};

const CourseWidgetLevel = (props) => {
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
          var users = getFieldValue(widgetFieldLabels.catValueLabel) || [];
          //console.log(users);
          if (users.length) {
            return (
              <Form.List name={widgetFieldLabels.catValueLabel}>
                {(fields, { add, remove }) => {
                  return (
                    <Row className="" gutter={[4, 8]}>
                      {fields.map((field, index) => {
                        //console.log(users[index].name);
                        field = {
                          ...field,
                          value: users[index].name,
                        };
                        //console.log({...field});
                        return (
                          <Form.Item
                            required={false}
                            key={field.key}
                            gutter={[16, 16]}
                          >
                            <Form.Item noStyle key={field.key}>
                              <Input
                                placeholder="passenger name"
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
          /* return users.length ? (
                          <Input.Group size="large">
                            
                              {users.map((user, index) => (
                                
                                  <Input
                                    size="small"
                                    maxLength={30}
                                    key={index}
                                    id={index}
                                    className="user"
                                    value={`${user.name} - ${user.age}`}
                                    disabled
                                  />
                              ))}
                          </Input.Group>
                        ) : (
                          ""
                        ); */
        }}
      </Form.Item>
      <span>
        <PlusOutlined
          onClick={() =>
            showModal(
              widgetFieldLabels.catname,
              widgetFieldLabels.catValueLabel,
              modalFormBody
            )
          }
        />
      </span>

      <style jsx global>{``}</style>
    </>
  );
};
const modalFormBody = () => {
  return (
    <>
      <Form.Item
        name="name"
        label="Level"
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
};
export default CourseWidgetLevel;
