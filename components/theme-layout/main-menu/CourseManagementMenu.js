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
  return q.course == "course" && q.manage[0] == "view" ? (
    <Menu theme="light" defaultselectedkey={aspath} mode="inline">
      <Menu.Item
        key={`/instructor/${q.course}`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        <Link href="/instructor/[course]" as={`/instructor/course`}>
          <a>Back To Course</a>
        </Link>
      </Menu.Item>
    </Menu>
  ) : q.course == "course" && q.manage[0] == "add" ? (
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
        icon={<FontAwesomeIcon icon={["far", "list-alt"]} size="lg" />}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/course-outline`}
        >
          <a>Course Outline</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "star"]} size="lg" />}
        ikey={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/learning-outcomes`}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/learning-outcomes`}
        >
          <a>Learning Outcomes</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "hourglass-half"]} size="lg" />}
        ikey={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/assessements`}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/assessments`}
        >
          <a>Assessments</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "user"]} size="lg" />}
        ikey={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/instructors`}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/instructors`}
        >
          <a>Instructor</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "shield-alt"]} size="lg" />}
        ikey={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/competencies`}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/competencies`}
        >
          <a>Competencies</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "comments"]} size="lg" />}
        ikey={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/evaluations`}
      >
        <Link
          href="/instructor/[course]/[...manage]"
          as={`/instructor/${q.course}/${q.manage[0]}/${q.manage[1]}/evaluations`}
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
