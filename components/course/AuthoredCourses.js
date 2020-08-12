import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Row, Col, Button, Modal, Divider, Card, Avatar, Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCourseList } from "../../providers/CourseProvider";
import Loader from "../../components/theme-layout/loader/loader";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
import { motion } from "framer-motion";

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


const AuthoredCourses = () => {
  const apiBaseUrl = process.env.apiBaseUrl;
  const router = useRouter();
  const { courseAllList, setCourseAllList } = useCourseList();
  const [curGridStyle, setCurGridStyle] = useState("grid");
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!courseAllList) {
      const courselist = JSON.parse(localStorage.getItem("courseAllList"));
      //console.log(userData);
      setCourseAllList(courselist);
    } else {
      //put additional Filtration here
    }
    setLoading(false);
  }, [courseAllList]);
  return (
    //GridType(gridList)
    <Col
      className="gutter-row widget-holder-col"
      xs={24}
      sm={24}
      md={16}
      lg={16}
    >
      <Row className="widget-header-row" justify="start">
        <Col xs={23}>
          <h3 className="widget-title">Authored Courses</h3>
        </Col>
        <Col xs={1} className="widget-switchgrid-holder">
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
      <Row
        className="AuthoredCourses-ListItems"
        gutter={[16, 16]}
        style={{ padding: "10px 0" }}
      >
        {GridType(courseAllList, curGridStyle, setModal2Visible, router, loading)}
      </Row>
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
        .AuthoredCourses-ListItems .ant-card-actions > li {
          padding: 12px 0;
          margin: 0;
        }
        .AuthoredCourses-ListItems .ant-card-actions > li:hover {
          background-color: #f0f0f0;
          margin: 0;
        }
        .widget-holder-col:nth-child(even) {
          padding-right: 0px !important;
          padding-left: 10px !important;
        }

        .widget-holder-col:nth-child(odd) {
          padding-left: 0px !important;
          padding-right: 10px !important;
        }
        .widget-holder-col .widget-title {
          color: #e69138;
          margin-bottom: 0;
          text-transform: uppercase;
        }
        .widget-holder-col .widget-header-row {
          background-color: #eeeeee;
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

  return courses ? (
    <>
      {courses.map((course) => (
        <Col
          key={course.id}
          className={`gutter-row ${gridClass}`}
          {...gridProps}
        >
          <motion.div initial="hidden" animate="visible" variants={list}>
            <Card
              className={
                course.isPublished ? "published-course" : "unpublished-course"
              }
              extra={course.isPublished ? "Published" : "Unpublished"}
              hoverable
              style={{ width: "auto" }}
              cover={<img alt="example" src={course.featureImage} />}
              actions={[
                <CloudDownloadOutlined
                  key="Unpublish"
                  onClick={() => setModal2Visible(true)}
                />,
                <EditOutlined
                  key="edit"
                  onClick={() =>
                    router.push(
                      `/instructor/[course]/[...manage]`,
                      `/instructor/course/edit/${course.id}`
                    )
                  }
                />,
                <EyeOutlined
                  key="View"
                  //onClick={() => setModal2Visible(true)}
                  onClick={() =>
                    router.push(
                      `/instructor/[course]/[...manage]`,
                      `/instructor/course/view/${course.id}`
                    )
                  }
                />,
              ]}
            >
              <Meta
                title={
                  <Link
                    href={`/instructor/[course]/[...manage]`}
                    as={`/instructor/course/view/${course.id}`}
                  >
                    <a>{course.title}</a>
                  </Link>
                }
                description={
                  <div>
                    <div>{course.description}</div>
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

export default AuthoredCourses;
