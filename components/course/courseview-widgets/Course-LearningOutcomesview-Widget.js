import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Row, Col, Steps, Timeline, Collapse } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Link from "next/link";
const { Step } = Steps;
const { Panel } = Collapse;
const CourseLearninOutcomesviewWidget = ({ course_details }) => {
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



  return (
    <div className="tab-content">
      <Row className="Course-OutlineView">
      <Col xs={24}>
          <Timeline>
            <Timeline.Item color="orange">
              <Collapse
                accordion
                expandIconPosition="right"
                ghost
                expandIcon={({ isActive }) => (
                  <CaretDownOutlined rotate={isActive ? 180 : 0} />
                )}
              >
                <Panel header="Lesson 1. Lorem ipsum dolor sit amet" key="1">
                  {Description()}
                </Panel>
              </Collapse>
            </Timeline.Item>
            <Timeline.Item color="orange">
              <Collapse
                accordion
                expandIconPosition="right"
                ghost
                expandIcon={({ isActive }) => (
                  <CaretDownOutlined rotate={isActive ? 180 : 0} />
                )}
              >
                <Panel
                  header="Lesson 2. Duis aute irure dolor in reprehenderit in voluptate "
                  key="1"
                >
                  {Description()}
                </Panel>
              </Collapse>
            </Timeline.Item>
            <Timeline.Item color="orange">
              <Collapse
                accordion
                expandIconPosition="right"
                ghost
                expandIcon={({ isActive }) => (
                  <CaretDownOutlined rotate={isActive ? 180 : 0} />
                )}
              >
                <Panel
                  header="Lesson 3. Excepteur sint occaecat cupidatat non proident"
                  key="1"
                >
                  {Description()}
                </Panel>
              </Collapse>
            </Timeline.Item>
          </Timeline>
        </Col>
      </Row>

      <style jsx global>{`
        .fullDetails-off {
          display: none;
        }
        .fullDetails-shown {
          display: block;
        }
        .Course-OutlineView
          .ant-collapse-icon-position-right
          > .ant-collapse-item
          > .ant-collapse-header {
          padding: 0;
        }

        .Course-OutlineView .ant-timeline-item-head {
          background-color: #ff8c00;
          width: 15px;
          height: 15px;
          top:-2px;
        }
        .Course-OutlineView .ant-timeline-item-tail {
          left: 6px;
        }
        .Course-OutlineView .ant-collapse-header{
          font-weight:500;
        }
        .Course-OutlineView .ant-timeline{padding-top:1rem;}
      `}</style>
    </div>
  );
};

const Description = () => {
  return (
    <div>
      <div className="summary">
        A dog is a type of domesticated animal. Known for its loyalty and
        faithfulness, it can be found as a welcome guest in many households
        across the world.
      </div>
      <div className={`fullDetails fullDetails-shown`}>
        Full Details A dog is a type of domesticated animal. Known for its
        loyalty and faithfulness, it can be found as a welcome guest in many
        households across the world.
      </div>
    </div>
  );
};

export default CourseLearninOutcomesviewWidget;
