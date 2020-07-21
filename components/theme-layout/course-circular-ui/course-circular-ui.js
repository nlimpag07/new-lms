import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Affix, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RadialUI from "./radial-ui";
const menulists = [
  {
    title: "Add",
    icon: "&#xf055;",
    active: true,
    url: "/instructor/course/add",
  },
  {
    title: "Edit",
    icon: "&#xf044;",
    url: "/user/dashboard",
  },
  {
    title: "Delete",
    icon: "&#xf056;",
    url: "/instructor/course",
  },
  {
    title: "Print",
    icon: "&#xf02f;",
    url: "/instructor/dashboard",
  },
  {
    title: "Copy From",
    icon: "&#xf0c5;",
    url: "/instructor/course",
  },
  {
    title: "Import",
    icon: "&#xf1c3;",
    url: "/instructor/dashboard",
  },
  {
    title: "Export",
    icon: "&#xf019;",
    url: "/instructor/course",
  },
];
const CourseCircularUi = () => {
  return (
    <div className="circular-ui" id="circular-ui-holder">
      <RadialUI
        listMenu={menulists}
        position="bottom-right"
        iconColor="#8998BA"
      />
      <style jsx global>{`
        .circular-ui {
          background-color: #000000;
        }
      `}</style>
    </div>
  );
};

export default CourseCircularUi;
