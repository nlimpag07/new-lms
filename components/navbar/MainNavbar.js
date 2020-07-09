import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout, Row, Col } from "antd";
import { useIsAuthenticated } from "../../providers/Auth";

const MainNavbar = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Layout>
      <Row className="header-nav-top">
        <Col className="nav-top-left" flex="1 1 200px">
          AMS JAFZA Warehouse / JAFZA Dubai, UAE (AMSWS)
        </Col>
        <Col className="nav-top-right" flex="0 1 300px">
          <ul>
            <li className="notif">
              <Link href="/" passHref>
                <a>
                  <FontAwesomeIcon icon={["fas", "bell"]} size="lg" />{" "}
                </a>
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="logout">
                  <Link href="/logout" passHref>
                    <a>
                      <FontAwesomeIcon icon={["fas", "sign-out-alt"]} size="lg" />{" "}
                      Logout
                    </a>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="login">
                  <Link href="/login" passHref>
                    <a>
                      <FontAwesomeIcon icon={["fas", "lock"]} size="lg" /> Login
                    </a>
                  </Link>
                </li>
              </>
            )}
            <li className="language">
              <Link href="/lang" passHref>
                <a>
                  <FontAwesomeIcon icon={["fas", "globe-asia"]} size="lg" /> En
                </a>
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="header-nav-bot">
        <Col className="nav-bot-left" flex="1 1 200px">
          LEFT Bottom NAV
        </Col>
        <Col className="nav-bot-right" flex="0 1 300px">
          <Col className="right-shape">Right Bottom Nav</Col>
        </Col>
      </Row>

      <style jsx global>{`
        .ant-layout-header {
          color: #ffffff;
        }
        .header-nav-top .nav-top-right ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .ant-layout-header .header-nav-top {
          text-align: center;
        }
        .header-nav-top .nav-top-right ul li {
          display: inline-block;
          width: 27%;
          text-align: center;
        }
        .header-nav-top .nav-top-right ul li a,
        .header-nav-top .nav-top-right ul li a:active,
        .header-nav-top .nav-top-right ul li a:focus,
        .header-nav-top .nav-top-right ul li a:visited {
          color: #ffffff;
          text-decoration: none;
        }
        .header-nav-top .nav-top-right ul li a:hover {
          color: #fdb813;
        }
        .ant-layout-header .header-nav-bot .nav-bot-left {
          padding: 0 15px;
        }
        .ant-layout-header .header-nav-bot .nav-bot-right .right-shape {
          color: #000000;
          padding: 0 15px;
        }
      `}</style>
    </Layout>
  );
};

export default MainNavbar;
