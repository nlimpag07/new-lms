import { useIsAuthenticated, useIsUserType } from "../providers/Auth";
import withConditionalRedirect from "./withConditionalRedirect";

/**
 * Require the user to be authenticated in order to render the component.
 * If the user isn't authenticated, forward to the given URL.
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
      //console.log("ServerAuth Status Logged: ", !!ctx.req?.cookies.session);
      return !ctx.req?.cookies.session;
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
