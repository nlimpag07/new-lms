import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import axios from "axios";
import CoursePostEvaluationsPreview from "./CoursePostEvaluationsPreview";

import { Rate, Input, InputNumber,Form } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Plusevaluationd,
  MinusCircleevaluationd,
  InfoCircleFilled,
} from "@ant-design/icons";

const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Evaluations - Preview",
  catValueLabel: "evaluationpreview",
};

const CoursePostEvaluationsStarProcess = (props) => {
  const {
    shouldUpdate,
    defaultWidgetValues,
    evaluationType,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const chosenRows = defaultWidgetValues.evaluationdetails;
  let theImmediate =
    chosenRows && chosenRows.length ? chosenRows[0].isImmediate : false;
  const [isImmediateChecked, setisImmediateChecked] = useState(theImmediate);
  const [starRating, setStarRating] = useState(0);
  useEffect(() => {}, []);
  
  const onStarRating = (e) => {
    console.log("Star:", e.target.value);
    setStarRating(e.target.value);
  };
  return (
    <>
      <Input.Group compact>
        <Form.Item style={{ marginBottom: "10px", width: "15%" }}>
          <span>Min. Value</span>
        </Form.Item>
        <Form.Item name={["evaluationvalues", "minValue"]} noStyle>
          <Input placeholder="Min. Value" style={{width: "20%" }} />
        </Form.Item>
        <Form.Item
          style={{
            marginBottom: "10px",
            width: "15%",
            marginLeft: "25px",
          }}
        >
          <span>Max. Value</span>
        </Form.Item>
        <Form.Item name={["evaluationvalues", "maxValue"]} noStyle>
          <Input
            onChange={onStarRating}
            placeholder="Max. Value"
            style={{width: "20%" }}
          />
        </Form.Item>
      </Input.Group>
      <CoursePostEvaluationsPreview
        evaluationType={evaluationType}
        defaultWidgetValues={defaultWidgetValues}
        starRating={starRating}
      />
    </>
  );
};

export default CoursePostEvaluationsStarProcess;
