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
  
  if(aspath.endsWith("/admin")){
    selectedKey = "admin";
  }
  if(aspath.endsWith("/course")){
    selectedKey = "course";
  }
  if(aspath.endsWith("/classes")){
    selectedKey = "classes";
  }

  //const [defaultKey,setDefaultKey] = useState(`'${selectedKey}'`);
  /* useEffect(() => {
    setDefaultKey(`'${selectedKey}'`);
  }, []); */
  return (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
      <Menu.Item
        key="admin"
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link href="/admin" as={`/admin`}>
          <a>Dashboard</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key="course"
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
      >
        <Link href="/admin/[course]" as={`/admin/course`}>
          <a>Courses</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        key="classes"
      >
        <Link href="/admin/classes" as={`/admin/classes`}>
          <a>My Class</a>
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
