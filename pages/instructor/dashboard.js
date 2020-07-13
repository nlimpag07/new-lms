import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout, Row, Col, Button, Modal, Divider, Card, Avatar } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";

import AuthoredCourses from "../../components/course/AuthoredCoursesGrid";

import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const Dashboard = () => {
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [curGridStyle, setCurGridStyle] = useState("grid");


  useEffect(() => {
    //setCurGridStyle();
  }, []);

  return (
    <MainThemeLayout>
      <Layout className="main-content-holder">
        <Row gutter={[24, 16]} className="status-banner-container">
          <Col className="gutter-row" xs={24} sm={12} md={6}>
            <div className="status-col"> </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={6}>
            <div className="status-col"> </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={6}>
            <div className="status-col"> </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={6}>
            <div className="status-col"> </div>
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ margin: "1rem 0" }}
        >
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
              <Col xs={1}><UnorderedListOutlined className="switch-grid" key="Switch" onClick={() => setCurGridStyle(
                    curGridStyle == "grid" ? "list" : "grid"
                  )} />
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ padding: "10px 0" }}>
              <AuthoredCourses gridList={curGridStyle} />
              <AuthoredCourses gridList={curGridStyle} />

              <AuthoredCourses gridList={curGridStyle} />

              {/* <Col className="gutter-row" xs={24} sm={24} md={8} lg={8}>
                <Card
                  extra="Published"
                  hoverable
                  style={{ width: "auto" }}
                  cover={
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  }
                  actions={[
                    <CloudUploadOutlined key="Publish" />,
                    <EditOutlined key="edit" />,
                    <EyeOutlined key="View" />,
                  ]}
                >
                  <Meta
                    title="Card title"
                    description={
                      <div>
                        <div>Instructor-led Training</div>
                        <div>Public</div>
                      </div>
                    }
                  />
                </Card>
              </Col> */}
            </Row>
          </Col>
          <Col
            className="gutter-row widget-holder-col"
            xs={24}
            sm={24}
            md={8}
            lg={8}
          >
            <Row className="widget-header-row">
              <h3 className="widget-title">To Do's</h3>
            </Row>
            <Row style={{ padding: "10px 0" }}>asdasdasdsa</Row>
          </Col>
        </Row>
        <Row>
          <h1 className="our-features-h1">Our Features</h1>
        </Row>

        <Row className="our-features" gutter={[24, 16]}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={16}>
            <Row gutter={[24, 24]}>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "tag"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "tv"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "shield-alt"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "thumbs-up"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col className="explore-features-btn-holder" xs={24}>
                <Button
                  className="explore-features-btn"
                  type="default"
                  shape="round"
                  size="large"
                >
                  Explore All Features
                </Button>
              </Col>
            </Row>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={7} offset={1}>
            <Row gutter={[24, 24]}>
              <h2 className="our-features-h1">What Is Accelerate?</h2>
            </Row>
            <Row gutter={[24, 24]} className="features-video-holder">
              <img
                src="/images/what-is-accelerate.png"
                alt="What is Accelerate"
                onClick={() => setModal2Visible(true)}
              />
            </Row>
          </Col>
        </Row>
        {/* NLI - Hear From Out Customers */}
        <Divider dashed className="features-divider" />
        <Row>
          <h1 className="our-features-h1">Hear From Our Customers</h1>
        </Row>
        <Row className="our-features" gutter={[24, 16]}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={16}>
            <Row gutter={[24, 24]}>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "tag"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "tv"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "shield-alt"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
              <Col className="gutter-row" xs={24} sm={12} md={12}>
                <p className="features-icon">
                  <FontAwesomeIcon icon={["fas", "thumbs-up"]} size="lg" />
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt.
                </p>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <div className="knowmore">
                  <h2 className="highlight">
                    Want to know more? Try Accelerate now!
                  </h2>
                  <p>Don't worry, it's FREE.</p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={7} offset={1}>
            <Row gutter={[24, 24]}>
              <h2 className="our-features-h1">What Is Accelerate?</h2>
            </Row>
            <Row gutter={[24, 24]} className="features-video-holder">
              <img
                src="/images/what-is-accelerate.png"
                alt="What is Accelerate"
                onClick={() => setModal2Visible(true)}
              />
            </Row>
          </Col>
        </Row>
      </Layout>
      <Modal
        title="What is Accelerate Video"
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
      <style jsx global>{`
        .status-col {
          background: #eeeeee;
          padding: 8px 0;
          min-height: 150px;
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
        }
        .widget-holder-col .widget-header-row {
          background-color: #eeeeee;
          padding: 5px 10px;
          color: #e69138;
        }
        .widget-holder-col .widget-header-row .switch-grid{
          font-weight:700;
          font-size:16px;
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
        }
        .widget-holder-col .ant-card-head .ant-card-extra {
          color: #ffffff;
          padding: 0 0;
          font-size: 12px;
        }
        /**********DELETE AFTER HERE*************/

        .ant-carousel .slick-slide {
          text-align: center;
          height: 160px;
          line-height: 160px;
          background: #eeeeee;
          overflow: hidden;
        }

        .ant-carousel .slick-slide h3 {
          color: #000;
        }
        .ant-carousel .slick-dots li button {
          border-radius: 50%;
          border: 1px solid #000000;
          height: 16px;
        }
        .ant-carousel .slick-dots li.slick-active {
          width: 16px;
        }
        .ant-carousel .slick-dots li.slick-active button {
          background: #000;
        }
        .main-content-holder {
          margin-top: 15px;
          padding-right: 15px;
        }
        .main-content-holder h1,
        .main-content-holder h2,
        .main-content-holder h3 {
          color: #e69138;
        }
        .main-content-holder h1 {
          font-size: 2rem;
        }
        .our-features {
          color: #000000;
          font-size: 1rem;
        }
        .our-features .features-icon {
          font-size: 4rem;
          float: left;
        }
        .our-features p {
          padding: 1rem 2rem;
          font-weight: 400;
        }
        .our-features .explore-features-btn-holder {
          text-align: center;
        }
        .our-features .explore-features-btn-holder .explore-features-btn {
          padding: 1rem 2rem;
          height: auto;
          font-weight: 500;
          text-transform: capitalize;
          letter-spacing: 0.5px;
        }
        .our-features .explore-features-btn-holder .ant-btn:hover,
        .our-features .explore-features-btn-holder .ant-btn:focus {
          color: #e69138;
          border-color: #e69138;
        }
        .our-features .features-video-holder img {
          border: 1px solid #333333;
        }
        .our-features .features-video-holder img:hover {
          cursor: pointer;
          border: 1px solid #e69138;
        }
        .knowmore {
          background-color: #eeeeee;
          padding: 2rem;
          text-align: center;
        }
        .knowmore h2 {
          font-size: 2.5rem;
          margin-bottom: 0.2rem;
        }
        .knowmore p {
          padding: 0;
        }
        .features-divider.ant-divider-dashed {
          border-color: none;
          border-style: dashed;
          border-width: 0 0 0;
        }
      `}</style>
    </MainThemeLayout>
  );
};

export default withAuth(Dashboard);
