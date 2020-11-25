import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SaveUI from "../theme-layout/course-circular-ui/save-circle-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import UsersAdd from "./UsersAdd";
const apiBaseUrl = process.env.apiBaseUrl;

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

const menulists = [
  {
    title: "Add",
    icon: "&#xf055;",
    active: true,
    url: "/instructor/[course]/edit",
    urlAs: "/instructor/course/edit",
    callback: "add",
    iconClass: "ams-plus-circle",
  },
];

const UsersList = ({ userlist }) => {
  userlist = userlist.result;
  const router = useRouter();
  //console.log(userlist);

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [userModal, setUserModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [spin, setSpin] = useState(true);

  var lastSelectedIndex = 0;
  const ddata = userlist.length
    ? userlist.map((dataItem) => Object.assign({ selected: false }, dataItem))
    : null;
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  //console.log(Data)

  const selectionChange = (event) => {
    const theData = Data.map((item) => {
      if (item.id === event.dataItem.id) {
        item.selected = !event.dataItem.selected;
      }
      return item;
    });
    setData(theData);
  };
  const rowClick = (event) => {
    let last = lastSelectedIndex;
    const theData = [...Data];

    const current = theData.findIndex(
      (dataItem) => dataItem === event.dataItem
    );

    if (!event.nativeEvent.shiftKey) {
      lastSelectedIndex = last = current;
    }

    if (!event.nativeEvent.ctrlKey) {
      theData.forEach((item) => (item.selected = false));
    }
    const select = !event.dataItem.selected;
    for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
      theData[i].selected = select;
    }
    setData(theData);
  };

  const headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const theData = Data.map((item) => {
      item.selected = checked;
      return item;
    });
    setData(theData);
  };

  useEffect(() => {
    /* let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.filter((getCourse) => getCourse.id == course_id);
    setCourseDetails(theCourse[0]); */
  }, []);

  const showModal = (modalOperation) => {
    setUserModal({
      visible: true,
      modalOperation: modalOperation,
    });
  };
  const hideModal = (modalOperation) => {
    setUserModal({
      visible: false,
      modalOperation: modalOperation,
    });
  };

  return (
    //GridType(gridList)
    <Row
      className="widget-container"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      <motion.div initial="hidden" animate="visible" variants={list}>
        <Col
          className="gutter-row widget-holder-col UsersList"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <h1>Users List</h1>
          <Row className="Course-Enrollments">
            <Col xs={24}>
              <Grid
                data={orderBy(Data, theSort.sort)}
                style={{ height: "550px" }}
                selectedField="selected"
                onSelectionChange={selectionChange}
                onHeaderSelectionChange={headerSelectionChange}
                onRowClick={rowClick}
                sortable
                sort={theSort.sort}
                onSortChange={(e) => {
                  setTheSort({
                    sort: e.sort,
                  });
                }}
              >
                <Column
                  field="selected"
                  width="65px"
                  headerSelectionValue={
                    Data.findIndex(
                      (dataItem) => dataItem.selected === false
                    ) === -1
                  }
                />
                <Column field="empId" title="Emp ID" width="100px" />
                <Column field="firstName" title="Name" width="300px" />
                <Column field="lastName" title="Enrollment Type" />
                <Column field="email" title="Email" />

                <Column field="isActive" title="Active Status" />
                <Column
                  sortable={false}
                  cell={() => ActionRender(showModal)}
                  field=""
                  title="Action"
                />
              </Grid>
            </Col>
          </Row>
        </Col>
      </motion.div>
      <Modal
        title={`Users - ${userModal.modalOperation}`}
        centered
        visible={userModal.visible}
        onOk={() => hideModal(userModal.modalOperation)}
        onCancel={() => hideModal(userModal.modalOperation)}
        maskClosable={false}
        destroyOnClose={true}
        width="90%"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="UsersList"
      >
        {userModal.modalOperation == "view" ? (
          "HELLO View"
        ) : userModal.modalOperation == "add" ? (
          <UsersAdd hideModal={hideModal} setSpin={setSpin} />
        ) : userModal.modalOperation == "approve" ? (
          "HELLO Approve"
        ) : userModal.modalOperation == "delete" ? (
          "HELLO Delete"
        ) : (
          "Default"
        )}
      </Modal>

      <SaveUI
        listMenu={menulists}
        position="bottom-right"
        iconColor="#8998BA"
        toggleModal={showModal}
      />
      <style jsx global>{`
        .UsersList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .UsersList .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Row>
  );
};

const ActionRender = (showModal) => {
  return (
    <td>
      <button
        className="k-primary k-button k-grid-edit-command"
        onClick={() => showModal("view")}
      >
        <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
      </button>
      &nbsp;
      <button
        className="k-button k-grid-remove-command"
        /* onClick={() => {
          confirm("Confirm deleting: " + this.props.dataItem.ProductName) &&
            remove(this.props.dataItem);
        }} */
      >
        ✖
      </button>
    </td>
  );
};

export default UsersList;
