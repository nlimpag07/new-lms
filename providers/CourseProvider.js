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
import { useIsAuthenticated } from "./Auth";

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
export const CourseListProvider = ({ children, courselist }) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = Cookies.get("token");
  const [courseAllList, setCourseAllList] = useState(courselist);
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("courseAllList", JSON.stringify(courseAllList));
    }/*  else {
      if (isAuthenticated) {
        const courseListData = JSON.parse(localStorage.getItem("courseAllList"));
        //console.log(courseListData);
        setCourseAllList(courseListData);
      }
    } */
  }, [courseAllList]);

  /* useEffect(() => {
    if (isAuthenticated) {
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

      async function fetchData(config) {
        const response = await axios(config);
        if (response) {
          localStorage.setItem("courseAllList", JSON.stringify(response.data));
          setCourseAllList(response.data);
          console.log(response.data)
        } else {
          const userData = JSON.parse(localStorage.getItem("courseAllList"));
          setCourseAllList(userData);
        }
      }
      fetchData(config);
    }
  }, []); */

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
