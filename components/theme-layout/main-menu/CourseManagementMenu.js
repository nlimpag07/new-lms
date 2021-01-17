import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

//importing ant
import { Menu } from "antd";
const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

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
  if (aspath.endsWith("course-outline")) {
    //console.log("course-outline");
    selectedKey = "course-outline";
  } else if (aspath.endsWith("learning-outcomes")) {
    //console.log("learning-outcomes");
    selectedKey = "learning-outcomes";
  } else if (aspath.endsWith("assessments")) {
    selectedKey = "assessments";
  } else if (aspath.endsWith("instructors")) {
    selectedKey = "instructors";
  } else if (aspath.endsWith("competencies")) {
    selectedKey = "competencies";
  } else if (aspath.endsWith("evaluations")) {
    selectedKey = "evaluations";
  } else {
    selectedKey = "general";
  }
  const [goback, setGoback] = useState(false);
  const [courseDetails, setCourseDetails] = useState({
    course_id: null,
    isPublished: null,
  });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/Courses/" + q.manage[1],
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { id: q.manage[1] },
    };
    axios(config)
      .then((res) => {
        const { data } = res;
        data &&
          setCourseDetails({
            course_id: data.id,
            isPublished: data.isPublished,
          });
      })
      .catch((error) => {
        console.log("error Response: ", error);
      });
  }, []);
  //console.log(aspath);
  //console.log(q)
  useEffect(() => {
    if (goback) {
      router.back();
    }
  }, [goback]);
  return CmMenuView(q, selectedKey, setGoback, courseDetails);
};

const CmMenuView = (q, selectedKey, setGoback, courseDetails) => {
  return q.course == "course" && q.manage[0] == "view" ? (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
      <Menu.Item
        key={`/${linkUrl}/[course]`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        {/* <span onClick={() => setGoback(true)}>Back</span> */}
        <Link href={`/${linkUrl}/[course]`} as={`/${linkUrl}/course`}>
          <a>Back to Courses</a>
        </Link>
      </Menu.Item>
    </Menu>
  ) : q.course == "course" && q.manage[0] == "add" ? (
    <Menu theme="light" defaultSelectedKeys={selectedKey} mode="inline">
      <Menu.Item
        key={`/${linkUrl}/[course]`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        {/* <span onClick={() => setGoback(true)}>Back</span> */}
        <Link href={`/${linkUrl}/[course]`} as={`/${linkUrl}/course`}>
          <a>Back to Courses</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key={`add`}
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}`}
        >
          <a>General</a>
        </Link>
      </Menu.Item>
    </Menu>
  ) : q.manage[0] == "edit" && courseDetails.isPublished !== 1 ? (
    <Menu theme="light" defaultSelectedKeys={selectedKey} mode="inline">
      <Menu.Item
        key={`/${linkUrl}/[course]`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        {/* <span onClick={() => setGoback(true)}>Back</span> */}
        <Link href={`/${linkUrl}/[course]`} as={`/${linkUrl}/course`}>
          <a>Back to Courses</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        key={`general`}
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}`}
        >
          <a>General</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        key={`course-outline`}
        icon={<FontAwesomeIcon icon={["far", "list-alt"]} size="lg" />}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}/course-outline`}
        >
          <a>Course Outline</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "star"]} size="lg" />}
        key={`learning-outcomes`}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}/learning-outcomes`}
        >
          <a>Learning Outcomes</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "hourglass-half"]} size="lg" />}
        key={`assessments`}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}/assessments`}
        >
          <a>Assessments</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "user"]} size="lg" />}
        key={`instructors`}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}/instructors`}
        >
          <a>Instructor</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "shield-alt"]} size="lg" />}
        key={`competencies`}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}/competencies`}
        >
          <a>Competencies</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "comments"]} size="lg" />}
        key={`evaluations`}
      >
        <Link
          href={`/${linkUrl}/[course]/[...manage]`}
          as={`/${linkUrl}/${q.course}/${q.manage[0]}/${q.manage[1]}/evaluations`}
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
  ) : (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
      <Menu.Item
        key={`/${linkUrl}/[course]`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        {/* <span onClick={() => setGoback(true)}>Back</span> */}
        <Link href={`/${linkUrl}/[course]`} as={`/${linkUrl}/course`}>
          <a>Back to Courses</a>
        </Link>
      </Menu.Item>
    </Menu>
  );
};

export default CourseManagementMenu;
