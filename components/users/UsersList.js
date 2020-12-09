import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Spin, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SaveUI from "../theme-layout/course-circular-ui/save-circle-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import UsersAdd from "./UsersAdd";
import Cookies from "js-cookie";

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
  //userlist = userlist.result;
  const [userslist, setUsersList] = useState(userlist.result);
  const [Data, setData] = useState("");
  const router = useRouter();
  //console.log(userlist);

  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  var [userModal, setUserModal] = useState(false);
  const [courseDetails, setCourseDetails] = useState("");
  const [spin, setSpin] = useState(true);
  const [pagination, setPagination] = useState({ skip: 0, take: 5 });

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
          //setOutcomeList(response.data.result);
          let theRes = response.data.result;
          console.log("Session Response", response.data);
          // wait for response if the verification is true
          if (theRes) {
            //console.log(theRes)

            const ddata = theRes.length
              ? theRes.map((dataItem) =>
                  Object.assign({ selected: false }, dataItem)
                )
              : null;
            setData(ddata);
            setUsersList(ddata);
            setSpin(false);
          } else {
            const ddata = userlist.result
              ? userlist.result.map((dataItem) =>
                  Object.assign({ selected: false }, dataItem)
                )
              : null;
            setData(ddata);
            setUsersList(ddata);
            setSpin(false);
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, data } = response; // take everything but 'request'

        console.log("Error Response", data.message);

        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: data.message + " Please contact Technical Support",
          centered: true,
          width: 450,
          onOk: () => {
            //setdrawerVisible(false);
            visible: false;
          },
        });
      }
      //setLoading(false);
    }
    fetchData(config);
  }, [spin]);

  var lastSelectedIndex = 0;
  /* const ddata = userslist.length
    ? userslist.map((dataItem) => Object.assign({ selected: false }, dataItem))
    : null; 
  const [Data, setData] = useState(userslist);*/
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  //console.log("Data", Data);

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
  const pageChange = (event) => {
    setPagination({
      skip: event.page.skip,
      take: event.page.take,
    });
  };
  console.log(Data)
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
                    Data.slice(
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
                  total={Data.length}
                  pageable={true}
                  onPageChange={pageChange}
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
                    cell={ActionRender}
                    field=""
                    title="Action"
                  />
                </Grid>
              )}
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
        width="50%"
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        className="UsersAddForm"
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
        .UsersAddForm .ant-modal-body {
          padding: 3rem;
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

const removeSelected = (item) => {
  
  console.log("onRemove", item.id);
  
  var config = {
    method: "delete",
    url: apiBaseUrl + "/Users/" + item.id,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    data: { id: item.id },
  };
  async function fetchData(config) {
    try {
      const response = await axios(config);
      if (response) {
        //setAssessmentList(response.data.result);
        console.log("Response", response.data);        
        message.success(response.data.message);
        setSpin(true);
      }
    } catch (error) {
      const { response } = error;
      //const { request, ...errorObject } = response; // take everything but 'request'      
      console.log(response.data.message);
      Modal.error({
        title: "Unable to Delete",
        content: response.data.message,
        centered: true,
        width: 450,
      });
    }
    //setLoading(false);
  }
  fetchData(config);
};

const ActionRender = (item) => {
  //console.log(list)
  return (
    <td>
      <button
        className="k-primary k-button k-grid-edit-command"
        /* onClick={() => showModal("view")} */
      >
        <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
      </button>
      &nbsp;
      <Popconfirm
        title="Are you sure？"
        okText="Yes"
        cancelText="No"
        onConfirm={() => removeSelected(item.dataItem)}
      >
        <button
          className="k-button k-grid-remove-command"
          /* onClick={() => {
          confirm("Confirm deleting: " + this.props.dataItem.ProductName) &&
            remove(this.props.dataItem);
        }} */
        >
          ✖
        </button>
      </Popconfirm>
    </td>
  );
};

export default UsersList;
