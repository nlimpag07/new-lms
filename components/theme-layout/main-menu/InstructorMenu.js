import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing ant
import { Menu } from "antd";

class InstructorMenu extends Component {
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
          key="/instructor/dashboard"
          icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
        >
          <Link href="/instructor/dashboard" passHref>
            <a>Dashboard</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="/instructor/course"
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        >
          <Link href="/instructor/[...course]" as={`/instructor/course`} >
            <a>Courses</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
            <a>My Class</a>
          </Link>
        </Menu.Item>

        <style jsx global>{`
          .ant-layout-sider {
            background-color: #ffffff;
          }
        `}</style>
      </Menu>
    );
  }
}

export default InstructorMenu;
