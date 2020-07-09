import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing ant layouts
import { Layout, Menu } from "antd";

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  /* static async getInitialProps(props) {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const { data } = res;
    return { posts: data };
  } */
  render() {
    const { pathname } = this.props.defaultSelectedKey;
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
          key="/user/dashboard"
          icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
        >
          <Link href="/user/dashboard" passHref>
            <a>Dashboard</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/user/courses"
        >
          <Link href="/user/courses" passHref>
            <a>Course Catalogue</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          key="/user/courses/userID"
        >
          <Link href="/user/courses/userID" passHref>
            <a>My Courses</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "file-alt"]} size="lg" />}
          key="/user/transcript"
        >
          <Link href="/user/transcript" passHref>
            <a>My Transcript</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "calendar-alt"]} size="lg" />}
          key="/user/calendar"
        >
          <Link href="/user/calendar" passHref>
            <a>Calendar</a>
          </Link>
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

export default UserMenu;
