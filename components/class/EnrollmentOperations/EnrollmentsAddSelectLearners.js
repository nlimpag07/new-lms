import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Transfer, Table, Tag } from "antd";
import difference from "lodash/difference";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const EnrollmentsAddSelectLearners = ({
  course_id,
  unEnrolledLearners,
  hideModal,
  setSelectedUserId,
}) => {
  const router = useRouter();
  const [targetKeys, setTargetKeys] = useState([]);

  const [mockData, setMockData] = useState([]);
  //console.log("unEnrolledLearners", unEnrolledLearners);
  let theLearners = [
    {
      id: 2,
      firstName: "Dummy",
      lastName: "Learner - James",
      email: "learner@gmail.com",
    },
    {
      id: 3,
      firstName: "Dummy2",
      lastName: "Learner - Ingram",
      email: "learner2@gmail.com",
    },
    {
      id: 4,
      firstName: "Dummy3",
      lastName: "Learner - Davies",
      email: "learner3@gmail.com",
    },
  ];
  const tKeys = [];
  const mData = [];
  for (let i = 0; i < theLearners.length; i++) {
    const data = {
      key: i.toString(),
      id: theLearners[i].id,
      firstName: theLearners[i].firstName,
      lastName: theLearners[i].lastName,
      email: theLearners[i].email,
    };
    if (data.chosen) {
      tKeys.push(data.key);
    }
    mData.push(data);
  }
  useEffect(() => {
    setMockData(mData);
    //setTargetKeys(tKeys);
  }, []);

  // Customize Table Transfer
  const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
    <Transfer {...restProps} showSelectAll={false}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === "left" ? leftColumns : rightColumns;

        const rowSelection = {
          getCheckboxProps: (item) => ({
            disabled: listDisabled || item.disabled,
          }),
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter((item) => !item.disabled)
              .map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            pagination={{ defaultPageSize: 5 }}
            style={{ pointerEvents: listDisabled ? "none" : null }}
            /* onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })} */
          />
        );
      }}
    </Transfer>
  );

  const mockTags = ["cat", "dog", "bird"];

  const originTargetKeys = mockData
    .filter((item) => +item.key % 3 > 1)
    .map((item) => item.key);

  const leftTableColumns = [
    {
      dataIndex: "firstName",
      title: "First Name",
    },
    {
      dataIndex: "lastName",
      title: "Last Name",
      //render: (tag) => <Tag>{tag}</Tag>,
    },
    {
      dataIndex: "email",
      title: "Email",
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: "firstName",
      title: "First Name",
    },
    {
      dataIndex: "lastName",
      title: "Last Name",
      //render: (tag) => <Tag>{tag}</Tag>,
    },
    {
      dataIndex: "email",
      title: "Email",
    },
  ];

  const filterOption = (inputValue, option) =>
    option.description.indexOf(inputValue) > -1;

  const onChange = (targetKeys) => {
    let selectUserId = targetKeys.map((Tkey) => {
      let isData = mockData.filter((dt) => dt.key === Tkey);
      let userId = null;
      if (isData.length) userId = isData[0].id;
      return userId;
    });
    console.log("selectUserId", selectUserId);
    setSelectedUserId(selectUserId);
    setTargetKeys(targetKeys);
  };

  const handleSearch = (dir, value) => {
    console.log("search:", dir, value);
  };

  return (
    <TableTransfer
      dataSource={mockData}
      targetKeys={targetKeys}
      showSearch="true"
      onChange={onChange}
      filterOption={(inputValue, item) =>
        item.firstName.indexOf(inputValue) !== -1 ||
        item.lastName.indexOf(inputValue) !== -1
      }
      leftColumns={leftTableColumns}
      rightColumns={rightTableColumns}
      titles={["Learners List", "Learners to be added"]}
    />
  );
};

export default EnrollmentsAddSelectLearners;
