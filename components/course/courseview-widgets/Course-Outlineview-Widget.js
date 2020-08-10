import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Row, Col, Steps } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Link from "next/link";
const { Step } = Steps;

const CourseOutlineviewWidget = ({ course_details }) => {
  /* var [courseId, setCourseId] = useState(course_id);
  const homeUrl = process.env.homeUrl;
  const { courseAllList } = useCourseList();
  const [course, setCourse] = useState("");
  const [modal2Visible, setModal2Visible] = useState("");
  var courseData = ""; */
  const { relatedCourse, description, courseInstructor } = course_details;
  //console.log(course_details);
  const [current, setCurrent] = useState(0);
  const [fullDetails, setFullDetails] = useState("off");

  /* useEffect(() => {
    setFullDetails("shown");
  }, [current]); */


  const onChange = (current) => {
    //console.log("onChange:", current);
    setCurrent(current);
    
  };

  useEffect(() => {
    //setFullDetails("shown");
    let elem = document.querySelector(".ant-steps-item-active");
    let targetDesc = elem.querySelector(".fullDetails");
    
    //targetElem.classList.includes("ant-steps-item-active")
    let classes =targetDesc.classList;
    classes.replace("fullDetails-off", "fullDetails-shown");
  }, [current]);

  return (
    <div className="tab-content">
      <Row className="Course-OutlineView">
        <Col xs={24}>
          <Steps
            progressDot
            current={current}
            onChange={onChange}
            direction="vertical"
            className="Steps"
          >
            <Step
              title="Course Outline 1"
              description={Description(fullDetails)}
              className="StepNo"
              //onClick={() => onClick(event)}
            />
            <Step
              title="Course Outline 2"
              description={Description(fullDetails)}
              className="StepNo"
              //onClick={() => onClick(event)}
            />
            <Step
              title="Course Outline 3"
              description={Description(fullDetails)}
              className="StepNo"
              //onClick={() => onClick(event)}
            />
          </Steps>
        </Col>
      </Row>

      <style jsx global>{`
        .fullDetails-off {
          display: none;
        }
        .fullDetails-shown {
          display: block;
        }
        .Course-OutlineView .ant-collapse > .ant-collapse-item,
        .Course-OutlineView .ant-collapse,
        .Course-OutlineView .ant-collapse-content {
          border: none;
        }
        .Course-OutlineView .ant-steps-item-process .ant-steps-item-icon,
        .Course-OutlineView .ant-steps-item-process .ant-steps-item-icon {
          background-color: #e69138;
          border-color: #e69138;
        }
        .Course-OutlineView
          .ant-steps-item-wait
          > .ant-steps-item-container
          > .ant-steps-item-tail::after,
        .Course-OutlineView
          .ant-steps-item-process
          > .ant-steps-item-container
          > .ant-steps-item-tail::after {
          background-color: #e69138;
        }

        .Course-OutlineView .ant-steps-dot .ant-steps-item-icon,
        .Course-OutlineView
          .ant-steps-dot.ant-steps-small
          .ant-steps-item-icon {
          width: 1rem;
          height: 1rem;
        }
        .Course-OutlineView .ant-steps-dot .ant-steps-item-tail::after,
        .Course-OutlineView
          .ant-steps-dot.ant-steps-small
          .ant-steps-item-tail::after {
          margin-left: 16px;
        }
        .Course-OutlineView
          .ant-steps-vertical.ant-steps-dot
          .ant-steps-item-process
          .ant-steps-icon-dot,
        .Course-OutlineView .ant-steps-item-icon > .ant-steps-icon {
          top: 0px;
          left: 0px;
        }
        .Course-OutlineView
          .ant-steps-item-finish
          > .ant-steps-item-container
          > .ant-steps-item-tail::after {
          background-color: #e69138;
        }
        .Course-OutlineView
          .ant-steps-item-finish
          .ant-steps-item-icon
          > .ant-steps-icon
          .ant-steps-icon-dot {
          background-color: #e69138;
        }
        .Course-OutlineView
          .ant-steps-item-process
          .ant-steps-item-icon
          > .ant-steps-icon
          .ant-steps-icon-dot {
          background: #e69138;
        }
        .Course-OutlineView
          .ant-steps
          .ant-steps-item:not(.ant-steps-item-active)
          > .ant-steps-item-container[role="button"]:hover
          .ant-steps-item-title,
        .Course-OutlineView
          .ant-steps
          .ant-steps-item:not(.ant-steps-item-active)
          > .ant-steps-item-container[role="button"]:hover
          .ant-steps-item-subtitle,
        .Course-OutlineView
          .ant-steps
          .ant-steps-item:not(.ant-steps-item-active)
          > .ant-steps-item-container[role="button"]:hover
          .ant-steps-item-description {
          color: #e69138;
        }
        .Course-OutlineView
          .ant-steps-item-wait
          .ant-steps-item-icon
          > .ant-steps-icon
          .ant-steps-icon-dot {
          background-color: #e69138;
        }
        .ant-steps
          .ant-steps-item:not(.ant-steps-item-active)
          > .ant-steps-item-container[role="button"]:hover
          .ant-steps-item-title,
        .ant-steps
          .ant-steps-item:not(.ant-steps-item-active)
          > .ant-steps-item-container[role="button"]:hover
          .ant-steps-item-subtitle,
        .ant-steps
          .ant-steps-item:not(.ant-steps-item-active)
          > .ant-steps-item-container[role="button"]:hover
          .ant-steps-item-description {
          color: #e69138;
        }
      `}</style>
    </div>
  );
};

const Description = (fullDetails) => {
  return (
    <div>
      <div className="summary">
        A dog is a type of domesticated animal. Known for its loyalty and
        faithfulness, it can be found as a welcome guest in many households
        across the world.
      </div>
      <div className={`fullDetails fullDetails-off`}>
        Full Details A dog is a type of domesticated animal. Known for its
        loyalty and faithfulness, it can be found as a welcome guest in many
        households across the world.
      </div>
    </div>
  );
};

export default CourseOutlineviewWidget;
