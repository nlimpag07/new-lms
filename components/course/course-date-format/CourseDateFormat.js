import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../../providers/CourseProvider";
import moment from "moment";

const CourseDateFormat = (props) => {
  const { course_id, updatedAt } = props;
  const { courseAllList } = useCourseList();
  const [currentDate, setCurrentDate] = useState("");  
  useEffect(() => {
    let theDate = moment().subtract(2, "minutes").format("YYYY-MM-DD h:mm a");

    if (courseAllList) {
      let theCourse = courseAllList.result.filter(
        (course) => course.id == course_id
      );
      let courseDate =
        theCourse && theCourse.length ? moment(theCourse[0].updatedAt).format("YYYY-MM-DD h:mm a") : theDate;
      theDate = courseDate;
    }
    setCurrentDate(theDate);

    /*let theCourse = courseAllList.result.filter(
      (course) => course.id == course_id
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
     */
  }, [course_id]);

  return <h3 className="widget-title">Draft save: {currentDate}</h3>;
};

export default CourseDateFormat;
