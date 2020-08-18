import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

//importing ant
import { Menu } from "antd";

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
  if (aspath.endsWith("/course")) {
    selectedKey = "my-courses";
  }
  if (aspath.endsWith("/picklists")) {
    selectedKey = "picklists";
  }
  if (aspath.endsWith("/reports")) {
    selectedKey = "reports";
  }

  //const [defaultKey,setDefaultKey] = useState(`'${selectedKey}'`);
  /* useEffect(() => {
    setDefaultKey(`'${selectedKey}'`);
  }, []); */
  return (
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
          <Link href="/learner/[course]" as={`/learner/course`}>
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

      <style jsx global>{`
        .ant-layout-sider {
          background-color: #ffffff;
        }
      `}</style>
    </Menu>
  );
};

export default LearnerMenu;

