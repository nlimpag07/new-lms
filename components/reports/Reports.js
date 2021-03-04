import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Collapse, Modal } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";

const { Panel } = Collapse;

const apiBaseUrl = process.env.apiBaseUrl;

const list = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const Reports = ({ userlist }) => {
  const router = useRouter();
  console.log(userlist);

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [courseDetails, setCourseDetails] = useState("");

  function callback(key) {
    console.log(key);
  }

  const text = `
    A dog is a type of domesticated animal.
    Known for its loyalty and faithfulness,
    it can be found as a welcome guest in many households across the world.
  `;

  useEffect(() => {}, []);

  return (
    //GridType(gridList)
    <Row
      className="widget-container"
      /* gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} 
      style={{ margin: "1rem 0" }}*/
    >
      <Row className="reports">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={list}
          style={{ width: "100%" }}
        >
          <Collapse
            defaultActiveKey={["1", "2", "3"]}
            onChange={callback}
            expandIcon={({ isActive }) => (
              <CaretDownOutlined rotate={isActive ? 180 : 0} />
            )}
            expandIconPosition="right"
          >
            <Panel header={<h3>Reports</h3>} key="1">
              <Row
                className="gutter-row report-collapse-row"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/reports/preassessment"
                    as={`/administrator/reports/preassessment`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "cube"]} size="3x" />{" "}
                      Preassessment Reports
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/reports/coursepostevaluation"
                    as={`/administrator/reports/coursepostevaluation`}
                  >
                    <a>
                      <FontAwesomeIcon
                        icon={["fas", "map-marker-alt"]}
                        size="3x"
                      />{" "}
                      Post Evaluation Reports
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/reports"
                    as={`/administrator/reports`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "language"]} size="3x" />{" "}
                      Language
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/reports"
                    as={`/administrator/reports`}
                  >
                    <a>
                      <FontAwesomeIcon
                        icon={["fas", "hourglass-start"]}
                        size="3x"
                      />{" "}
                      Status
                    </a>
                  </Link>
                </Col>
              </Row>
            </Panel>
          </Collapse>
        </motion.div>
      </Row>
      {/* <CourseCircularUi /> */}
      <Modal
        title="Publish Properties"
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
      <style jsx global>{`
        .reports {
          width: 100%;
        }
        .reports h3 {
          font-weight: 600;
          margin: 0;
          padding: 0;
        }
        /* .reports
          .ant-collapse-icon-position-right
          > .ant-collapse-item
          > .ant-collapse-header {
          background-color: #eeeeee;
        } */
        .reports .gutter-row .ant-col {
          display: flex;
          align-items: center;
        }
        .reports .gutter-row .ant-col a {
          display: contents;
          font-size: 1.1rem;
          font-weight: 500;
          color: #4d4d4d;
        }
        .reports .gutter-row .ant-col a svg {
          margin-right: 1rem;
        }
        .report-collapse-row {
          padding: 1rem 0;
        }
      `}</style>
    </Row>
  );
};

export default Reports;
