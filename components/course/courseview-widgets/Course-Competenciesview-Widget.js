import React, { Component, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../../components/theme-layout/loader/loader";

import ReactDOM from "react-dom";
import { Row, Col, List, Empty } from "antd";
import Link from "next/link";

const CourseCompetenciesviewWidget = ({ course_competencies }) => {
  const [loading, setLoading] = useState(true);
  console.log(course_competencies);
  const listData = course_competencies
    ? course_competencies.result.map((competency, index) => ({
        title: <button>{competency.title}</button>,
        avatar: <FontAwesomeIcon icon={["fas", "video"]} size="3x" />,
        description: `${competency.description}`,
      }))
    : null;
  useEffect(() => {
    //setListData();
    setLoading(false);
  }, []);

  return listData ? (
    <div className="tab-content">
      <Row className="Course-Tags">
        <Col xs={24}>
          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.avatar}
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>

      <style jsx global>{``}</style>
    </div>
  ) : (
    <Loader loading={loading}>
      <Empty style={{ marginTop: "1rem" }} />
    </Loader>
  );
};

export default CourseCompetenciesviewWidget;
