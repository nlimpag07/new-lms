import { useIsAuthenticated, useIsUserType } from "../providers/Auth";
import withConditionalRedirect from "./withConditionalRedirect";

/**
 * Require the user to be unauthenticated in order to render the component.
 * If the user is authenticated, forward to the given URL.
 */

export default function withoutAuth(
  WrappedComponent,
  location = "/",
  source = "withoutAuth"
) {
  return withConditionalRedirect({
    WrappedComponent,
    clientCondition: function withoutAuthClientCondition() {
      return useIsAuthenticated();
    },
    serverCondition: function withoutAuthServerCondition(ctx) {
      return !!ctx.req?.cookies.session;
    },
    location,
    source,
    userTypeClientCondition: function withoutUserTypeClientCondition() {
      return useIsUserType();
    },
    userTypeServerCondition: function withoutUserTypeServerCondition(ctx) {
      return ctx.req?.cookies.usertype;
    },
  });
}
