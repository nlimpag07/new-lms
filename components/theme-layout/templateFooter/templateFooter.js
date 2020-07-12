import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout, Row, Col } from "antd";
const { Header, Content, Footer, Sider } = Layout;

const TemplateFooter = () => {
  return (
    <Footer style={{ textAlign: "center" }}>
      <Row className="footer-holder" justify="space-around" align="middle">
        <Col className="gutter-row" xs={0} sm={1} md={1} lg={1}></Col>
        <Col className="gutter-row filled" xs={24} sm={18} md={18} lg={18}>
          Ant Design ©2018 Created by Ant UED
        </Col>
        <Col className="gutter-row" xs={0} sm={5} md={5} lg={5}></Col>
      </Row>
      <style jsx global>{`
        
        footer .footer-holder {
          margin: 0 !important;
        }
        footer .footer-holder .gutter-row {
          border-radius: 1.5rem 1.5rem 0 0;
          height: 42px;
        }
        footer .footer-holder .gutter-row.filled {
          background-color: #4d4d4d;
          padding: 10px;
          color: #989898;
        }
      `}</style>
    </Footer>
  );
};

export default TemplateFooter;
