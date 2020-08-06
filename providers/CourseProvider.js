import React, {
  useReducer,
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

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
export const CourseListProvider = ({
  children,
  course_all_list,
}) => {
  const [courseAllList, setCourseAllList] = useState(course_all_list);
  useEffect(() => {
    if (courseAllList) {
      localStorage.setItem("courseAllList", JSON.stringify(courseAllList));
    } else {
      
        const userData = JSON.parse(localStorage.getItem("courseAllList"));
        setCourseAllList(userData);
      
    }
  }, [courseAllList]);

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
