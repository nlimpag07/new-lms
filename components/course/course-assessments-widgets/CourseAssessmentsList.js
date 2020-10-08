import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";

const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

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

const userlist = [
  /* {
    empId: 1,
    firstName: "Noel",
    lastName: "Limpag",
    email: "nlimpag@ams.global",
    isActive: 1,
  },
  {
    empId: 2,
    firstName: "Noel2",
    lastName: "Limpag2",
    email: "nlimpag2@ams.global",
    isActive: 1,
  },
  {
    empId: 3,
    firstName: 'Noel3',
    lastName:'Limpag3',
    email: 'nlimpag@ams.global',
    isActive: 0,
    }, */
];

const CourseAssessmentsList = (props) => {
  /* userlist = userlist.result; */
  const router = useRouter();
  const {
    curAssessmentId,
    setcurAssessmentId,
    assessmentList,
    setAssessmentList,
    loading,
    setLoading,
    resetFields,
  } = props;
  //console.log(resetFields)
  const [courseDetails, setCourseDetails] = useState("");
  var dataList = [];

  /*  const showModal = (modaltitle, modalbodycontent) => {
    setassessmentActionModal({
      visible: true,
      modalTitle: modaltitle,
      modalBodyContent: modalbodycontent,
    });
  }; */

  /*  useEffect(() => {
    let theList = assessmentList;
    setAssessmentList(theList);
    //console.log("The assessment List",assessmentList)
  }, []); */
  /* useEffect(() => {
    let theList = assessmentList;
    setAssessmentList(theList);
    console.log("The assessment List",assessmentList)
  }, [loading]); */
  //console.log("The assessment List",assessmentList)
  if (assessmentList) {
    assessmentList.map((dataItem) => {
      //dataItem.
      let theassessment = {
        id: dataItem.id,
        title: dataItem.title,
        toDate: dataItem.toDate,
        dueDate: dataItem.toDate ? dataItem.toDate : "Immediate",
        courseAssessmentItem: dataItem.courseAssessmentItem.length,
        assessmentType: dataItem.assessmentType.name,
        assessmentTypeId: dataItem.assessmentTypeId,
        userGroup: dataItem.userGroup ? dataItem.userGroup.name : 0,
        userGroupId: dataItem.userGroupId,
        passingGrade: dataItem.passingGrade,
      };
      (dataItem["dueDate"] = dataItem.toDate ? dataItem.toDate : "Immediate"),
        (dataItem["courseAssessmentItemCount"] =
          dataItem.courseAssessmentItem.length),
        (dataItem["assessmentTypeName"] = dataItem.assessmentType.name),
        (dataItem["userGroupName"] = dataItem.userGroup
          ? dataItem.userGroup.name
          : "--"),
        dataList.push(dataItem);
    });
    //console.log('Data List: ',dataList);
  }

  var lastSelectedIndex = 0;
  const ddata = dataList.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
  });
  //console.log(Data)

  const selectionChange = (event) => {
    const theData = Data.map((item) => {
      if (item.id === event.dataItem.id) {
        item.selected = !event.dataItem.selected;
        //setassessment(item);
      } else {
        item.selected = false;
      }
      return item;
    });
    setData(theData);

    let isSelected = theData.filter((newdata) => newdata.selected === true);
    setcurAssessmentId(isSelected);
    //console.log("The Data: ", isSelected);
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
    //console.log("The RowClick: ", theData);
  };

  /* const headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const theData = Data.map((item) => {
      item.selected = checked;
      return item;
    });
    setData(theData);
  }; */

  const removeSelected = (item) => {
    //console.log(item.id);
    //setModal2Visible(true)
    /* let newDataList = assessmentList;   
    let index = newDataList.findIndex(
      (p) => p === item || (item.id && p.id === item.id)
    );
    if (index >= 0) {
      newDataList.splice(index, 1);
    }    
    setAssessmentList(newDataList); */
    var config = {
      method: "delete",
      url: apiBaseUrl + "/CourseAssessment/" + item.id,
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
          setLoading(true);
        }
      } catch (error) {
        const { response } = error;
        //const { request, ...errorObject } = response; // take everything but 'request'
        /* setassessmentActionModal({
          visible: false,
          modalTitle: "",
          modalBodyContent: "",
        }); */
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
  /*  useEffect(() => {
  }, []); */
  const ActionRender = (list) => {
    //console.log(list.dataItem)
    return (
      <td>
        <Popconfirm
          title="Are you sure？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => removeSelected(list.dataItem)}
        >
          <button
            className="k-button k-grid-remove-command"
            //onClick={() => removeSelected(list.dataItem)}
            /* onClick={() => {
            removeSelected(list.dataItem);
             confirm("Confirm deleting: " + list.dataItem.title) &&
              remove(list.dataItem);
          }} */
          >
            <FontAwesomeIcon icon={["fas", `trash-alt`]} size="lg" />
          </button>
        </Popconfirm>
      </td>
    );
  };
  return (
    //GridType(gridList)
    <Row className="widget-container">
      <motion.div initial="hidden" animate="visible" variants={list}>
        <div>
          <Row className="Course-Enrollments">
            <Col xs={24}>
              <Grid
                data={orderBy(Data, theSort.sort)}
                style={{ height: "auto" }}
                selectedField="selected"
                onSelectionChange={selectionChange}
                /* onHeaderSelectionChange={headerSelectionChange} */
                onRowClick={selectionChange}
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
                <Column field="title" title="Title" width="300px" />
                <Column field="dueDate" title="Due" />
                <Column field="courseAssessmentItemCount" title="Items" />
                <Column field="assessmentTypeName" title="Type" />
                <Column field="userGroupName" title="User Group" />
                <Column field="passingGrade" title="Passing Grade" />
                <Column
                  width="100px"
                  sortable={false}
                  cell={ActionRender}
                  field="isActive"
                  title="Action"
                />
              </Grid>
            </Col>
          </Row>
        </div>
      </motion.div>
      {/* <CourseCircularUi /> */}
      <style jsx global>{`
        .CourseAssessmentsList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .CourseAssessmentsList .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Row>
  );
};

export default CourseAssessmentsList;
