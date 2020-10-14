import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { Rate } from "antd";
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

const CoursePostEvaluationsPreview = (props) => {
  const {
    shouldUpdate,
    defaultWidgetValues,
    evaluationType,
    starRating,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const chosenRows = defaultWidgetValues.evaluationdetails;
  let theImmediate =
    chosenRows && chosenRows.length ? chosenRows[0].isImmediate : false;
  const [isImmediateChecked, setisImmediateChecked] = useState(theImmediate);
  const [newStarValue, setNewStarValue] = useState("");
  useEffect(() => {}, []);
  useEffect(() => {
    let newStarValue = starRating;
    setNewStarValue(starRating)
  }, [starRating]);
  console.log("Preview: ", starRating);

  return (
    <>
      {evaluationType ? (
        <>
          <h3>Preview:</h3>
          {evaluationType === 1 && <Rate disabled value={newStarValue} count={newStarValue} />}
          {evaluationType === 2 && "Hello Single Question"}
        </>
      ) : (
        <span>Please select an evaluation type first</span>
      )}
    </>
  );
};

export default CoursePostEvaluationsPreview;
