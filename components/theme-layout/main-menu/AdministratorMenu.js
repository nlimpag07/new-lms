import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

//importing ant
import { Menu } from "antd";

const AdministratorMenu = () => {
  const router = useRouter();
  const aspath = router.asPath;
  const q = router.query;
  var selectedKey = "";

  if (aspath.endsWith("/administrator")) {
    selectedKey = "administrator";
  }
  if (aspath.endsWith("/course")) {
    selectedKey = "course";
  }
  if (aspath.endsWith("/users")) {
    selectedKey = "users";
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
        key="administrator"
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link href="/administrator" as={`/administrator`}>
          <a>Dashboard</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key="course"
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
      >
        <Link href="/administrator/[course]" as={`/administrator/course`}>
          <a>Courses</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "users"]} size="lg" />}
        key="users"
      >
        <Link href="/administrator/users" as={`/administrator/users`}>
          <a>Users</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "sliders-h"]} size="lg" />}
        key="picklists"
      >
        <Link href="/administrator/picklists" as={`/administrator/picklists`}>
          <a>Picklists</a>
        </Link>
      </Menu.Item>
      <Menu.Item
        icon={<FontAwesomeIcon icon={["fa", "file-alt"]} size="lg" />}
        key="reports"
      >
        <Link href="/administrator/reports" as={`/administrator/reports`}>
          <a>Reports</a>
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

export default AdministratorMenu;
