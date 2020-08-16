import { useRouter } from "next/router";
import Loader from "../components/theme-layout/loader/loader";

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Support conditional redirecting, both server-side and client-side.
 *
 * Client-side, we can use next/router. But that doesn't exist on the server.
 * So on the server we must do an HTTP redirect. This component handles
 * the logic to detect whether on the server and client and redirect
 * appropriately.
 *
 * @param WrappedComponent The component that this functionality
 * will be added to.
 * @param clientCondition A function that returns a boolean representing
 * whether to perform the redirect. It will always be called, even on
 * the server. This is necessary so that it can have hooks in it (since
 * can't be inside conditionals and must always be called).
 * @param serverCondition A function that returns a boolean representing
 * whether to perform the redirect. It is only called on the server. It
 * accepts a Next page context as a parameter so that the request can
 * be examined and the response can be changed.
 * @param location The location to redirect to.
 */
export default function withConditionalRedirect({
  WrappedComponent,
  clientCondition,
  serverCondition,
  location,
  source,
  userTypeClientCondition,
  userTypeServerCondition,
}) {
  const loading = true;
  const WithConditionalRedirectWrapper = (props) => {
    const router = useRouter();
    //const theclientcond = clientCondition();
    //let usertypeloc;
    //userTypeClientCondition()? location="/"+userTypeClientCondition():'';
    let usertypecond = userTypeClientCondition();
    //location=usertypecond;
    const redirectCondition = clientCondition();
    if (isBrowser() && redirectCondition) {
      if (usertypecond == "learner") {
        location = "/learner";
      } else if (usertypecond == "instructor") {
        location = "/instructor";
      } else if (usertypecond == "administrator") {
        location = "/administrator";
      }
      router.push(location);
      return <Loader loading={loading} />;
    }
    return <WrappedComponent {...props} />;
  };

  WithConditionalRedirectWrapper.getInitialProps = async (ctx) => {
    const usertypecond = userTypeServerCondition(ctx);
    //userTypeServerCondition(ctx)?location= "/"+userTypeServerCondition(ctx):'';
    if (!isBrowser() && ctx.res) {
      if (serverCondition(ctx)) {
        if (usertypecond == "learner") {
          location = "/learner";
        } else if (usertypecond == "instructor") {
          location = "/instructor";
        } else if (usertypecond == "administrator") {
          location = "/administrator";
        }
        ctx.res.writeHead(302, { Location: location });
        ctx.res.end();
      }
    }

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));
    if (componentProps) {
      return { ...componentProps };
    }

    return { ...componentProps, defaultReturn: "noValue" };
  };

  return WithConditionalRedirectWrapper;
}
