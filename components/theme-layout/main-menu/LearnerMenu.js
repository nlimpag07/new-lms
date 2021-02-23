import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

//importing ant
import { Menu } from "antd";
const linkUrl = Cookies.get("usertype");

const LearnerMenu = () => {
  const router = useRouter();
  const aspath = router.asPath;
  const q = router.query;
  var selectedKey = "";
  if (aspath.endsWith("/learner")) {
    selectedKey = "learner";
  }
  if (aspath.endsWith("/course-catalogue")) {
    selectedKey = "catalogue";
  }
  if (aspath.endsWith("/my-courses")) {
    selectedKey = "my-courses";
  }
  if (aspath.endsWith("/my-transcripts")) {
    selectedKey = "my-transcripts";
  }
  if (aspath.endsWith("/calendar")) {
    selectedKey = "calendar";
  }
  if (aspath.endsWith("/picklists")) {
    selectedKey = "picklists";
  }
  if (aspath.endsWith("/reports")) {
    selectedKey = "reports";
  }
  //console.log(aspath);
  //const [defaultKey,setDefaultKey] = useState(`'${selectedKey}'`);
  /* useEffect(() => {
    setDefaultKey(`'${selectedKey}'`);
  }, []); */
  return aspath.startsWith("/learner/course-catalogue/") ? (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
      <Menu.Item
        key={`/${linkUrl}/course-catalogue`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        {/* <span onClick={() => setGoback(true)}>Back</span> */}
        <Link
          href={`/${linkUrl}/course-catalogue`}
          as={`/${linkUrl}/course-catalogue`}
        >
          <a>Back to Catalogue</a>
        </Link>
      </Menu.Item>

      <style jsx global>{`
        .ant-layout-sider {
          background-color: #ffffff;
        }
      `}</style>
    </Menu>
  ) : aspath.startsWith("/learner/my-courses/") ? (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
        key="/learner/my-courses"
      >
        <Link href="/learner/my-courses" as={`/learner/my-courses`}>
          <a>Back to My Courses</a>
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
        key="learner"
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link href="/learner" as={`/learner`}>
          <a>Dashboard</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        key="catalogue"
      >
        <Link href="/learner/course-catalogue" as={`/learner/course-catalogue`}>
          <a>Course Catalogue</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        key="my-courses"
      >
        <Link href="/learner/my-courses" as={`/learner/my-courses`}>
          <a>My Courses</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "file-alt"]} size="lg" />}
        key="my-transcripts"
      >
        <Link href="/learner/my-transcripts" passHref>
          <a>My Transcript</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "calendar-alt"]} size="lg" />}
        key="calendar"
      >
        <Link href="/learner/calendar" passHref>
          <a>Calendar</a>
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

export default LearnerMenu;
