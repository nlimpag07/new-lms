import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Select, Input, Divider, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";

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

const ClassesAttendanceList = ({ sessionData }) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { trigger, sessionTitle, enrolleeList } = sessionData;
  const [pagination, setPagination] = useState({ skip: 0, take: 5 });

  useEffect(() => {
    //console.log("Learners List", enrolleeList);
    const ddata = enrolleeList.length
      ? enrolleeList.map((dataItem) =>
          Object.assign({ selected: false,learnerName:dataItem.learner.user.firstName }, dataItem)
        )
      : [];
    console.log("Learners List", ddata);
    setData(ddata);
    setLoading(false);
  }, [trigger]);
  /* useEffect(() => {
    var config = {
      method: "get",
      url: apiBaseUrl + "/CourseSession/" + course_id,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: { courseId: course_id },
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
            setSessionSelect(theRes);
            const ddata = theRes.length
              ? theRes.map((dataItem) =>
                  Object.assign({ selected: false }, dataItem)
                )
              : [];
            setData(ddata);
            setSpin(false);
          } else {
            setData([]);
            setSpin(false);
          }
        }
      } catch (error) {
        const { response } = error;
        console.log("Error Response", response);
        Modal.error({
          title: "Error: Unable to Retrieve data",
          content: response + " Please contact Technical Support",
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
  }, []); */
  var lastSelectedIndex = 0;
  /* const the_data = [];
  const ddata = the_data.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata); */
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  //console.log(Data)

  const selectionChange = (event) => {
    const theData = Data.map((item) => {
      if (item.ProductID === event.dataItem.ProductID) {
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

  const pageChange = (event) => {
    setPagination({
      skip: event.page.skip,
      take: event.page.take,
    });
  };

  const dateFormat = (props) => {
    console.log("Props", props.dataItem);
    // const sDate = moment(option.startDate).format("YYYY/MM/DD h:mm a");
    return (
      <td>
        <button
          className="k-primary k-button k-grid-edit-command"
          /* onClick={() => {
             edit(this.props.dataItem);
           }} */
        >
          <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
        </button>
      </td>
    );
  };
  return (
    //GridType(gridList)
    <>
      <Grid
        data={orderBy(
          Data.slice(pagination.skip, pagination.take + pagination.skip),
          theSort.sort
        )}
        /* style={{ height: "550px" }} */
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
        {/* <Grid
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
                > */}
        <Column
          field="selected"
          width="65px"
          headerSelectionValue={
            Data.findIndex((dataItem) => dataItem.selected === false) === -1
          }
        />
        <Column field="learnerName" title="Name" width="300px" />
        <Column field="UnitsInStock" title="Course" />
        <Column field="UnitsOnOrder" title="User Group" />
        <Column field="updatedAt" title="Date" cell={dateFormat} />
        <Column field="Discontinued" title="Present" />
        <Column field="ReorderLevel" title="Late" />
        <Column field="Discontinued" title="Absent" />
        <Column field="Discontinued" title="Excused" />
        {/* <Column
                  sortable={false}
                  cell={ActionRender}
                  field="SupplierID"
                  title="Action"
                /> */}
      </Grid>

      <Modal
        title="Publish Properties"
        centered
        visible={modal2Visible}
        onOk={() => setModal2Visible(false)}
        onCancel={() => setModal2Visible(false)}
        maskClosable={false}
        destroyOnClose={true}
        width={1000}
      >
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </Modal>

      <style jsx global>{`
        .ClassesAttendanceList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ClassesAttendanceList .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .searchResultSeparator.ant-divider-horizontal.ant-divider-with-text {
          margin: 2rem 0;
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
          padding: 34vh 0;
          width: 100%;
        }
      `}</style>
    </>
  );
};

const ActionRender = () => {
  return (
    <td>
      <button
        className="k-primary k-button k-grid-edit-command"
        /* onClick={() => {
          edit(this.props.dataItem);
        }} */
      >
        <FontAwesomeIcon icon={["fas", `eye`]} size="lg" />
      </button>
    </td>
  );
};

export default ClassesAttendanceList;
