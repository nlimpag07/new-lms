import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Row, Spin, Input, Form, Select, Button, message, Tag } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import moment from "moment";
import { CompactPicker, AlphaPicker, CirclePicker } from "react-color";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
/**TextArea declaration */
const { TextArea } = Input;
const { Option } = Select;

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const CoursePostEvaluationsDetails = ({
  dataProps,
  hideModal,
  setRunSpin,
  categories,
}) => {
  console.log("dataProps", dataProps);
  const { title, id } = dataProps;
  const dProps = [dataProps];
  const router = useRouter();
  const [form] = Form.useForm();
  const [hasError, setHasError] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });

  useEffect(() => {}, []);

  var lastSelectedIndex = 0;
  const the_data = dProps && dProps.length ? dProps : [];
  const ddata = the_data.map((dataItem) => {
    let catData =
      dataItem.preassessmentCategory.length &&
      dataItem.preassessmentCategory.map((pcat) => {
        return {
          categoryId: pcat.categoryId,
          categoryName: pcat.category.name,
        };
      });
    //console.log("catData", catData);
    return Object.assign({ selected: false, category: catData }, dataItem);
  });
  console.log("ddata", ddata);
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "desc" }],
  });
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

  const pageChange = (event) => {
    setPagination({
      skip: event.page.skip,
      take: event.page.take,
    });
  };

  var defaultCatOptionsId;
  if (dataProps) {
    let precat = dataProps.category;
    defaultCatOptionsId = precat.map((cat) => cat.categoryId);
  }
  const catOptionList =
    categories.length &&
    categories.map((option, index) => {
      let catNames = `${option.name}`;
      let optValue = option.id;
      return (
        <Option key={index} label={catNames} value={optValue}>
          {catNames}
        </Option>
      );
    });
  return (
    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: "0" }}>
      <Grid
        data={orderBy(
          Data.slice(pagination.skip, pagination.take + pagination.skip),
          theSort.sort
        )}
        /* style={{ height: "550px" }} */
        selectedField="selected"
        onSelectionChange={selectionChange}
        /* onHeaderSelectionChange={headerSelectionChange} */
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
        <Column field="title" title="Evaluation Questions" />
        <Column field="category" title="Answers" cell={categoryRender} />
      </Grid>
      {/* <Form
        form={form}
        onFinish={onFinish}
        layout="horizontal"
        name="detailsPicklistPreassessments"
        initialValues={{
          title: title,
          categoryId: defaultCatOptionsId,
        }}
      >
        <Form.Item
          label="Preassessment Question"
          name="title"
          style={{
            marginBottom: "1rem",
          }}
          rules={[
            {
              required: true,
              message: "Please input Preassessment Name!",
            },
          ]}
        >
          <Input placeholder="Preassessment Name" />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[
            {
              required: true,
              message: "Please Select Category!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Please select Session"
            optionLabelProp="label"
          >
            {catOptionList}
          </Select>
        </Form.Item>
        {hasError ? (
          <p
            style={{
              color: "#ff4d4f",
              textAlign: "right",
              marginBottom: "0",
              minHeight: "25px",
            }}
          >
            {hasError}
          </p>
        ) : (
          <p
            style={{
              color: "#ff4d4f",
              textAlign: "right",
              marginBottom: "0",
              minHeight: "25px",
            }}
          >
            {""}
          </p>
        )}
        <Form.Item
          wrapperCol={{
            span: 24,
          }}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>{" "}
          <Button onClick={() => onCancel(form)}>Cancel</Button>
        </Form.Item>
        {spinning && (
          <div className="spinHolder">
            <Spin
              size="small"
              tip="Processing..."
              spinning={spinning}
              delay={0}
            ></Spin>
          </div>
        )}
      </Form> */}

      <style jsx global>{`
        .colorAvatar:hover {
          cursor: pointer;
        }
        #detailsPicklistPreassessments {
          position: relative;
          width: 100%;
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
          padding: 5% 0;
        }
      `}</style>
    </Row>
  );
};
const categoryRender = (props) => {
  console.log("props", props.dataItem);
  let theCat =
    props.dataItem && props.dataItem.category ? props.dataItem.category : [];
  let catListRender = theCat.length
    ? theCat.map((cat, index) => {
        return <Tag key={index}>{cat.categoryName}</Tag>;
      })
    : [];
  return <td>{catListRender}</td>;
};

export default CoursePostEvaluationsDetails;
