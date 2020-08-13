import React, { Component } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//importing ant
import { Menu } from "antd";


  const AdministratorMenu = () => {
    const router = useRouter();
  const aspath = router.asPath;
  const q = router.query; 
  var selectedKey = "";
  
  if(aspath.endsWith("/instructor")){
    selectedKey = "instructor";
  }
  if(aspath.endsWith("/course")){
    selectedKey = "course";
  }
  if(aspath.endsWith("/classes")){
    selectedKey = "classes";
  }
    return (
      <Menu theme="light" defaultselectedkey={selectedKey} mode="inline">
        

        <Menu.Item
          key="/instructor/dashboard"
          icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
        >
          <Link href="/instructor/dashboard" passHref>
            <a>Dashboard</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          key="/instructor/course"
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        >
          <Link href="/instructor/[course]" as={`/instructor/course`} >
            <a>Courses</a>
          </Link>
        </Menu.Item>

        <Menu.Item
          icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
          ikey="/instructor/classes"
        >
          <Link href="/instructor/classes" passHref>
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
  
}

export default AdministratorMenu;
