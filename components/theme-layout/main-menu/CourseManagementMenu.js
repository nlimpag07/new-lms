import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing ant
import { Menu } from "antd";

const CourseManagementMenu = (props) => {
 
    const { pathname } = props.defaultSelectedKey;
    return (
      <Menu theme="light" defaultselectedkey={pathname} mode="inline">
        

        <Menu.Item
          key="/instructor/[course]/add"
          icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add`}>
            <a>General</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="/instructor/[course]/[...manage]/course-outline"
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add/course-outline`} >
            <a>Course Outline</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/[course]/[...manage]/learning-outcomes"
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add/learning-outcomes`}>
            <a>Learning Outcomes</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/[course]/[...manage]/assessements"
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add/assessments`}>
            <a>Assessments</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/[course]/[...manage]/instructor"
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add/instructor`}>
            <a>Instructor</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/[course]/[...manage]/competencies"
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add/competencies`}>
            <a>Competencies</a>
          </Link>
        </Menu.Item>
        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/[course]/[...manage]/evaluation"
        >
          <Link href="/instructor/[course]/[...manage]" as={`/instructor/course/add/evaluation`}>
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

export default CourseManagementMenu;
