import { useIsAuthenticated, useIsUserType } from "../providers/Auth";
import withConditionalRedirect from "./withConditionalRedirect";

/**
 * Require the user to be authenticated in order to render the component.
 * Then redirect to the specified
 */
export default function withAuth(
  WrappedComponent,
  location = "/login",
  source = "withAuth"
) {
  return withConditionalRedirect({
    WrappedComponent,
    location,
    clientCondition: function withAuthClientCondition() {
      //console.log("ClientAuth Status Logged: ", useIsAuthenticated());
      return !useIsAuthenticated();
    },
    serverCondition: function withAuthServerCondition(ctx) {
      //used only to activate redirection
      const req_url = ctx.req.url;
      const cur_usertype = "/"+ctx.req?.cookies.usertype
      const isAuthentic = ctx.req?.cookies.session;
      let isRedirect;
      if(isAuthentic && req_url.startsWith(cur_usertype)){
        isRedirect= false;
      }else{
        isRedirect= true;
      }
      
      //return !ctx.req?.cookies.session;
      return isRedirect;
    },
    source,
    userTypeClientCondition: function withoutUserTypeClientCondition() {
      return useIsUserType();
    },
    userTypeServerCondition: function withoutUserTypeServerCondition(ctx) {
      return ctx.req?.cookies.usertype;
    },
  });
}
