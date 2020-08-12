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
  var selectedKey = "";


  if (q.manage[0] == "view") {
    selectedKey = "view";
  }
  if (q.manage[0] == "add") {
    selectedKey = "add";
  }
  if (q.manage[0] == "edit" && q.manage.length === 2) {
    selectedKey = "general";
  }
  if (q.manage[0] == "edit" && q.manage.length === 3) {
    
    /* aspath.endsWith("course-outline")
      ? (selectedKey = "course-outline")
      : aspath.endsWith("learning-outcomes")
      ? (selectedKey = "learning-outcomes")
      : aspath.endsWith("assessments")
      ? (selectedKey = "assessments")
      : aspath.endsWith("instructors")
      ? (selectedKey = "instructors")
      : aspath.endsWith("competencies")
      ? (selectedKey = "competencies")
      : aspath.endsWith("evaluations")
      ? (selectedKey = "evaluations")
      :''; */
  }
  if(aspath.endsWith("course-outline")){
    console.log("course-outline");
    selectedKey = "course-outline";
  }
  if(aspath.endsWith("learning-outcomes")){
    console.log("learning-outcomes");
    selectedKey = "learning-outcomes";
  } else if(aspath.endsWith("assessments")){
    selectedKey = "assessments";
  } else if(aspath.endsWith("instructors")){
    selectedKey = "instructors";
  } else if(aspath.endsWith("competencies")){
    selectedKey = "competencies";
  } else if(aspath.endsWith("evaluations")){
    selectedKey = "evaluations";
  } else{
    selectedKey = "general";
  }
  /* if(aspath.endsWith("/course")){
    selectedKey = "course";
  }
  if(aspath.endsWith("/classes")){
    selectedKey = "classes";
  } */
  console.log(aspath);
  //console.log(q)
  return CmMenuView(q, selectedKey);
};

const CmMenuView = (q, selectedKey) => {
  return q.course == "course" && q.manage[0] == "view" ? (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
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
    <Menu theme="light" defaultSelectedKeys={selectedKey} mode="inline">
      <Menu.Item
        key={`/instructor/${q.course}`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        <Link href="/instructor/[course]" as={`/instructor/course`}>
          <a>Back To Course</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key={`add`}
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
    <Menu theme="light" defaultSelectedKeys={selectedKey} mode="inline">
      <Menu.Item
        key={`/instructor/${q.course}`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        <Link href="/instructor/[course]" as={`/instructor/course`}>
          <a>Back To Course</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key={`general`}
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
        key={`course-outline`}
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
        key={`learning-outcomes`}
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
        key={`assessments`}
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
        key={`instructors`}
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
        key={`competencies`}
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
        key={`evaluations`}
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
