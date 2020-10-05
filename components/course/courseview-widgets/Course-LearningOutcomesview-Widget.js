import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { Row, Col, Steps, Timeline, Collapse, Empty } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Loader from "../../../components/theme-layout/loader/loader";

import Link from "next/link";
const { Step } = Steps;
const { Panel } = Collapse;
const CourseLearninOutcomesviewWidget = ({ course_outcome }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const onChange = (current) => {
    //console.log("onChange:", current);
    setCurrent(current);
  };
  course_outcome = course_outcome.result;
  return (
    <div className="tab-content">
      <Row className="Course-OutlineView">
        <Col xs={24}>
          <Timeline>
            {OutComePanels(course_outcome,loading)}            
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

const OutComePanels = (courseoutcome,loading) => {
  return courseoutcome.length ? (
    courseoutcome.map((outcome,index) => (
      <Timeline.Item color="orange" key={index}>
        <Collapse
          defaultActiveKey={outcome.id}
          accordion
          expandIconPosition="right"
          ghost
          expandIcon={({ isActive }) => (
            <CaretDownOutlined rotate={isActive ? 180 : 0} />
          )}
        >
          <Panel header={outcome.title} key={outcome.id}>
            {outcome.description}
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

export default CourseLearninOutcomesviewWidget;

