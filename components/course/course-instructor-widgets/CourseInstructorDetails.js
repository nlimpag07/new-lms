import React, { Component, useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import axios from "axios";

import {
  Row,
  Modal,
  Card,
  Input,
  InputNumber,
  Form,
  Collapse,
  Select,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/**TextArea declaration */
const { Option } = Select;
const { TextArea } = Input;
/*formlabels used for modal */
const widgetFieldLabels = {
  catname: "Instructor - Details",
  catValueLabel: "instructordetails",
};

const apiBaseUrl = process.env.apiBaseUrl;
const token = Cookies.get("token");

const CourseInstructorDetails = (props) => {
  const {
    shouldUpdate,
    showModal,
    instructor,
    defaultWidgetValues,
    setdefaultWidgetValues,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { title, description, visibility, userGroupId } = instructor;
  const chosenRows = defaultWidgetValues.instructordetails;
  const [userGroupList, setUserGroupList] = useState([]);
  const [allInstructorsList, setAllInstructorsList] = useState([]);

  useEffect(() => {
    var config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };
    
    async function fetchData(config) {
      axios
        .all([
          axios.get(apiBaseUrl + "/Settings/usergroup", config),
          axios.get(apiBaseUrl + "/Users?userType=instructor", config),
        ])
        .then(
          axios.spread((usergroup, allInstructors) => {
            //console.log(competencies.data.response)
            !usergroup.data.response
              ? setUserGroupList(usergroup.data.result)
              : setUserGroupList([]);
            !allInstructors.data.response
              ? setAllInstructorsList(allInstructors.data.result)
              : setAllInstructorsList([]);
          })
        )
        .catch((errors) => {
          // react on errors.
          console.error(errors);
        });
      /* const response = await axios(config);
      if (response) {
        setUserGroupList(response.data.result);
        console.log(response.data.result);
      } else {
      } */
      //setLoading(false);
    }

    fetchData(config);
  }, []);
  /* console.log("Group List:", userGroupList);
  console.log("========================");
  console.log("Instructors List:", allInstructorsList); */
  const groupOptions = userGroupList.map((usergroup, index) => {
    return (
      <Option key={index} value={usergroup.id}>
        {usergroup.name}
      </Option>
    );
  });
  const instructorOptions = allInstructorsList.map((instructors, index) => {
    return (
      <Option key={index} value={instructors.id}>
        {instructors.firstName} {instructors.lastName}
      </Option>
    );
  });

  const onUserGroupChange = (value) => {
    console.log("Selected Value:", value);
  };

  return (
    <div className="instructorNoValue">
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
      >
        <Form.Item>
          <Form.Item
            name={["instructordetails", "userGroupId"]}
            label="User Group"
            noStyle
          >
            <Select
              placeholder="Select User Group"
              size="medium"
              onChange={onUserGroupChange}
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {groupOptions}
              {/* <Option value="1">Administrator</Option>
                <Option value="2">Human Resource</Option>
                <Option value="3">Manager</Option> */}
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Form.Item
            label="instructor"
            name={["instructordetails", "instructorId"]}
          >
            <Select
              placeholder="Select Instructor"
              size="medium"
              /* onChange={onUserGroupChange} */
              allowClear
              showSearch
              filterOption={(input, select) =>
                select.children.toLowerCase().indexOf(input.toLowerCase()) >=
                0
              }
            >
              {instructorOptions}
            </Select>
          </Form.Item>
        </Form.Item>
        <style jsx global>{`
          .course-instructor-details .ant-form-item {
            display: inline-block;
          }
          .course-instructor-details .ant-select-selector {
            font-weight: normal !important;
            text-transform: Capitalize !important;
          }
        `}</style>
      </Form.Item>
    </div>
  );
  /* return !chosenRows.length ? (
    <div className="instructorNoValue">
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}        
      >
        <Form.Item
          label="instructor Title"
          name={["instructordetails", "instructortitle"]}
        >
          <Input placeholder="instructor Title" />
        </Form.Item>
        <Form.Item>          
            <Form.Item
              name={["instructordetails", "usergroup"]}
              label="User Group"
              noStyle
            >
              <Select
                placeholder="User Group"
                size="medium"
              >
                <Option value="1">Administrator</Option>
                <Option value="2">Human Resource</Option>
                <Option value="3">Manager</Option>
              </Select>
            </Form.Item>
        </Form.Item>        

        <style jsx global>{`
          .course-instructor-details .ant-form-item {
            display: inline-block;
          }
          .course-instructor-details .ant-select-selector {
            font-weight: normal !important;
            text-transform: Capitalize !important;
          }
        `}</style>
      </Form.Item>
    </div>
  ) : (
    <div className="instructorWithValue">
      <Form.Item
        label={widgetFieldLabels.catname}
        noStyle
        allowClear
        shouldUpdate={shouldUpdate}
        
      >
        <Form.List name={widgetFieldLabels.catValueLabel}>
          {(fields, { add, remove }) => {
            return (
              <>
                {chosenRows.map((field, index) => {
                  field = {
                    ...field,
                    name: index,
                    key: index,
                  };
                  //console.log("Individual Fields:", field);
                  return (
                    <div key={field.key}>
                      <Form.Item
                        label="instructor Title"
                        name={[field.name, "instructortitle"]}
                        key={`${field.key}-title`}
                      >
                        <Input
                          placeholder={field.title}
                        />
                      </Form.Item>
                      <Form.Item>
                        
                          <Form.Item
                            name={[field.name, "usergroup"]}
                            label="User Group"
                            noStyle
                          >
                            <Select
                              placeholder={`${field.usergroup}`}
                              size="medium"
                            >
                              <Option value="1">Administrator</Option>
                              <Option value="2">Human Resource</Option>
                              <Option value="3">Manager</Option>
                            </Select>
                          </Form.Item>
                      </Form.Item>                      
                    </div>
                  );
                })}
              </>
            );
          }}
        </Form.List>
      </Form.Item>     
      <style jsx global>{`
        .course-instructor-details .ant-form-item {
          display: inline-block;
        }
        .course-instructor-details .ant-select-selector {
          font-weight: normal !important;
          text-transform: Capitalize !important;
        }
      `}</style>
    </div>
  ); */
};

export default CourseInstructorDetails;
