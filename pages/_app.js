import App from "next/app";
import { AuthProvider } from "../providers/Auth";
import { CourseListProvider } from "../providers/CourseProvider";

import cookie from "cookie";
import axios from "axios";
import "antd/dist/antd.css";
import "../styles/vars.css";
import "../styles/global.css";
import "@progress/kendo-theme-material/dist/all.css";
import { library, config } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/ams-icons/style.css";
config.autoAddCss = false;
library.add(fab, fas, far);
function MyApp({ Component, pageProps, authenticated, usertype }) {
   return (
    <AuthProvider
      authenticated={authenticated}
      usertype={usertype}
    >
      <CourseListProvider>
        <Component {...pageProps} />
      </CourseListProvider>
    </AuthProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//

MyApp.getInitialProps = async (appContext) => {
  let authenticated = false;
  let usertype = null;
  const request = appContext.ctx.req;
  if (request) {
    request.cookies = cookie.parse(request.headers.cookie || "");
    authenticated = !!request.cookies.session;
    usertype = request.cookies.usertype ? request.cookies.usertype : usertype;
  }
  //console.log(appContext);
  // Call the page's `getInitialProps` and fill `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, authenticated, usertype };
};

export default MyApp;
