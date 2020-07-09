import { AuthProvider } from "../providers/Auth";

import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Slider,
  Button,
  Carousel,
  Divider,
} from "antd";
import { useRouter } from "next/router";
//Kendo Bootstrap
//import "@progress/kendo-theme-bootstrap/dist/all.css";
//importing menu
import MainMenu from "../components/main-menu/MainMenu";
import UserMenu from "../components/main-menu/UserMenu";
//importing navbar
import MainNavbar from "../components/navbar/MainNavbar";
//importing breadcrumbs
import BreadCrumbs from "../components/breadcrumbs/BreadCrumbs";
//importing footer
import TemplateFooter from "../components/templateFooter/templateFooter";
//importing ant layouts
import { Layout, Menu, Breadcrumb, Row, Col } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
library.add(fab, fas);

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  let NavigationMenu, MainNav, BreadCrumb, footer;
  if (router.route.startsWith("/user/")) {
    NavigationMenu = <UserMenu defaultSelectedKey={router.pathname} />;
    MainNav = <MainNavbar />;
    BreadCrumb = <BreadCrumbs pathname={router.route} />;
    footer = <TemplateFooter />;
  } else {
    NavigationMenu = <MainMenu defaultSelectedKey={router.pathname} />;
    MainNav = <MainNavbar />;
    BreadCrumb = <BreadCrumbs pathname={router.route} />;
    footer = <TemplateFooter />;
  }

  return (
    <AuthProvider>
      
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
          <Content style={{ margin: "0 16px" }}>
            {BreadCrumb}
            <div className="site-layout-background" style={{ minHeight: 360 }}>
              <Component {...pageProps} />
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
    </AuthProvider>
  );
}
