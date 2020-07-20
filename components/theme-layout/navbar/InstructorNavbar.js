import React, {useState} from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Layout, Row, Col, Badge, Avatar, Menu, Dropdown, Modal } from "antd";
import { useIsAuthenticated } from "../../../providers/Auth";
import { DownOutlined, ProfileFilled, EyeFilled } from "@ant-design/icons";

const InstructorNavbar = () => {
  const isAuthenticated = useIsAuthenticated();
  var [switchViewModal, setSwitchViewModal] = useState(
    (switchViewModal = false)
  );

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
                  <Badge dot status="error">
                    <FontAwesomeIcon icon={["fas", "bell"]} size="lg" />
                  </Badge>
                </a>
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="logout">
                  <Dropdown overlay={profileMenu(setSwitchViewModal)}>
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      {/*  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> */}
                      <FontAwesomeIcon
                        icon={["fas", "user-circle"]}
                        size="lg"
                      />{" "}
                      Name <DownOutlined />
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
      <Modal
        id="switchview-modal"
        title="Switch View"
        centered
        visible={switchViewModal}
        onOk={() => setSwitchViewModal(false)}
        onCancel={() => setSwitchViewModal(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={450}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
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

const profileMenu = (setSwitchViewModal) => (
  <Menu>
    <Menu.Item key="0">
      <Link href="/lang" passHref>
        <a>
          <ProfileFilled /> Profile
        </a>
      </Link>
    </Menu.Item>
    <Menu.Item key="1">
      
      <a href="#switchview-modal" onClick={() => setSwitchViewModal(true)}>
        <EyeFilled /> Switch View
      </a>
    </Menu.Item>
    <Menu.Item key="2">
      <Link href="/logout" passHref>
        <a>
          <FontAwesomeIcon icon={["fas", "sign-out-alt"]} size="lg" /> Logout
        </a>
      </Link>
    </Menu.Item>
    {/* <Menu.Divider />
    <Menu.Item key="3" disabled>
      3rd menu item（disabled）
    </Menu.Item> */}
  </Menu>
);

export default InstructorNavbar;
