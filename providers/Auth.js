import React from "react";

const AuthContext = React.createContext({
  isAuthenticated: false,
  setAuthenticated: () => {},
  isUsertype: null,
  setUsertype: () => {},
});

/**
 * The initial value of `isAuthenticated` comes from the `authenticated`
 * prop which gets set by _app. We store that value in state and ignore
 * the prop from then on. The value can be changed by calling the
 * `setAuthenticated()` method in the context.
 */
export const AuthProvider = ({ children, authenticated, usertype }) => {
  const [isAuthenticated, setAuthenticated] = React.useState(authenticated);
  const [isUsertype, setUsertype] = React.useState(usertype);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        isUsertype,
        setUsertype,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useIsAuthenticated() {
  const context = useAuth();
  return context.isAuthenticated;
}
export function useIsUserType() {
  const context = useAuth();
  return context.isUsertype;
}
