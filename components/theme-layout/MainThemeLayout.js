import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
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
  Row,
  Col,
  Grid,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
const { useBreakpoint } = Grid;
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
import { ViewPortProvider } from "../../providers/ViewPort";

//importing CourseListProvider Context
//import { CourseListProvider } from "../../providers/CourseProvider";

const { Header, Content, Sider } = Layout;
import Loader from "./loader/loader";
const userRole = Cookies.get("usertype");

export default function MainThemeLayout({ children }) {
  /*checking the viewport */
  const screens = useBreakpoint();
  const theScreen = Object.entries(screens)
      .filter((screen) => !!screen[1])
      .map((screen) => screen[0]);
    let vp = theScreen[theScreen.length - 1];
  /*end checking the viewport */
  const [viewPort, setViewPort] = useState(null);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  let NavigationMenu, BreadCrumb, footer;

  BreadCrumb = <BreadCrumbs pathname={router.route} />;
  footer = <TemplateFooter />;
  let MainNav = <MainNavbar userRole={userRole} />;
  //console.log(router.pathname)
  if (router.route.startsWith("/learner")) {
    NavigationMenu = <LearnerMenu />;
    if (router.route.startsWith("/learner/[course]/")) {
      NavigationMenu = <CourseManagementMenu />;
    }
  } else if (router.route.startsWith("/instructor")) {
    NavigationMenu = <InstructorMenu />;

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
    //MainNav = <AdministratorNavbar />;
  } else {
    NavigationMenu = <MainMenu />;
    //MainNav = <MainNavbar />;
  }

  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [resProps, setResProps] = useState({
    trigger: null,
    collapsedWidth: 0,
    collapsible: false,
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const dynamicProps = (broken) => {
    if (broken) {
      setResProps({
        trigger: null,
        collapsedWidth: 0,
      });
      setIsMobile(true);
    } else {
      setResProps({ collapsible: true });
      setIsMobile(false);
    }
  };
  useEffect(() => {
    setViewPort(vp);
  }, [vp]);
  return (
    <Loader loading={loading}>
      <ViewPortProvider vp={viewPort}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            theme="light"
            {...resProps}
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            breakpoint="lg"
            onBreakpoint={(broken) => {
              dynamicProps(broken);
              //console.log(broken);
            }}
            /* onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }} */
          >
            {!isMobile && (
              <div className="logo">
                <img src="/images/fastrax-logo.png" alt="Fastrax Logo" />
              </div>
            )}
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
              {isMobile && (
                <Row
                  className="mobileHeaderHolder"
                  align="middle"
                  justify="space-between"
                >
                  <Col xs={10} sm={10} md={14}>
                    <div className="logo">
                      <img src="/images/fastrax-logo.png" alt="Fastrax Logo" />
                    </div>
                  </Col>
                  <Col xs={6} sm={6} md={6}>
                    {collapsed ? (
                      <MenuOutlined
                        className="trigger"
                        onClick={() => setCollapsed(!collapsed)}
                      />
                    ) : (
                      <MenuOutlined
                        className="trigger"
                        onClick={() => setCollapsed(!collapsed)}
                      />
                    )}
                  </Col>
                </Row>
              )}
              {MainNav}
            </Header>
            <Content /* style={{ margin: "0 16px" }} */>
              {BreadCrumb}
              <div
                className="site-layout-background"
                style={{ minHeight: 360, }}
              >
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
          `}</style>
        </Layout>
      </ViewPortProvider>
    </Loader>
  );
}
