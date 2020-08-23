import React, { Component, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import ReactDOM from "react-dom";
import { Row, Col, List } from "antd";
import Link from "next/link";



const CourseEnrollmentsviewWidget = ({ course_id, course_enrollments }) => {
  var enrollees = [];
  const tdata = course_enrollments.map((dataItem) => {
    dataItem.learner.map((item) => {
      if(item.courseId ==course_id){
        dataItem['enrollmentType']=item.enrollmentType;
        dataItem['statusName']=item.statusName;
        dataItem['startDate']=item.startDate;
        enrollees.push(dataItem)
      }
    });
    //console.log("tdata", dataItem);
  });
  //console.log(enrollees)


  var lastSelectedIndex = 0;
  const ddata = enrollees.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "firstName", dir: "asc" }],
  });
  //console.log(Data)

  const selectionChange = (event) => {
    const theData = Data.map((item) => {
      if (item.empId === event.dataItem.empId) {
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

  /*  const {
    relatedCourse,
    courseCompetencies,
    courseInstructor,
  } = course_details;
  console.log(course_details);

  useEffect(() => {}, []); */

  return (
    <div className="tab-content">
      <Row className="Course-Enrollments">
        <Col xs={24}>
          <Grid
            data={orderBy(Data, theSort.sort)}
            style={{ height: "400px" }}
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
                Data.findIndex((dataItem) => dataItem.selected === false) === -1
              }
            />
            <Column field="firstName" title="First Name" width="300px" />
            <Column field="lastName" title="Last Name" />
            <Column field="enrollmentType" title="Enrollment Type" />
            <Column field="middleInitial" title="User Group" />
            <Column field="startDate" title="Enrollment Date" />
            <Column field="statusName" title="Status" />
            <Column
              sortable={false}
              cell={ActionRender}
              field="SupplierID"
              title="Action"
            />
          </Grid>
        </Col>
      </Row>

      <style jsx global>{`
        .Course-Enrollments .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
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
        ✔
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
export default CourseEnrollmentsviewWidget;
