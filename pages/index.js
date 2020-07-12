import { Carousel, Layout, Row, Col, Button, Modal, Divider } from "antd";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MainThemeLayout from "../components/theme-layout/MainThemeLayout";
import withAuth from "../hocs/withAuth";
import Link from "next/link";

const Home = () => {
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));

  return (
    <MainThemeLayout>
      <Carousel autoplay>
        <div>
          <h3>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.{" "}
          </h3>
        </div>
        <div>
          <h3>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </h3>
        </div>
        <div>
          <h3>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </h3>
        </div>
        <div>
          <h3>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </h3>
        </div>
      </Carousel>
      <Layout className="main-content-holder">
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
export default withAuth(Home);
