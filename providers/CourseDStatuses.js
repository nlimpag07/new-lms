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

export const CourseDetailsContext = createContext({
  courseDetails: null,
  setCourseDetails: () => {},
});

/**
 * The initial value of `isAuthenticated` comes from the `authenticated`
 * prop which gets set by _app. We store that value in state and ignore
 * the prop from then on. The value can be changed by calling the
 * `setAuthenticated()` method in the context.
 */
export const CourseDetailsProvider = ({ children, course_id }) => {
  var apiBaseUrl = process.env.apiBaseUrl;
  var token = Cookies.get("token");
  const [courseDetails, setCourseDetails] = useState({ course_id: course_id });
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      var data = JSON.stringify({});
      var config = {
        method: "get",
        url: apiBaseUrl + "/courses/" + course_id,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        /* data: data, */
      };

      async function fetchData(config) {
        const response = await axios(config);
        if (response) {
          let cd = {
            id: response.data.id,
            isPublished: response.data.isPublished,
          };
          localStorage.setItem("courseDetails", JSON.stringify(cd));
          setCourseDetails(cd);
          //console.log(response.data)
        } else {
          const userData = JSON.parse(localStorage.getItem("courseDetails"));
          setCourseDetails(userData);
        }
      }
      fetchData(config);
    }
  }, []);

  return (
    <CourseDetailsContext.Provider
      value={{ course_id, courseDetails, setCourseDetails }}
    >
      {children}
    </CourseDetailsContext.Provider>
  );
};

export function useCourseDetails() {
  const context = useContext(CourseDetailsContext);
  if (context === undefined) {
    throw new Error(
      "useCourseDetails must be used within an CourseDetailsProvider"
    );
  }
  return context;
}
