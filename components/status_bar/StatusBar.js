import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");

const StatusBar = ({ learner }) => {
  //console.log("Learner", learner);
  const [uType, setUtype] = useState("");
  const [sc, setSc] = useState({
    ac: 0,
    oc: 0,
    cc: 0,
  });

  useEffect(() => {
    if (linkUrl == "learner") {
      setUtype("learner");

      let theCount =
        learner &&
        learner.length &&
        learner.map((l, index) => {
          let totalCounts = { ac: [], oc: [], cc: [] };
          if (l.startDate && l.endDate) {
            setSc({ ...sc, cc: sc.cc + 1 });
          } else if (l.startDate && !l.endDate) {
            setSc({ ...sc, oc: sc.oc + 1 });
          } else {
            setSc({ ...sc, ac: sc.ac + 1 });
          }
        });
    } else {
      setSc({
        ac: 0,
        oc: 0,
        cc: 0,
      });
    }
  }, [linkUrl]);
  //console.log("sc", sc);
  return <StatusContent userType={uType} sc={sc} />;
};

const StatusContent = ({ userType, sc }) => {
  switch (userType) {
    case "learner":
      return (
        //GridType(gridList)
        <Row gutter={[24, 16]} className="status-banner-container">
          <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
            <div className="status-col">
              <h1>{sc.ac}</h1>
              <span>Assigned Courses</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
            <div className="status-col">
              <h1>{sc.oc}</h1>
              <span>On Going</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
            <div className="status-col">
              <h1>{sc.cc}</h1>
              <span>Completed</span>
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
            <div className="status-col current-rank">
              <h1>
                <FontAwesomeIcon icon={["fas", "shield-alt"]} size="lg" />
              </h1>
              <span>Current Rank</span>
            </div>
          </Col>
          <style jsx global>{`
            .status-banner-container .status-col h1 {
              font-size: 5rem;
              font-weight: 700;
              margin: 0 auto;
              padding: 0;
              text-align: center;
              line-height: 5rem;
            }
            .status-banner-container .current-rank h1 {
              font-size: 3rem;
            }
            .status-banner-container .current-rank svg {
              margin-right: 1rem;
            }
            .status-banner-container .status-col span {
              padding-left: 15px;
              font-weight: 700;
            }
            .status-col {
              background: #eeeeee;
              padding: 20px 15px 0 15px;
              min-height: 150px;
            }
          `}</style>
        </Row>
      );
      break;

    default:
      return (
        //GridType(gridList)
        <Col
      className="widget-holder-col"
      xs={24}
      sm={24}
      md={24}
      lg={24}
    >
        <div className="common-holder status-banner-holder">
          <Row gutter={[16]} className="status-banner-container">
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
              <div className="status-col"></div>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
              <div className="status-col"></div>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
              <div className="status-col"></div>
            </Col>
            <Col className="gutter-row" xs={24} sm={12} md={12} lg={6}>
              <div className="status-col current-rank"></div>
            </Col>
            <style jsx global>{`
              .status-banner-container .status-col h1 {
                font-size: 5rem;
                font-weight: 700;
                margin: 0 auto;
                padding: 0;
                text-align: center;
                line-height: 5rem;
              }
              .status-banner-container .current-rank h1 {
                font-size: 3rem;
              }
              .status-banner-container .current-rank svg {
                margin-right: 1rem;
              }
              .status-banner-container .status-col span {
                padding-left: 15px;
                font-weight: 700;
              }
              .status-col {
                background: #eeeeee;
                padding: 20px 15px 0 15px;
                min-height: 150px;
              }
            `}</style>
          </Row>
        </div>
        </Col>
      );
      break;
  }
};

export default StatusBar;
