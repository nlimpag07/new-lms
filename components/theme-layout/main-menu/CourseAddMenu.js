import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing ant
import { Menu } from "antd";

const CourseAddMenu = (props) => {
 
    const { pathname } = props.defaultSelectedKey;
    return (
      <Menu theme="light" defaultselectedkey={pathname} mode="inline">
        

        <Menu.Item
          key="/instructor/dashboard"
          icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
        >
          <Link href="/instructor/dashboard" passHref>
            <a>General</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="/instructor/course"
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        >
          <Link href="/instructor/[...course]" as={`/instructor/course`} >
            <a>Course Outline</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
            <a>Learning Outcomes</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
            <a>Assessments</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
            <a>Instructor</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
            <a>Competencies</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
            <a>Post Evaluation</a>
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

export default CourseAddMenu;
