import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";

const CourseDateFormat = (props) => {
  const { course_id,updatedAt } = props;
  const { courseAllList } = useCourseList();
  const [currentDate, setCurrentDate] = useState("");
  //console.log(courseAllList);
  useEffect(() => {
    
    if (courseAllList) {
      let theCourse = courseAllList.result.filter(
        (course) => course.id == course_id
      );
      console.log(theCourse)
      let rawDate = new Date(theCourse[0].updatedAt);
      let newDate =
        rawDate.getFullYear() +
        "-" +
        (rawDate.getMonth() + 1) +
        "-" +
        rawDate.getDate() +
        " " +
        rawDate.getHours() +
        ":" +
        rawDate.getMinutes();
      setCurrentDate(newDate);
    } else {
      let allCourse = JSON.parse(localStorage.getItem("courseAllList"));
      let theCourse = allCourse.result.filter(
        (getCourse) => getCourse.id == course_id
      );
      let rawDate = new Date(theCourse[0].updatedAt);
      let newDate =
        rawDate.getFullYear() +
        "-" +
        (rawDate.getMonth() + 1) +
        "-" +
        rawDate.getDate() +
        " " +
        rawDate.getHours() +
        ":" +
        rawDate.getMinutes();
      setCurrentDate(newDate);
    }
  }, [course_id]);

  return <h3 className="widget-title">Draft save: {currentDate}</h3>;
};

export default CourseDateFormat;
