import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Row,
  Col,
  Modal,
  Spin,
  Popconfirm,
  Button,
  Tooltip,
  message,
  Tag,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SaveUI from "../theme-layout/course-circular-ui/save-circle-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy, filterBy } from "@progress/kendo-data-query";
import UsersAdd from "./UsersAdd";
import UsersEdit from "./UsersEdit";
import Cookies from "js-cookie";
import { useViewPort } from "../../providers/ViewPort";

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
  const { viewport } = useViewPort();
  //console.log(viewport)
  //userlist = userlist.result;
  const [userslist, setUsersList] = useState(
    userlist && userlist.length ? userlist.result : null
  );
  const [Data, setData] = useState({ data: userslist, filter: undefined });
  const router = useRouter();
  //console.log(userlist);

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [userModal, setUserModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [spin, setSpin] = useState(true);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });

  useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/Users",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    async function fetchData(config) {
      try {
        const response = await axios(config);
        if (response) {
          let theRes = response.data.result;
          //console.log("Session Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            const ddata = theRes.length
              ? theRes.map((dataItem) => {
                  let isAdmin = dataItem.isAdministrator;
                  let isInstructor = dataItem.isInstructor;
                  let userType =
                    isAdmin === 1
                      ? "Administrator"
                      : isInstructor === 1
                      ? "Instructor"
                      : "Learner";

                  return Object.assign(
                    { selected: false, userType: userType },
                    dataItem
                  );
                })
              : null;
            setData({ data: ddata });
            setUsersList(ddata);
            setSpin(false);
          } else {
            const ddata = userlist.result
              ? userlist.result.map((dataItem) => {
                  let isAdmin = dataItem.isAdministrator;
                  let isInstructor = dataItem.isInstructor;
                  let userType =
                    isAdmin === 1
                      ? "Administrator"
                      : isInstructor === 1
                      ? "Instructor"
                      : "Learner";

                  return Object.assign(
                    { selected: false, userType: userType },
                    dataItem
                  );
                })
              : null;
            setData({ data: ddata });
            setUsersList(ddata);
            setSpin(false);
          }
        }
      } catch (error) {
        console.log("Error Response", error);
        let errContent;
        error.response && error.response.data
          ? (errContent = error.response.data.message)
          : (errContent = `${error}, Please contact Technical Support`);
        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: errContent,
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
    }
    fetchData(config);
  }, [spin]);

  var lastSelectedIndex = 0;
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "desc" }],
  });

  const selectionChange = (event) => {
    const theData = Data.data.map((item) => {
      if (item.id === event.dataItem.id) {
        item.selected = !event.dataItem.selected;
      }
      return item;
    });
    setData({ data: theData });
  };
  const rowClick = (event) => {
    let last = lastSelectedIndex;
    const theData = [...Data.data];

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
    setData({ data: theData });
  };

  const headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const theData = Data.data.map((item) => {
      item.selected = checked;
      return item;
    });
    setData({ data: theData });
  };

  const showModal = (modalOperation, props) => {
    setUserModal({
      visible: true,
      modalOperation: modalOperation,
      dataProps: props,
    });
  };
  const hideModal = (modalOperation) => {
    setUserModal({
      visible: false,
      modalOperation: modalOperation,
      dataProps: null,
    });
  };
  const pageChange = (event) => {
    setPagination({
      skip: event.page.skip,
      take: event.page.take,
    });
  };
  //console.log(Data);
  const AciveStatusRender = (props) => {
    const userStatus =
      props.dataItem && props.dataItem.isActive !== 1 ? (
        <Tag color="green">Active</Tag>
      ) : (
        <Tag color="red">Inactive</Tag>
      );
    return <td>{userStatus}</td>;
  };
  const filterChange = (event) => {
    setData({
      data: filterBy(userslist, event.filter),
      filter: event.filter,
    });
  };
  return (
    //GridType(gridList)
    <Row
      className="widget-container"
      /* gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} */
      /* style={{ margin: "1rem 0" }} */
    >
      <motion.div initial="hidden" animate="visible" variants={list}>
        <div className="common-holder">
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
                  <Grid
                    data={orderBy(
                      Data.data.slice(
                        pagination.skip,
                        pagination.take + pagination.skip
                      ),
                      theSort.sort
                    )}
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
                    skip={pagination.skip}
                    take={pagination.take}
                    total={Data.data.length}
                    pageable={true}
                    onPageChange={pageChange}
                    filterable={true}
                    filter={Data.filter}
                    onFilterChange={filterChange}
                  >
                    <Column
                      field="selected"
                      width="65px"
                      headerSelectionValue={
                        Data.data.findIndex(
                          (dataItem) => dataItem.selected === false
                        ) === -1
                      }
                      filterable={false}
                    />
                    <Column
                      field="empId"
                      title="Emp ID"
                      width="100px"
                      filter={"numeric"}
                      filterable={false}
                    />
                    <Column
                      field="firstName"
                      title="First Name"
                      width="300px"
                    />
                    <Column field="lastName" title="Last Name" width="300px" />
                    <Column field="userType" title="User Type" />
                    <Column field="email" title="Email" />

                    <Column
                      field="isActive"
                      title="Active Status"
                      cell={AciveStatusRender}
                      filterable={false}
                    />
                    <Column
                      sortable={false}
                      cell={(item) =>
                        ActionRender(item, showModal, hideModal, setSpin)
                      }
                      field=""
                      title="Action"
                      filterable={false}
                    />
                  </Grid>
                )}
              </Col>
            </Row>
          </Col>
        </div>
      </motion.div>
      <Modal
        title={`Users - ${userModal.modalOperation}`}
        centered
        visible={userModal.visible}
        onOk={() => hideModal(userModal.modalOperation)}
        onCancel={() => hideModal(userModal.modalOperation)}
        maskClosable={false}
        destroyOnClose={true}
        width="50%"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="UsersAddForm"
      >
        {userModal.modalOperation == "edit" ? (
          <UsersEdit
            dataProps={userModal.dataProps}
            hideModal={hideModal}
            setSpin={setSpin}
          />
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

        .UsersAddForm .ant-modal-body {
          padding: 3rem;
        }
        .UsersAddForm .ant-modal-footer {
          display: none;
        }
        .spinHolder {
          text-align: center;
          z-index: 100;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          background-color: #ffffff;
          padding: 34% 0;
        }
      `}</style>
    </Row>
  );
};
const activationProcessSelected = (item, setSpin) => {
  const key = "updatable";
  message.loading({ content: "Processing...", key });
  //console.log("activationProcessSelected", item);
  //if item.isActive is currently 1, means current status is inactive
  //so the activate value must be set to true to make the user active.
  //if item.isActive is currently 0, it means current status is active
  //so the activate value must be set to false to make the user inactive.
  let uStatus = item.isActive === 1 ? true : false;
  var config = {
    method: "put",
    url: apiBaseUrl + "/Users/Activation",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: { userId: item.id, activate: uStatus },
  };
  axios(config)
    .then((res) => {
      openMessage(res.data.message, res.data.response, key);
    })
    .catch((error) => {
      console.log("error Response: ", error);
      error.response && error.response.data
        ? openMessage(error.response.data.message, false, key)
        : openMessage(`Error:${error}`, false, key);
    })
    .then(() => {
      setSpin(true);
    });

  const openMessage = (msg, resp, key) => {
    /*const key = "updatable";
     message.loading({ content: "Processing...", key }); */
    setTimeout(() => {
      if (resp) {
        message.success({ content: msg, key, duration: 5 });
        /* setSpinning(false); */
        //setSpin(true);
      } else {
        message.error({ content: msg, key, duration: 5 });
        /* setSpinning(false);
        setSpin(false); */
      }
    }, 100);
  };
};

const ActionRender = (item, showModal, hideModal, setSpin) => {
  const userStatus = item.dataItem.isActive;
  let iconDynamic = userStatus === 1 ? "unlock" : "lock";
  let ttText = userStatus === 1 ? "Activate" : "Deactivate";
  let btnClass = userStatus === 1 ? "activateClass" : "deactivateClass";
  //console.log(list)
  return (
    <td>
      <Tooltip
        trigger="hover"
        title="View/Edit"
        destroyTooltipOnHide={true}
        placement="bottom"
      >
        <Button
          icon={<FontAwesomeIcon icon={["fas", `pencil-alt`]} size="sm" />}
          onClick={() => showModal("edit", item.dataItem)}
        />
      </Tooltip>
      &nbsp;
      <Tooltip
        trigger="hover"
        title={ttText}
        destroyTooltipOnHide={true}
        placement="bottom"
      >
        <Popconfirm
          title={`Are you sure to ${ttText}?`}
          okText="Yes"
          cancelText="No"
          onConfirm={() => activationProcessSelected(item.dataItem, setSpin)}
        >
          <Button
            icon={<FontAwesomeIcon icon={["fas", iconDynamic]} size="sm" />}
            alt="Submit"
            className={btnClass}
          />
        </Popconfirm>
      </Tooltip>
      <style jsx global>{`
        .activateClass {
          color: #87d068;
          border-color: #87d0687a;
        }
        .deactivateClass {
          color: #f50;
          border-color: #ff55004a;
        }
        .ant-btn.deactivateClass:hover,
        .ant-btn.deactivateClass:focus {
          color: #ca6f41;
          border-color: #ff5500a8;
        }
        .ant-btn.activateClass:hover,
        .ant-btn.activateClass:focus {
          color: #86b970;
          border-color: #87d068;
        }
      `}</style>
    </td>
  );
};

export default UsersList;
