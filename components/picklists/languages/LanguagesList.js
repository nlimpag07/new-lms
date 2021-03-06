import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import {
  Row,
  Col,
  Modal,
  Select,
  Input,
  Divider,
  Spin,
  Checkbox,
  Avatar,
  Button,
  Popconfirm,
  message,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import Cookies from "js-cookie";
import moment from "moment";

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

const LanguagesList = ({
  languagesData,
  page,
  setPage,
  setRunSpin,
  spin,
  showModal,
  hideModal,
}) => {
  const router = useRouter();
  var [modal2Visible, setModal2Visible] = useState((modal2Visible = false));
  //const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(true);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });
  //console.log(languagesData);
  useEffect(() => {
    setLoading(false);
  }, []);

  var lastSelectedIndex = 0;
  const the_data = languagesData && languagesData.length ? languagesData : [];
  const ddata = the_data.map((dataItem) =>
    Object.assign({ selected: false }, dataItem)
  );
  const [Data, setData] = useState(ddata);
  const [theSort, setTheSort] = useState({
    sort: [{ field: "id", dir: "asc" }],
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
  const colorFormat = (props) => {
    //console.log("DateFormat", props.dataItem);
    let dataItem = props.dataItem;
    const editable = dataItem.isEditable === 1 ? "No" : "Yes";
    return <td>{editable}</td>;
  };
  return (
    <>
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
        <Column field="id" title="ID" width="85px" />
        <Column field="name" title="Language Name" />
        <Column field="isEditable" title="Editable?" cell={colorFormat} />
        <Column
          sortable={false}
          cell={(props) =>
            ActionRender(props, showModal, hideModal, setRunSpin)
          }
          field="SupplierID"
          title="Action"
          width="150px"
        />
      </Grid>

      <style jsx global>{`
        .LanguagesList h1 {
          font-size: 2rem;
          font-weight: 700;
        }
        .LanguagesList .k-grid-header {
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
//Deleting Status
function deleteConfirm(e, data, setRunSpin) {
  //console.log(e);
  //console.log("PopConfirm", data);
  //setSpin(true);
  var config = {
    method: "delete",
    url: apiBaseUrl + "/picklist/language/" + data.id,
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
        let theRes = response.data.response;
        //console.log("Response", response.data);
        // wait for response if the verification is true
        if (theRes) {
          Modal.success({
            title: "Deletion Success",
            content: "You have successfully deleted a Language!",
            centered: true,
            width: 450,
            onOk: () => {
              visible: false;
              setRunSpin(true);
              /* router.push(
                "/administrator/picklists/status",
                `/administrator/picklists/status`
              ); */
              //console.log("Should hide modal")
            },
          });
        } else {
        }
      }
    } catch (error) {
      const { response } = error;
      const { request, data } = response; // take everything but 'request'

      console.log("Error Response", data.message);

      Modal.error({
        title: "Error: Unable to delete",
        content: data.message,
        centered: true,
        width: 450,
        onOk: () => {
          //setdrawerVisible(false);
          setRunSpin(true);
          visible: false;
        },
      });
    }
    //setLoading(false);
  }
  fetchData(config);
}

const ActionRender = (props, showModal, hideModal, setRunSpin) => {
  return (
    <td>
      <Button
        icon={<FontAwesomeIcon icon={["fas", `pencil-alt`]} size="lg" />}
        onClick={() => showModal("edit", props.dataItem)}
      />{" "}
      <Popconfirm
        title="Delete this Language?"
        onConfirm={(e) => deleteConfirm(e, props.dataItem, setRunSpin)}
        /*onCancel={deleteCancel} */
        okText="Confirm"
        cancelText="Not Now"
      >
        <Button
          icon={<FontAwesomeIcon icon={["far", `trash-alt`]} size="lg" />}
          /* onClick={() => {
          edit(this.props.dataItem);
        }} */
        />
      </Popconfirm>
    </td>
  );
};

export default LanguagesList;
