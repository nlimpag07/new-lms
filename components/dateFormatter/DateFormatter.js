import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

const DateFormatter = (dateItem) => {
  const [currentDate, setCurrentDate] = useState("");
  //console.log(courseAllList);
  useEffect(() => {
    if (dateItem) {
      let rawDate = new Date(dateItem);
      let newDate =
        rawDate.getFullYear() +
        "/" +
        (rawDate.getMonth() + 1) +
        "/" +
        rawDate.getDate() +
        " " +
        rawDate.getHours() +
        ":" +
        rawDate.getMinutes();

      setCurrentDate(newDate);
    }
  }, [dateItem]);

  return currentDate;
};

export default DateFormatter;
