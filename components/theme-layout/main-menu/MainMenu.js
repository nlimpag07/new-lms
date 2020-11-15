import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


//importing ant layouts
import { Layout, Menu } from "antd";

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const pathname = this.props.selectedKey;
    return (
      <Menu theme="light" defaultselectedkey={pathname} mode="inline">
        <Menu.Item
          key="/"
          icon={<FontAwesomeIcon icon={["fas", "home"]} size="lg" />}
        >
          <Link href="/" passHref>
            <a>Home</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="/hello"
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        >
          <Link href="/hello" passHref>
            <a>Features</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "credit-card"]} size="lg" />}
          ikey="/pricing"
        >
          <Link href="/pricing" passHref>
            <a>Pricing</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "users"]} size="lg" />}
          key="/customers"
        >
          <Link href="/customers" passHref>
            <a>Customers</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "briefcase"]} size="lg" />}
          key="/products"
        >
          <Link href="/products" passHref>
            <a>Products</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "user"]} size="lg" />}
          key="/about"
        >
          <Link href="/about" passHref>
            <a>About Us</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} size="lg" />}
          key="/contact"
        >
          <Link href="/contact" passHref>
            <a>Contact Us</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "phone-alt"]} size="lg" />}
          key="/user/dashboard"
        >
          <Link href="/user/dashboard" passHref>
            <a>Dashboard</a>
          </Link>
        </Menu.Item>

        <Menu.Item key="2" icon="💩" onClick={() => alert("Alert")}>
          Alert
        </Menu.Item>
        {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />} /> */}
        <style jsx global>{`
          .ant-layout-sider {
            background-color: #ffffff;
          }
          
        `}</style>
      </Menu>
    );
  }
}

export default MainMenu;
