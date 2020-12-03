import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
//importing ant
import { Menu } from "antd";

const ClassesManagementMenu = (props) => {
  const router = useRouter();
  const aspath = router.asPath;
  const q = router.query;
  var selectedKey = "";
  if (q.manageclasses[0] == "sessions") {
    selectedKey = "sessions";
  }
  if (q.manageclasses[0] == "enrollments") {
    selectedKey = "enrollments";
  }
  if (q.manageclasses[0] == "class") {
    selectedKey = "class";
  }
  if (q.manageclasses[0] == "attendance") {
    selectedKey = "attendance";
  }
  const [goback, setGoback] = useState(false);
  useEffect(() => {
    if (goback) {
      router.back();
    }
  }, [goback]);
  //console.log(aspath);
  //console.log(q)
  return CmMenuView(q, selectedKey, setGoback);
};

const CmMenuView = (q, selectedKey, setGoback) => {
  return (
    <Menu theme="light" defaultSelectedKeys={selectedKey} mode="inline">
      <Menu.Item
        key={`/instructor/classes`}
        icon={<FontAwesomeIcon icon={["fas", "arrow-left"]} size="lg" />}
      >
        {/* <span onClick={() => setGoback(true)}>Back</span> */}
        <Link
          href="/instructor/classes"
          as={`/instructor/classes`}
        >
          <a>Back</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key={`sessions`}
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link
          href="/instructor/classes/[...manageclasses]"
          as={`/instructor/classes/sessions/${q.manageclasses[1]}`}
        >
          <a>Sessions</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        key={`enrollments`}
        icon={<FontAwesomeIcon icon={["far", "list-alt"]} size="lg" />}
      >
        <Link
          href="/instructor/classes/[...manageclasses]"
          as={`/instructor/classes/enrollments/${q.manageclasses[1]}`}
        >
          <a>Enrollments</a>
        </Link>
      </Menu.Item>

      {/* <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "star"]} size="lg" />}
        key={`class`}
      >
        <Link
          href="/instructor/classes/[...manageclasses]"
          as={`/instructor/classes/class/${q.manageclasses[1]}`}
        >
          <a>Class</a>
        </Link>
      </Menu.Item> */}
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "hourglass-half"]} size="lg" />}
        key={`attendance`}
      >
        <Link
          href="/instructor/classes/[...manageclasses]"
          as={`/instructor/classes/attendance/${q.manageclasses[1]}`}
        >
          <a>Attendance</a>
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

export default ClassesManagementMenu;
