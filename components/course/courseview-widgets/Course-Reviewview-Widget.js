import React, { Component, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import ReactDOM from "react-dom";
import { Row, Col, List, Avatar, Button, Skeleton, Rate } from "antd";
import Link from "next/link";
import axios from "axios";

const apiBaseUrl = process.env.apiBaseUrl;
/* const res = 
const theslice = res.results.slice(0, 5); */
const CourseReviewViewWidget = ({ course_id, course_reviews }) => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [list, setList] = useState("");
  const [count, setCount] = useState(5);
  const loadMore =
    !initLoading && !loading && data.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={() => OnLoadMore()}>loading more</Button>
      </div>
    ) : null;

  useEffect(() => {
    /* console.log(theslice);
    setInitLoading(false);
    setData(theslice);
    setList(theslice); */
    GetData((res) => {
      let getThree = res.slice(0, count);
      console.log(res);
      setInitLoading(false);
      setData(res);
      setList(getThree);
    });
  }, []);

  //https://codesandbox.io/s/3z8tf?file=/index.js
  const GetData = (callback) => {
    /* axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((result) => {
        var res = result.data;
        callback(res);
        //console.log(res);
      })
      .catch(function (error) {
        // handle error
        console.log(error.response.data);
      }); */

    var enrollees = [];
    if (course_reviews) {
      const tdata = course_reviews.result.map((dataItem) => {
        //console.log("tdata", dataItem);
        dataItem.learner.map((item) => {
          if (item.courseId == course_id) {
            dataItem["courseRating"] = item.courseRating;
            dataItem["courseReview"] = item.courseReview;
            enrollees.push(dataItem);
          }
        });
        //console.log("tdata", dataItem);
      });
    }
    callback(enrollees);
  };

  const OnLoadMore = () => {
    setLoading(true);
    let currCount = count;
    let getThree = data.slice(0, currCount + 5);
    setCount(currCount + 3);
    setList(getThree);
  };
  return (
    <div className="tab-content">
      <Row className="Course-Enrollments">
        <Col xs={24}>
          <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <span style={{ fontWeight: "700" }}>
                    {item.courseRating}/5
                  </span>,
                ]}
              >
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={64}
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      />
                    }
                    title={<span>{item.firstName + " " + item.lastName}</span>}
                    description={
                      item.courseReview
                        ? item.courseReview
                        : "No review message"
                    }
                  />
                  <div>
                    <Rate allowHalf disabled defaultValue={item.courseRating} />
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
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

export default CourseReviewViewWidget;
