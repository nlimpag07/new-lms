import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const StatusBar = () => {
  return (
    //GridType(gridList)
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
      <style jsx global>{`
        .status-col {
          background: #eeeeee;
          padding: 8px 0;
          min-height: 150px;
        }
      `}</style>
    </Row>
  );
};

export default StatusBar;
