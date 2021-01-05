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

const PickLists = ({ userlist }) => {
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
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      <Row className="pickLists">
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
            <Panel header={<h3>Global Settings</h3>} key="1">
              <Row
                className="gutter-row picklist-collapse-row"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/departments"
                    as={`/administrator/picklists/departments`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "cube"]} size="3x" />{" "}
                      Department
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/locations"
                    as={`/administrator/picklists/locations`}
                  >
                    <a>
                      <FontAwesomeIcon
                        icon={["fas", "map-marker-alt"]}
                        size="3x"
                      />{" "}
                      Locations
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/languages"
                    as={`/administrator/picklists/languages`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "language"]} size="3x" />{" "}
                      Language
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/status"
                    as={`/administrator/picklists/status`}
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
            <Panel header={<h3>Courses</h3>} key="2">
              <Row
                className="gutter-row picklist-collapse-row"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/levels"
                    as={`/administrator/picklists/levels`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "chart-line"]} size="3x" />{" "}
                      Level
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/categories"
                    as={`/administrator/picklists/categories`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "map-signs"]} size="3x" />{" "}
                      Course Categories
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/coursetypes"
                    as={`/administrator/picklists/coursetypes`}
                  >
                    <a>
                      <FontAwesomeIcon icon={["fas", "columns"]} size="3x" />{" "}
                      Course Types
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  {/* <Link
                    href="/administrator/picklists"
                    as={`/administrator/picklists`}
                  >
                    <a>
                      <FontAwesomeIcon
                        icon={["fas", "hourglass-start"]}
                        size="3x"
                      />{" "}
                      Status
                    </a>
                  </Link> */}
                </Col>
              </Row>
            </Panel>
            <Panel header={<h3>Users</h3>} key="3">
              <Row
                className="gutter-row picklist-collapse-row"
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              >
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists/roles"
                    as={`/administrator/picklists/roles`}
                  >
                    <a>
                      <FontAwesomeIcon
                        icon={["fas", "user-secret"]}
                        size="3x"
                      />{" "}
                      Roles
                    </a>
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6} lg={6}>
                  <Link
                    href="/administrator/picklists"
                    as={`/administrator/picklists`}
                  >
                    <a>
                      <FontAwesomeIcon
                        icon={["far", "address-card"]}
                        size="3x"
                      />{" "}
                      Access Matrix
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
        .pickLists {
          width: 100%;
        }
        .pickLists h3 {
          font-weight: 600;
          margin: 0;
          padding: 0;
        }
        .pickLists
          .ant-collapse-icon-position-right
          > .ant-collapse-item
          > .ant-collapse-header {
          background-color: #eeeeee;
        }
        .pickLists .gutter-row .ant-col {
          display: flex;
          align-items: center;
        }
        .pickLists .gutter-row .ant-col a {
          display: contents;
          font-size: 1.1rem;
          font-weight: 500;
          color: #4d4d4d;
        }
        .pickLists .gutter-row .ant-col a svg {
          margin-right: 1rem;
        }
        .picklist-collapse-row {
          padding: 1rem 0;
        }
      `}</style>
    </Row>
  );
};

export default PickLists;
