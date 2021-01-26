import React, {
  useReducer,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  setAuthenticated: () => {},
  isUsertype: null,
  setUsertype: () => {},
  userDetails: null,
  setUserDetails: () => {},
});

/**
 * The initial value of `isAuthenticated` comes from the `authenticated`
 * prop which gets set by _app. We store that value in state and ignore
 * the prop from then on. The value can be changed by calling the
 * `setAuthenticated()` method in the context.
 */
export const AuthProvider = ({
  children,
  authenticated,
  usertype,
  userdetails,
}) => {
  const [isAuthenticated, setAuthenticated] = useState(authenticated);
  const [isUsertype, setUsertype] = useState(usertype);
  const [userDetails, setUserDetails] = useState(userdetails);
  useEffect(() => {
    if (userDetails && isAuthenticated) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      if (isAuthenticated) {
        const userData = JSON.parse(localStorage.getItem("userDetails"));
        //console.log(userData);
        setUserDetails(userData);
      }
    }
  }, [userDetails]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
        isUsertype,
        setUsertype,
        userDetails,
        setUserDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
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
export function useUserDetails() {
  const context = useAuth();
  return context.isUsertype;
}

