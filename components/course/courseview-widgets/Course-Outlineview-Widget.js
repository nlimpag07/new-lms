import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Row, Col, Steps, Timeline, Collapse, Empty } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Loader from "../../../components/theme-layout/loader/loader";

import Link from "next/link";
const { Step } = Steps;
const { Panel } = Collapse;
const CourseOutlineviewWidget = ({ course_outline }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const onChange = (current) => {
    //console.log("onChange:", current);
    setCurrent(current);
  };
 
  return (
    <div className="tab-content">
      <Row className="Course-OutlineView">
        <Col xs={24}>
          <Timeline>
            {OutlinePanels(course_outline,loading)}
            {/* <Timeline.Item color="orange">
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
            </Timeline.Item> */}
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
          top: -2px;
        }
        .Course-OutlineView .ant-timeline-item-tail {
          left: 6px;
        }
        .Course-OutlineView .ant-collapse-header {
          font-weight: 500;
        }
        .Course-OutlineView .ant-timeline {
          padding-top: 1rem;
        }
      `}</style>
    </div>
  );
};

const OutlinePanels = (course_outline, loading) => {
  //console.log('Course Outline: ',course_outline)
  return course_outline ? (
    course_outline.result.map((outline, index) => (
      <Timeline.Item color="orange" key={index}>
        <Collapse
          defaultActiveKey={outline.id}
          accordion
          expandIconPosition="right"
          ghost
          expandIcon={({ isActive }) => (
            <CaretDownOutlined rotate={isActive ? 180 : 0} />
          )}
        >
          <Panel header={outline.title} key={outline.id}>
            {outline.description}
          </Panel>
        </Collapse>
      </Timeline.Item>
    ))
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default CourseOutlineviewWidget;
