import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
//importing ant
import { Menu } from "antd";

const CourseManagementMenu = (props) => {
  const router = useRouter();
  const aspath = router.asPath;
  const q = router.query;
  //console.log(aspath)
  //console.log(q)
  return CmMenuView(q, aspath);
};

const CmMenuView = (q, aspath) => {
  return q.course == "course" && q.manage[0] == "add" ? (
    <Menu theme="light" defaultselectedkey={aspath} mode="inline">
      <Menu.Item
        key={`/instructor/${q.course}`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        <Link href="/instructor/[course]" as={`/instructor/course`}>
          <a>Back To Course</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key={`/instructor/${q.course}/${q.manage[0]}`}
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}`}
        >
          <a>General</a>
        </Link>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu theme="light" defaultselectedkey={aspath} mode="inline">
      <Menu.Item
        key={`/instructor/${q.course}`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        <Link href="/instructor/[course]" as={`/instructor/course`}>
          <a>Back To Course</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key={`/instructor/${q.course}/${q.manage[0]}`}
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}`}
        >
          <a>General</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        key={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/course-outline`}
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/course-outline`}
        >
          <a>Course Outline</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        ikey="/instructor/[course]/[...manage]/learning-outcomes"
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/course/add/learning-outcomes`}
        >
          <a>Learning Outcomes</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        ikey="/instructor/[course]/[...manage]/assessements"
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/course/add/assessments`}
        >
          <a>Assessments</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        ikey="/instructor/[course]/[...manage]/instructor"
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/course/add/instructor`}
        >
          <a>Instructor</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        ikey="/instructor/[course]/[...manage]/competencies"
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/course/add/competencies`}
        >
          <a>Competencies</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        ikey="/instructor/[course]/[...manage]/evaluation"
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/course/add/evaluation`}
        >
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
};

export default CourseManagementMenu;
