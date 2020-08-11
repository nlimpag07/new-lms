import React, { Component, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ReactDOM from "react-dom";
import { Row, Col, List } from "antd";
import Link from "next/link";

const CourseCompetenciesviewWidget = ({ course_details }) => {
  /* var [courseId, setCourseId] = useState(course_id);
  const homeUrl = process.env.homeUrl;
  const { courseAllList } = useCourseList();
  const [course, setCourse] = useState("");
  const [modal2Visible, setModal2Visible] = useState("");
  var courseData = ""; */
  const { relatedCourse, courseCompetencies, courseInstructor } = course_details;
  console.log(course_details);

  useEffect(() => {}, []);



  const listData = [
    {
      title: <button>Competency 1</button>,
      avatar: <FontAwesomeIcon icon={["fas", "video"]} size="3x" />,
      description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    {
      title: <button>Competency 2</button>,
      avatar: <FontAwesomeIcon icon={["far", "list-alt"]} size="3x" />,
      description:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      title: <button>Competency 3</button>,
      avatar: <FontAwesomeIcon icon={["far", "clock"]} size="3x" />,
      description:"ullamco laboris nisi ut aliquip ex ea commodo consequat elit",
    },
    {
      title: <button>Competency 4</button>,
      avatar: <FontAwesomeIcon icon={["far", "keyboard"]} size="3x" />,
      description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit",
    },
    
  ];
  /* const listData = [
    {
      title: `${
        courseCompetencies &&
        courseCompetencies.map((competency, index) => {
          return competency.courseType.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "video"]} size="3x" />,
    },
    {
      title: `${lessons} Lessons`,
      avatar: <FontAwesomeIcon icon={["far", "list-alt"]} size="3x" />,
    },
    {
      title: `${courseDetails.durationTime} ${courseDetails.durationType}`,
      avatar: <FontAwesomeIcon icon={["far", "clock"]} size="3x" />,
    },
    {
      title: `${
        courseCategory &&
        courseCategory.map((ctgry, index) => {
          return ctgry.category.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["far", "keyboard"]} size="3x" />,
    },
    {
      title: `${
        courseLanguage &&
        courseLanguage.map((lang, index) => {
          return lang.language.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "globe-americas"]} size="3x" />,
    },
    {
      title: `${courseDetails.passingGrade}% passing grade`,
      avatar: <FontAwesomeIcon icon={["fas", "chart-line"]} size="3x" />,
    },
    {
      title: `${
        courseLevel &&
        courseLevel.map((clevel, index) => {
          return clevel.level.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "star"]} size="3x" />,
    },
  ]; */


  return (
    <div className="tab-content">
      <Row className="Course-Tags">
        <Col xs={24}>
          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta avatar={item.avatar} title={item.title} description={item.description} />
              </List.Item>
            )}
          />
        </Col>
      </Row>      

      <style jsx global>{``}</style>
    </div>
  );
};

export default CourseCompetenciesviewWidget;
