import { useEffect, useState } from "react";
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
import { useRouter } from "next/router";

//importing menu
import MainMenu from "./main-menu/MainMenu";
import UserMenu from "./main-menu/UserMenu";
import InstructorMenu from "./main-menu/InstructorMenu";
//importing navbar
import MainNavbar from "./navbar/MainNavbar";
//importing breadcrumbs
import BreadCrumbs from "./breadcrumbs/BreadCrumbs";
//importing footer
import TemplateFooter from "./templateFooter/templateFooter";

const { Header, Content, Sider } = Layout;
import Loader from "./loader/loader";

export default function MainThemeLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  let NavigationMenu, MainNav, BreadCrumb, footer;
  if (router.route.startsWith("/user/")) {
    NavigationMenu = <UserMenu defaultSelectedKey={router.pathname} />;
    MainNav = <MainNavbar />;
    BreadCrumb = <BreadCrumbs pathname={router.route} />;
    footer = <TemplateFooter />;
  } else if (router.route.startsWith("/instructor/")) {
    NavigationMenu = <InstructorMenu defaultSelectedKey={router.pathname} />;
    MainNav = <MainNavbar />;
    BreadCrumb = <BreadCrumbs pathname={router.route} />;
    footer = <TemplateFooter />;
  } else {
    NavigationMenu = <MainMenu defaultSelectedKey={router.pathname} />;
    MainNav = <MainNavbar />;
    BreadCrumb = <BreadCrumbs pathname={router.route} />;
    footer = <TemplateFooter />;
  }

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Loader loading={loading}>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider>
          <div className="logo">
            <img src="/images/fastrax-logo.png" alt="Fastrax Logo" />
          </div>
          {NavigationMenu}
          <div className="sideBottom">
            <div className="sideBottom-shape"></div>
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
          <Divider dashed className="features-divider" />
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
        `}</style>
      </Layout>
    </Loader>
  );
}
