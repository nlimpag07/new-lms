import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Col, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";

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

const products = [
  {
    ProductID: 1,
    ProductName: "Chai",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "10 boxes x 20 bags",
    UnitPrice: 18.0,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
  },
  {
    ProductID: 2,
    ProductName: "Chang",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "24 - 12 oz bottles",
    UnitPrice: 19.0,
    UnitsInStock: 17,
    UnitsOnOrder: 40,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
  },
  {
    ProductID: 3,
    ProductName: "Aniseed Syrup",
    SupplierID: 1,
    CategoryID: 2,
    QuantityPerUnit: "12 - 550 ml bottles",
    UnitPrice: 10.0,
    UnitsInStock: 13,
    UnitsOnOrder: 70,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 4,
    ProductName: "Chef Anton's Cajun Seasoning",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: "48 - 6 oz jars",
    UnitPrice: 22.0,
    UnitsInStock: 53,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 5,
    ProductName: "Chef Anton's Gumbo Mix",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: "36 boxes",
    UnitPrice: 21.35,
    UnitsInStock: 0,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 6,
    ProductName: "Grandma's Boysenberry Spread",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: "12 - 8 oz jars",
    UnitPrice: 25.0,
    UnitsInStock: 120,
    UnitsOnOrder: 0,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 7,
    ProductName: "Uncle Bob's Organic Dried Pears",
    SupplierID: 3,
    CategoryID: 7,
    QuantityPerUnit: "12 - 1 lb pkgs.",
    UnitPrice: 30.0,
    UnitsInStock: 15,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 7,
      CategoryName: "Produce",
      Description: "Dried fruit and bean curd",
    },
  },
  {
    ProductID: 8,
    ProductName: "Northwoods Cranberry Sauce",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: "12 - 12 oz jars",
    UnitPrice: 40.0,
    UnitsInStock: 6,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
  },
  {
    ProductID: 9,
    ProductName: "Mishi Kobe Niku",
    SupplierID: 4,
    CategoryID: 6,
    QuantityPerUnit: "18 - 500 g pkgs.",
    UnitPrice: 97.0,
    UnitsInStock: 29,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 6,
      CategoryName: "Meat/Poultry",
      Description: "Prepared meats",
    },
  },
  {
    ProductID: 10,
    ProductName: "Ikura",
    SupplierID: 4,
    CategoryID: 8,
    QuantityPerUnit: "12 - 200 ml jars",
    UnitPrice: 31.0,
    UnitsInStock: 31,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 8,
      CategoryName: "Seafood",
      Description: "Seaweed and fish",
    },
  },
  {
    ProductID: 11,
    ProductName: "Queso Cabrales",
    SupplierID: 5,
    CategoryID: 4,
    QuantityPerUnit: "1 kg pkg.",
    UnitPrice: 21.0,
    UnitsInStock: 22,
    UnitsOnOrder: 30,
    ReorderLevel: 30,
    Discontinued: false,
    Category: {
      CategoryID: 4,
      CategoryName: "Dairy Products",
      Description: "Cheeses",
    },
  },
];

const ClassesAttendance = ({ course_id }) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  const [courseDetails, setCourseDetails] = useState("");

  var lastSelectedIndex = 0;
  const ddata = products.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "ProductName", dir: "asc" }],
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

  useEffect(() => {
    let allCourses = JSON.parse(localStorage.getItem("courseAllList"));
    let theCourse = allCourses.result.filter(
      (getCourse) => getCourse.id == course_id
    );
    setCourseDetails(theCourse[0]);
  }, []);

  return (
    //GridType(gridList)
    <Row
      className="widget-container"
      gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
      style={{ margin: "1rem 0" }}
    >
      <motion.div initial="hidden" animate="visible" variants={list}>
        <Col
          className="gutter-row widget-holder-col ClassesAttendance"
          xs={24}
          sm={24}
          md={24}
          lg={24}
        >
          <h1>{courseDetails.title}: Attendance</h1>
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
                <Column field="ProductName" title="Name" width="300px" />
                <Column field="UnitsInStock" title="Course" />
                <Column field="UnitsOnOrder" title="User Group" />
                <Column field="ReorderLevel" title="Date" />
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
            </Col>
          </Row>
        </Col>
      </motion.div>
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
        .ClassesAttendance h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .ClassesAttendance .k-grid-header {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </Row>
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

export default ClassesAttendance;
