import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Select, Input, Divider, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Cookies from "js-cookie";
import moment from "moment";
import SaveUI from "../../theme-layout/course-circular-ui/save-circle-ui";
import LanguagesList from "./LanguagesList";
import LanguagesAdd from "./LanguagesAdd";
import LanguagesEdit from "./LanguagesEdit";

const { Search } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const list = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      delay: 0.1,
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

/*menulists used by radial menu */
const menulists = [
  {
    title: "Add",
    icon: "&#xf055;",
    active: true,
    url: "",
    urlAs: "",
    callback: "Save",
    iconClass: "ams-plus-circle",
  },
];

const Levels = ({ data }) => {
  //console.log("data", data);
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [languagesModal, setLanguagesModal] = useState({
    visible: false,
    modalOperation: "",
    dataProps: null,
    width: "auto",
  });
  const [spin, setSpin] = useState(true);
  const [runSpin, setRunSpin] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState("");
  const [allLanguagesData, setAllLanguagesData] = useState([]);
  const [languagesData, setLanguagesData] = useState([]);
  const [page, setPage] = useState({
    currentPage: 0,
    pageSize: 0,
    totalPages: 0,
    totalRecords: 0,
    orderBy: "",
  });

  useEffect(() => {
    if (runSpin) {
      setSpin(true);
      var config = {
        method: "get",
        url: apiBaseUrl + "/picklist/language",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        //data: { courseId: course_id },
      };
      async function fetchData(config) {
        try {
          const response = await axios(config);
          if (response) {
            let theRes = response.data;
            console.log("Session Response", response.data);
            if (theRes) {
              const {
                currentPage,
                pageSize,
                totalPages,
                totalRecords,
                orderBy,
                result,
              } = theRes;
              setPage({
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                totalRecords: totalRecords,
                orderBy: orderBy,
              });
              setAllLanguagesData(result);
              setLanguagesData(result);
              setSpin(false);
            } else {
            }
          }
        } catch (error) {
          const { response } = error;
          console.log("Error Response", response);
        }
      }
      fetchData(config);
      setRunSpin(false);
    }
  }, [runSpin]);

  useEffect(() => {
    const {
      currentPage,
      pageSize,
      totalPages,
      totalRecords,
      orderBy,
      result,
    } = data;
    setPage({
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      totalRecords: totalRecords,
      orderBy: orderBy,
    });
    setAllLanguagesData(result);
    setLanguagesData(result);
    setSpin(false);
  }, []);

  const showModal = (modalOperation, props) => {
    setLanguagesModal({
      visible: true,
      modalOperation: modalOperation,
      dataProps: props,
    });
  };
  const hideModal = (modalOperation) => {
    setLanguagesModal({
      visible: false,
      modalOperation: modalOperation,
    });
  };

  function onBlur() {
    //console.log("blur");
  }
  function onFocus() {
    //console.log("focus");
  }
  function onSearch(val) {
    console.log("search:", val);
    setSpin(true);
    setSearchLoading(true);
    let searchedData = allLanguagesData.filter((d) =>
      d.name.toLowerCase().includes(val.toLowerCase())
    );
    /*  searchedData && searchedData.length
      ? setLanguagesData(searchedData)
      : setLanguagesData(allLanguagesData); */
    setLanguagesData(searchedData);
  }
  useEffect(() => {
    if (searchLoading) {
      setSpin(false);
      setSearchLoading(false);
    }
  }, [searchLoading]);

  return (
    //GridType(gridList)

    <motion.div initial="hidden" animate="visible" variants={list}>
      <Row
        className="widget-container"
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ margin: "1rem 0" }}
      >
        <Col
          className="gutter-row widget-holder-col Levels"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <h1>Picklists: Languages</h1>
          <Row className="widget-header-row" justify="start">
            <Col xs={24} xs={24} sm={12} md={8} lg={8}>
              <Search
                placeholder="Search Language"
                enterButton="Search"
                size="large"
                loading={searchLoading}
                onSearch={onSearch}
              />
            </Col>
          </Row>
          <Row className="PicklistLanguages">
            <Col xs={24}>
              {spin ? (
                <div className="spinHolder">
                  <Spin
                    size="small"
                    tip="Retrieving data..."
                    spinning={spin}
                    delay={100}
                  ></Spin>
                </div>
              ) : (
                <Col xs={24}>
                  <LanguagesList
                    languagesData={languagesData}
                    page={page}
                    setPage={setPage}
                    setRunSpin={setRunSpin}
                    spin={spin}
                    showModal={showModal}
                    hideModal={hideModal}
                  />
                </Col>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title={`Languages - ${languagesModal.modalOperation}`}
        centered
        visible={languagesModal.visible}
        onOk={() => hideModal(languagesModal.modalOperation)}
        onCancel={() => hideModal(languagesModal.modalOperation)}
        maskClosable={false}
        destroyOnClose={true}
        width={languagesModal.width}
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="PicklistlanguagesModal"
      >
        {languagesModal.modalOperation == "edit" ? (
          <LanguagesEdit dataProps={languagesModal.dataProps} hideModal={hideModal} setRunSpin={setRunSpin} />
        ) : languagesModal.modalOperation == "add" ? (
          <LanguagesAdd hideModal={hideModal} setRunSpin={setRunSpin} />
        ) : languagesModal.modalOperation == "approve" ? (
          "Hello Approve"
        ) : languagesModal.modalOperation == "delete" ? (
          "HELLO Delete"
        ) : (
          "Default"
        )}
      </Modal>
      <SaveUI
        listMenu={menulists}
        position="bottom-right"
        iconColor="#8998BA"
        toggleModal={() => showModal("add")}
      />
      <style jsx global>{`
        .PicklistLanguages {
          margin-top: 1rem;
        }
        .Levels h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .Levels .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .searchResultSeparator.ant-divider-horizontal.ant-divider-with-text {
          margin: 0.5rem 0;
        }
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: relative;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          width: 100%;
        }
        .PicklistlanguagesModal .ant-modal-footer {
          display: none;
          opacity: 0;
        }
      `}</style>
    </motion.div>
  );
};

export default Levels;
