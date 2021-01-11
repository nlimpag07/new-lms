import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Row, Col, Affix, Button, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/***Radial Import***/
import RadialUI from "./RadialUI";
import Cookies from "js-cookie";
const linkUrl = Cookies.get("usertype");

/*Menu for Radial
 * required title, icon, url, urlAs
 * optional: active, callback
 * callback is used for modal
 * url and urlAs is used for linking (href) and with dynamic routes
 * 
 */
const menulists = [
  {
    title: "Add",
    icon: "&#xf055;",
    active: true,    
    url: `/${linkUrl}/[course]/[...manage]`,
    urlAs: `/${linkUrl}/course/add`,
  },
  {
    title: "Edit",
    icon: "&#xf044;",    
    url: `"/${linkUrl}/[course]/edit"`,
    urlAs: `/${linkUrl}/course/edit`,
    callback: "Edit",
  },
  {
    title: "Delete",
    icon: "&#xf056;",    
    url: `/${linkUrl}/course`,
    urlAs: `/${linkUrl}/course/add`,
    callback: "Delete",
  },
  {
    title: "Print",
    icon: "&#xf02f;",    
    url: `/${linkUrl}/dashboard`,
    urlAs: `/${linkUrl}/course/add`,
    callback: "Print",
  },
  {
    title: "Copy From",
    icon: "&#xf0c5;",    
    url: `/${linkUrl}/course`,
    urlAs: `/${linkUrl}/course/add`,
    callback: "Copy From",
  },
  {
    title: "Import",
    icon: "&#xf1c3;",
    url: `/${linkUrl}/dashboard`,
    urlAs: `/${linkUrl}/course/add`,
    callback: "Import",
  },
  {
    title: "Export",
    icon: "&#xf019;",
    url: `/${linkUrl}/course`,
    urlAs: `/${linkUrl}/course/add`,
    callback: "Export",
  },
];


const CourseCircularUi = () => {
  var [courseActionModal, setCourseActionModal] = useState({
    StateModal: false,
    modalTitle: "",
  });
  const toggleShow = (modaltitle) => {
    setCourseActionModal({
      StateModal: true,
      modalTitle: modaltitle,
    });
  }
  return (
    <div className="circular-ui" id="circular-ui-holder">
      <RadialUI
        listMenu={menulists}
        position="bottom-right"
        iconColor="#8998BA"
        toggleModal={toggleShow}
      />
      <Modal
        title={courseActionModal.modalTitle}
        centered
        visible={courseActionModal.StateModal}
        onOk={() => setCourseActionModal({
          StateModal: false,
          modalTitle: "",
        })}
        onCancel={() => setCourseActionModal({
          StateModal: false,
          modalTitle: "",
        })}
        maskClosable={false}
        destroyOnClose={true}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>
      <style jsx global>{`
        .circular-ui {
          background-color: #000000;
          z-index:1000;
        }
      `}</style>
    </div>
  );
};

export default CourseCircularUi;
