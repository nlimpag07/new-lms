import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Slider,
  Button,
  Carousel,
  Divider,
  Layout,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
//importing menu
//import MainMenu from "./main-menu/MainMenu";
const MainMenu = dynamic(() => import("./main-menu/MainMenu"));
//import UserMenu from "./main-menu/UserMenu";
const LearnerMenu = dynamic(() => import("./main-menu/LearnerMenu"));
//import InstructorMenu from "./main-menu/InstructorMenu";
const InstructorMenu = dynamic(() => import("./main-menu/InstructorMenu"));
const CourseManagementMenu = dynamic(() =>
  import("./main-menu/CourseManagementMenu")
);
const ClassesManagementMenu = dynamic(() =>
  import("./main-menu/ClassesManagementMenu")
);
//import AdministratorMenu from "./main-menu/InstructorMenu";
const AdministratorMenu = dynamic(() =>
  import("./main-menu/AdministratorMenu")
);
//importing navbar
//import MainNavbar from "./navbar/MainNavbar";
const MainNavbar = dynamic(() => import("./navbar/MainNavbar"));
//import InstructorNavbar from "./navbar/InstructorNavbar";
const InstructorNavbar = dynamic(() => import("./navbar/InstructorNavbar"));
//import AdministratorNavbar from "./navbar/InstructorNavbar";
const AdministratorNavbar = dynamic(() =>
  import("./navbar/AdministratorNavbar")
);
//importing breadcrumbs
import BreadCrumbs from "./breadcrumbs/BreadCrumbs";
//importing footer
import TemplateFooter from "./templateFooter/templateFooter";

//importing CourseListProvider Context
//import { CourseListProvider } from "../../providers/CourseProvider";

const { Header, Content, Sider } = Layout;
import Loader from "./loader/loader";

export default function MainThemeLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  //console.log(router.route);
  let NavigationMenu, MainNav, BreadCrumb, footer;

  BreadCrumb = <BreadCrumbs pathname={router.route} />;
  footer = <TemplateFooter />;
  //console.log(router.pathname)
  if (router.route.startsWith("/learner")) {
    MainNav = <MainNavbar />;
    NavigationMenu = <LearnerMenu />;
    if (router.route.startsWith("/learner/[course]/")) {
      NavigationMenu = <CourseManagementMenu />;
    }
  } else if (router.route.startsWith("/instructor")) {
    NavigationMenu = <InstructorMenu />;
    MainNav = <InstructorNavbar />;
    BreadCrumb = <BreadCrumbs pathname={router.route} />;
    if (router.route.startsWith("/instructor/[course]/")) {
      NavigationMenu = <CourseManagementMenu />;
    }
    if (router.route.startsWith("/instructor/classes/")) {
      NavigationMenu = <ClassesManagementMenu />;
    }
  } else if (router.route.startsWith("/administrator")) {
    NavigationMenu = <AdministratorMenu />;
    if (router.route.startsWith("/administrator/[course]/")) {
      NavigationMenu = <CourseManagementMenu />;
    }
    MainNav = <AdministratorNavbar />;
  } else {
    MainNav = <MainNavbar />;
    NavigationMenu = <MainMenu />;
    //MainNav = <MainNavbar />;
  }

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Loader loading={loading}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
           
          /*trigger={null} 

          onBreakpoint={broken => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }} */
        >
          <div className="logo">
            <img src="/images/fastrax-logo.png" alt="Fastrax Logo" />
          </div>
          {NavigationMenu}
          
          <div className="sideBottom">
            <div className="sideBottom-shape">
              {/* <span
                className={
                  "ant-layout-sider-trigger ant-layout-sider-zero-width-trigger-left"
                }
              >
                <LeftOutlined type={"bars"} onClick={() => setCollapsed(!collapsed)} />
              </span> */}
            </div>
          </div>
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background header-nav"
            style={{ padding: 0 }}
          >
            {MainNav}
          </Header>
          <Content /* style={{ margin: "0 16px" }} */>
            {BreadCrumb}
            <div className="site-layout-background" style={{ minHeight: 360 }}>
              {children}
            </div>
          </Content>
          {/* <Divider dashed className="features-divider" /> */}
          {footer}
        </Layout>
        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
          /* .ant-menu-inline-collapsed span {
            display: none;
          } */
          .logo img {
            width: 100%;
          }
        `}</style>
      </Layout>
    </Loader>
  );
}
