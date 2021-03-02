import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Transfer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";

const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const EnrollmentsAddSelectLearners = ({
  course_id,
  courseDetails,
  hideModal,
}) => {
  const router = useRouter();
  const [targetKeys, setTargetKeys] = useState([]);
  const [mockData, setMockData] = useState([]);

  useEffect(() => {   

    const tKeys = [];
    const mData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        tKeys.push(data.key);
      }
      mData.push(data);
    }
    setMockData(mData);
    //setTargetKeys(tKeys);
  }, []);

  const filterOption = (inputValue, option) =>
    option.description.indexOf(inputValue) > -1;

  const handleChange = (targetKeys) => {
    //setTargetKeys(targetKeys);
    console.log("selectedKeys", targetKeys);
    setTargetKeys(targetKeys);
  };

  const handleSearch = (dir, value) => {
    console.log("search:", dir, value);
  };

  return (
    <Transfer
      dataSource={mockData}
      showSearch
      filterOption={filterOption}
      targetKeys={targetKeys}
      onChange={handleChange}
      onSearch={handleSearch}
      titles={["Learners List", "Learners to be added"]}
      render={(item) => item.title}
    />
  );
};

export default EnrollmentsAddSelectLearners;
