import React, {
  useReducer,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import axios from "axios";
import cookie from "cookie";
import Cookies from "js-cookie";
export const CourseListContext = createContext({
  courseAllList: null,
  setCourseAllList: () => {},
});

/**
 * The initial value of `isAuthenticated` comes from the `authenticated`
 * prop which gets set by _app. We store that value in state and ignore
 * the prop from then on. The value can be changed by calling the
 * `setAuthenticated()` method in the context.
 */
export const CourseListProvider = ({ children }) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = Cookies.get("token");
  const [courseAllList, setCourseAllList] = useState("");
  //Cookies.set('test', 'example')

  useEffect(() => {
    var data = JSON.stringify({});

    var config = {
      method: "get",
      url: apiBaseUrl + "/courses",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));

        setCourseAllList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    if (courseAllList) {
      localStorage.setItem("courseAllList", JSON.stringify(courseAllList));
      setCourseAllList(courseAllList);
    } else {
      const userData = JSON.parse(localStorage.getItem("courseAllList"));
      setCourseAllList(userData);
    }
  }, []);

  return (
    <CourseListContext.Provider
      value={{
        courseAllList,
        setCourseAllList,
      }}
    >
      {children}
    </CourseListContext.Provider>
  );
};

export function useCourseList() {
  const context = useContext(CourseListContext);
  if (context === undefined) {
    throw new Error("useCourseList must be used within an CourseListProvider");
  }
  return context;
}

/* export function useIsAuthenticated() {
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
} */
