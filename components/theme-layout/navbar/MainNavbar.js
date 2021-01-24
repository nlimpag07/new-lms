import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Layout,
  Row,
  Col,
  Badge,
  Avatar,
  Menu,
  Dropdown,
  Modal,
  Select,
} from "antd";
import { useIsAuthenticated, useAuth } from "../../../providers/Auth";
import {
  DownOutlined,
  ProfileFilled,
  EyeFilled,
  UserOutlined,
} from "@ant-design/icons";
import Notifications from "./Notifications";
import { callbackify } from "util";

//import UserRoleSwitcher from "../../user/UserRoleSwitcher";
const { Option } = Select;

const MainNavbar = ({ userRole }) => {
  const router = useRouter();
  const thePath = router.asPath;
  var currentPage;
  var cPage = thePath.split("/");
  cPage = cPage[cPage.length - 1];
  switch (cPage) {
    case "administrator":
      currentPage = "dashboard";
      break;
    case "instructor":
      currentPage = "dashboard";
      break;
    case "learner":
      currentPage = "dashboard";
      break;
    case "profile":
      currentPage = "profile";
      break;
    default:
      const parsed = parseInt(cPage);
      if (!isNaN(parsed)) {
        let pathSplit = thePath.split("/");
        let curPageMinus2 = pathSplit[pathSplit.length - 2];
        currentPage = curPageMinus2;
      } else {
        currentPage = cPage;
      }

      break;
  }
  /* currentPage =
    currentPage ==  ||
    currentPage == "learner" ||
    currentPage == "instructor"
      ? "dashboard"
      : currentPage; */
  //console.log('As Path',currentPage)

  const { isUsertype, setUsertype, userDetails } = useAuth();
  const isAuthenticated = useIsAuthenticated();
  var [switchViewModal, setSwitchViewModal] = useState(
    (switchViewModal = false)
  );

  /* useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDetails"));
    console.log(userData);
  }, []); */
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <Layout>
      <Row className="header-nav-top" justify="space-between">
        <Col xs={0} sm={0} md={0} lg={16} className="nav-top-left" /* flex="1 1" */>
          <span className="navLocationContainer">
            AMS JAFZA Warehouse / JAFZA Dubai, UAE (AMSWS)
          </span>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={6}
          className="nav-top-right" /* flex="0 1 25%" */
        >
          <Row justify="end">
            <Col xs ={8} lg={6}>
              <Notifications />
            </Col>
            <Col xs ={8} lg={6}>
              {isAuthenticated ? (
                <Dropdown overlay={profileMenu(userRole)} trigger={["click"]}>
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Avatar
                      icon={
                        <FontAwesomeIcon icon={["fas", "user"]} size="1x" />
                      }
                      style={{
                        color: "#ebebeb",
                        backgroundColor: "#707070",
                      }}
                    />
                  </a>
                </Dropdown>
              ) : (
                <Link href="/login" passHref>
                  <a>
                    <FontAwesomeIcon icon={["fas", "lock"]} size="lg" /> Login
                  </a>
                </Link>
              )}
            </Col>
            <Col xs={8} lg={6}>
              <Link href="/lang" passHref>
                <a>
                  <Avatar
                    icon={
                      <FontAwesomeIcon icon={["fas", "globe-asia"]} size="1x" />
                    }
                    style={{
                      color: "#ebebeb",
                      backgroundColor: "#707070",
                    }}
                  />
                  {/* <FontAwesomeIcon icon={["fas", "globe-asia"]} size="lg" />  En*/}
                </a>
              </Link>
            </Col>
          </Row>
          {/* <ul>
            <li className="notif">
              <Notifications />
            </li>
            {isAuthenticated ? (
              <>
                <li className="logout">
                  <Dropdown overlay={profileMenu(userRole)} trigger={["click"]}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Avatar
                        icon={
                          <FontAwesomeIcon icon={["fas", "user"]} size="1x" />
                        }
                        style={{
                          color: "#ebebeb",
                          backgroundColor: "#707070",
                        }}
                      />
                    </a>
                  </Dropdown>
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
            <li className="lang">
              <Link href="/lang" passHref>
                <a>
                  <Avatar
                    icon={
                      <FontAwesomeIcon icon={["fas", "globe-asia"]} size="1x" />
                    }
                    style={{
                      color: "#ebebeb",
                      backgroundColor: "#707070",
                    }}
                  />
                  
                </a>
              </Link>
            </li>
          </ul> */}
        </Col>
      </Row>
      <Row className="header-nav-bot" justify="space-center">
        <Col xs={24} sm={24} md={14} md={18} className="nav-bot-left" flex="1 1 200px">
          <Row justify="start" align="bottom" style={{ height: "100%" }}>
            <div className="pageHeaderHolder">
              <div className="pageHeaderTitle">
                <span>{currentPage}</span>
              </div>
              <div className="phTitleIdentifier"></div>
            </div>
          </Row>
        </Col>
        <Col xs={0} sm={0} md={6} md={6} className="nav-bot-right" flex="0 1 25%">
          <Row className="right-shape">
            <div style={{ width: "100%" }}>
              GROUP{" "}
              <Select
                defaultValue="Branch 1"
                style={{ width: "calc(90% - 20px)" }}
                onChange={handleChange}
              >
                <Option value="Branch 1">Branch 1</Option>
                <Option value="Branch 2">Branch 2</Option>
              </Select>
            </div>
          </Row>
        </Col>
      </Row>
      {/* <UserRoleSwitcher visible={switchViewModal} onCancel={() => setSwitchViewModal(false)} /> */}
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

        .header-nav-top .nav-top-right .notif,
        .header-nav-top .nav-top-right .lang {
          /*  width:30%; */
        }
        .header-nav-top .nav-top-right .logout {
          /* width:40%; */
        }
        .header-nav-top .nav-top-right ul li {
          display: inline-block;
          padding: 0 1rem;
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
        /* .ant-layout-header .header-nav-bot .nav-bot-right .right-shape {
          color: #000000;
          padding: 0 15px;
        } */
        .notif .ant-badge {
          display: inline;
        }
        .notif .ant-badge-dot {
          box-shadow: none;
        }
      `}</style>
    </Layout>
  );
};

const profileMenu = (userRole) => {
  var menuItems;
  switch (userRole) {
    case "administrator":
      menuItems = (
        <Menu>
          <Menu.Item key="0">
            <Link href={`/${userRole}/profile`} as={`/${userRole}/profile`}>
              <a>
                <ProfileFilled /> Profile
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="1">
            <Link href={`/${userRole}/users`} as={`/${userRole}/users`}>
              <a>
                <FontAwesomeIcon icon={["fas", "users"]} size="1x" /> Users
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href={`/${userRole}/picklists`} as={`/${userRole}/picklists`}>
              <a>
                <FontAwesomeIcon icon={["fas", "sliders-h"]} size="1x" />{" "}
                Picklists
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="/logout" passHref>
              <a>
                <FontAwesomeIcon icon={["fas", "sign-out-alt"]} size="lg" />{" "}
                Logout
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      );
      break;
    case "instructor":
      menuItems = (
        <Menu>
          <Menu.Item key="0">
            <Link href={`/${userRole}/profile`} as={`/${userRole}/profile`}>
              <a>
                <ProfileFilled /> Profile
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/logout" passHref>
              <a>
                <FontAwesomeIcon icon={["fas", "sign-out-alt"]} size="lg" />{" "}
                Logout
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      );
      break;
    default:
      menuItems = (
        <Menu>
          <Menu.Item key="0">
            <Link href={`/${userRole}/profile`} as={`/${userRole}/profile`}>
              <a>
                <ProfileFilled /> Profile
              </a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/logout" passHref>
              <a>
                <FontAwesomeIcon icon={["fas", "sign-out-alt"]} size="lg" />{" "}
                Logout
              </a>
            </Link>
          </Menu.Item>
        </Menu>
      );
      break;
  }
  return menuItems;
};

export default MainNavbar;
