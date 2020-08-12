import React, { Component,useEffect,useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";

//importing ant
import { Menu } from "antd";

const InstructorMenu = () => {
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

  //const [defaultKey,setDefaultKey] = useState(`'${selectedKey}'`);
  /* useEffect(() => {
    setDefaultKey(`'${selectedKey}'`);
  }, []); */
  console.log(selectedKey)
  return (
    <Menu theme="light" defaultSelectedKeys={`${selectedKey}`} mode="inline">
      <Menu.Item
        key="instructor"
        icon={<FontAwesomeIcon icon={["fas", "palette"]} size="lg" />}
      >
        <Link href="/instructor" as={`/instructor`}>
          <a>Dashboard</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        key="course"
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
      >
        <Link href="/instructor/[course]" as={`/instructor/course`}>
          <a>Courses</a>
        </Link>
      </Menu.Item>

      <Menu.Item
        icon={<FontAwesomeIcon icon={["fas", "book"]} size="lg" />}
        key="classes"
      >
        <Link href="/instructor/classes" as={`/instructor/classes`}>
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

export default InstructorMenu;
