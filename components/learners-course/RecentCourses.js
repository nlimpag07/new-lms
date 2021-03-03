import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Row, Col, Modal, Card, Empty, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCourseList } from "../../providers/CourseProvider";
import Loader from "../theme-layout/loader/loader";
import Cookies from "js-cookie";

import { EyeOutlined } from "@ant-design/icons";
const { Meta } = Card;
import { motion } from "framer-motion";

const list = {
  visible: {
    opacity: 1,
    transition: {
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const RecentCourses = ({ courses }) => {
  const { courseAllList, setCourseAllList } = useCourseList();
  const router = useRouter();
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [loading, setLoading] = useState(true);
  //console.log(RecentCoursesList)
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Col
      className="gutter-row widget-holder-col"
      xs={24}
      sm={24}
      md={24}
      lg={16}
    >
      <Row className="widget-header-row" justify="start">
        <Col xs={22} sm={23}>
          <h3 className="widget-title">Recent Courses</h3>
        </Col>
        <Col xs={22} sm={1} className="widget-switchgrid-holder">
          <button
            className="switch-grid"
            key="Switch"
            onClick={() =>
              setCurGridStyle(curGridStyle == "grid" ? "list" : "grid")
            }
          >
            <FontAwesomeIcon
              icon={["fas", `th-${curGridStyle == "grid" ? "list" : "large"}`]}
              size="lg"
            />
          </button>
        </Col>
      </Row>
      <div className="common-holder">
        <Row
          className="RecentCourses-ListItems"
          gutter={[16, 16]}
          style={{ padding: "10px 0" }}
        >
          {GridType(courses, curGridStyle, setModal2Visible, router, loading)}
        </Row>
      </div>
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
        .ant-card-actions > li {
          padding: 12px 0;
          margin: 0;
        }
        .ant-card-actions > li:hover {
          background-color: #f0f0f0;
          margin: 0;
        }
        .widget-holder-col .widget-title {
          color: #e69138;
          margin-bottom: 0;
          text-transform: uppercase;
        }
        .widget-holder-col .widget-header-row {
          padding: 5px 10px;
          color: #e69138;
        }
        .widget-holder-col .widget-header-row .widget-switchgrid-holder {
          text-align: center;
        }
        .widget-holder-col .widget-header-row .switch-grid {
          vertical-align: middle;
          font-weight: 900;
          border: none;
          outline: none;
        }
        .widget-holder-col .widget-header-row .switch-grid:hover,
        .widget-holder-col .widget-header-row .switch-grid:focus {
          cursor: pointer;
          outline: none;
        }
        .widget-holder-col .ant-card-body {
          padding: 10px;
        }
        .widget-holder-col .ant-card-head {
          float: right;
          position: absolute;
          right: 5px;
          top: 5px;
          background-color: #62ab35bf;
          border-radius: 15px;
          padding: 0 10px;
          font-size: 12px;
          color: #ffffff;
          padding: 7px 10px;
          font-size: 12px;
          min-height: 0;
          border-bottom: none;
        }
        .widget-holder-col .ant-card-head .ant-card-extra {
          color: #ffffff;
          padding: 0 0;
          font-size: 12px;
        }
        .grid-list .ant-card-cover {
          width: 33.5%;
        }
        .grid-list .ant-card-cover,
        .grid-list .ant-card-body {
          float: left;
          position: relative;
        }
        .grid-list .ant-card-actions {
          float: none;
          clear: both;
          position: relative;
        }
        .widget-holder-col .published-course .ant-card-head {
          background-color: #62ab35bf;
        }
        .widget-holder-col .unpublished-course .ant-card-head {
          background-color: #ff572294;
        }
        .widget-holder-col .ant-card-hoverable {
          cursor: default;
        }
        .widget-holder-col .ant-card-meta-title a {
          color: #000000;
        }
        .widget-holder-col .ant-card-meta-title a:hover {
          color: #e69138;
        }
        .widget-holder-col .ant-card-cover a img {
          width: 100%;
        }
      `}</style>
    </Col>
  );
};

const GridType = (courses, gridType, setModal2Visible, router, loading) => {
  let gridClass = "";
  let gridProps = { xs: 24, sm: 24, md: 8, lg: 8, xl: 8 };
  if (gridType == "list") {
    gridProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
    gridClass = "grid-list";
  }
  console.log("My Recent Courses:", courses);
  const descTrimmerDecoder = (desc) => {
    let d = decodeURI(desc);
    let trimmedDesc = d.substr(0, 250);
    return trimmedDesc + "...";
  };
  return courses.length ? (
    <>
      {courses.map((course, index) => (
        <Col key={index} className={`gutter-row ${gridClass}`} {...gridProps}>
          <motion.div initial="hidden" animate="visible" variants={list}>
            <Card
              className={
                course.startDate ? "published-course" : "unpublished-course"
              }
              extra={
                course.startDate
                  ? "In Progress"
                  : course.endDate
                  ? "Completed"
                  : "Not Started"
              }
              hoverable
              style={{ width: "auto" }}
              cover={
                <Link
                  href={`/${linkUrl}/[course-catalogue]/[...manage]`}
                  as={`/${linkUrl}/course-catalogue/view/${course.course.id}`}
                >
                  <a>
                    <img
                      alt={`${course.course.title}`}
                      src={`${apidirectoryUrl}/Images/Course/thumbnail/${course.course.featureImage}`}
                    />
                  </a>
                </Link>
              }
              actions={[
                <Tooltip title="View">
                  <div
                    className="class-icon-holder"
                    onClick={() =>
                      router.push(
                        `/${linkUrl}/[course-catalogue]/[...manage]`,
                        `/${linkUrl}/course-catalogue/view/${course.course.id}`
                      )
                    }
                  >
                    <EyeOutlined
                      key="View"
                      //onClick={() => setModal2Visible(true)}
                    />
                  </div>
                </Tooltip>,
              ]}
            >
              <Meta
                title={
                  <Link
                    href={`/${linkUrl}/[course-catalogue]/[...manage]`}
                    as={`/${linkUrl}/course-catalogue/view/${course.course.id}`}
                  >
                    <a>{course.course.title}</a>
                  </Link>
                }
                description={
                  <div>
                    <div>{descTrimmerDecoder(course.course.description)}</div>
                    <div>Public</div>
                  </div>
                }
              />
            </Card>
          </motion.div>
        </Col>
      ))}
    </>
  ) : (
    <Loader loading={loading}>
      <Empty />
    </Loader>
  );
};

export default RecentCourses;
