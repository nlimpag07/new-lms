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
        <Col className="widget-holder-col" xs={24} sm={24} md={24} lg={24}>
          <div className="common-holder status-banner-holder">
            <Row
              gutter={[16]}
              className="status-banner-container"
            >
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col assigned">
                  <span>Assigned Courses</span>
                  <h1>{sc.ac}</h1>
                  <div className="borderIdentifier">
                    <div className="topThird"></div>
                    <div className="botFull"></div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col inprogress">
                  <span>On Going</span>
                  <h1>{sc.oc}</h1>
                  <div className="borderIdentifier">
                    <div className="topThird"></div>
                    <div className="botFull"></div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col completed">
                  <span>Completed</span>
                  <h1>{sc.cc}</h1>
                  <div className="borderIdentifier">
                    <div className="topThird"></div>
                    <div className="botFull"></div>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col current-rank rank">
                  <span>Current Rank</span>
                  <h1>
                    <FontAwesomeIcon icon={["fas", "shield-alt"]} size="lg" />
                  </h1>
                  <div className="borderIdentifier">
                    <div className="topThird"></div>
                    <div className="botFull"></div>
                  </div>
                </div>
              </Col>
              <style jsx global>{`
                .status-banner-container .status-col h1 {
                  font-size: 5rem;
                  font-weight: 700;
                  margin: 0 auto;
                  padding: 0;
                  text-align: right;
                  line-height: 5rem;
                }
                .status-banner-container .current-rank h1 {
                  font-size: 3rem;
                }
                .status-banner-container .current-rank svg {
                  margin-right: 1rem;
                }
                .status-banner-container .status-col span {
                  /* padding-left: 15px; */
                  font-weight: 700;
                  text-transform: uppercase;
                }

                .status-col {
                  background: #ffffff;
                  padding: 20px 15px 0 15px;
                  min-height: 150px;
                  box-shadow: 1px 0px 5px #333333;
                }
                .status-col .borderIdentifier {
                  height: auto;
                }
                .assigned {
                  box-shadow: 1px 0px 5px #e6505038;
                }
                .inprogress {
                  box-shadow: 1px 0px 5px #ffbc1c38;
                }
                .completed {
                  box-shadow: 1px 0px 5px #85d87138;
                }
                .rank {
                  box-shadow: 1px 0px 5px #7cb7ea38;
                }

                .status-col.assigned .borderIdentifier > div {
                  background-color: #e65050;
                }
                .status-col.inprogress .borderIdentifier > div {
                  background-color: #ffbc1c;
                }
                .status-col.completed .borderIdentifier > div {
                  background-color: #85d871;
                }
                .status-col.rank .borderIdentifier > div {
                  background-color: #7cb7ea;
                }

                .status-col .topThird {
                  width: 45%;
                  height: 7px;
                }
                .status-col .botFull {
                  width: 100%;
                  height: 5px;
                }
              `}</style>
            </Row>
          </div>
        </Col>
      );
      break;

    default:
      return (
        //GridType(gridList)
        <Col className="widget-holder-col" xs={24} sm={24} md={24} lg={24}>
          <div className="common-holder status-banner-holder">
            <Row gutter={[16]} className="status-banner-container">
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col"></div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col"></div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                <div className="status-col"></div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
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
