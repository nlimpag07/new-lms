import React, { Component, useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import ReactDOM from "react-dom";
import { Row, Col, List, Avatar, Button, Skeleton, Rate } from "antd";
import Link from "next/link";

const count = 3;
const res = {
  results: [
    {
      gender: "female",
      name: { title: "Mrs", first: "Latife", last: "Beşok" },
      email: "latife.besok@example.com",
      nat: 2.5,
    },
    {
      gender: "female",
      name: { title: "Mrs", first: "Isabel", last: "Brown" },
      email: "isabel.brown@example.com",
      nat: 5,
    },
    {
      gender: "male",
      name: { title: "Monsieur", first: "Cyrill", last: "Muller" },
      email: "cyrill.muller@example.com",
      nat: 1,
    },
    {
      gender: "female",
      name: { title: "Mrs", first: "Madison", last: "Green" },
      email: "madison.green@example.com",
      nat: 4,
    },
    {
      gender: "male",
      name: { title: "Mr", first: "Ahmed", last: "Garvik" },
      email: "ahmed.garvik@example.com",
      nat: 1,
    },
    {
      gender: "male",
      name: { title: "Mr", first: "Ed", last: "Cox" },
      email: "ed.cox@example.com",
      nat: 2,
    },
    {
      gender: "female",
      name: { title: "Ms", first: "Caitlin", last: "Zhang" },
      email: "caitlin.zhang@example.com",
      nat: 3,
    },
    {
      gender: "female",
      name: { title: "Ms", first: "Elizabete", last: "da Mata" },
      email: "elizabete.damata@example.com",
      nat: 1,
    },
    {
      gender: "female",
      name: { title: "Ms", first: "Mandy", last: "Roberts" },
      email: "mandy.roberts@example.com",
      nat: 4,
    },
    {
      gender: "female",
      name: { title: "Miss", first: "Alejandra", last: "Lopez" },
      email: "alejandra.lopez@example.com",
      nat: 3,
    },
    {
      gender: "male",
      name: { title: "Mr", first: "Carsten", last: "Rehberg" },
      email: "carsten.rehberg@example.com",
      nat: 5,
    },
    {
      gender: "male",
      name: { title: "Mr", first: "Alexandre", last: "Addy" },
      email: "alexandre.addy@example.com",
      nat: 1,
    },
  ],
};

const CourseReviewViewWidget = ({ course_details }) => {
  /*  const {
    relatedCourse,
    courseCompetencies,
    courseInstructor,
  } = course_details;
  console.log(course_details);

  useEffect(() => {}, []); */

  //To be Removed in real data
  const theslice = res.results.slice(0, count);
  //console.log(theslice)
  //END REMOVE
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([""]);
  const [list, setList] = useState(theslice);

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={OnLoadMore}>loading more</Button>
      </div>
    ) : null;

  useEffect(() => {
    console.log(theslice);
    setInitLoading(false);
    setData(theslice);
    setList(theslice);
    /* GetData(res => {
      console.log(theslice)
      setInitLoading(false);
      setData(theslice);
      setList(theslice);
    }); */
  }, [list]);
  //https://codesandbox.io/s/3z8tf?file=/index.js
  const GetData = (callback) => {
    return res;
    /* reqwest({
      url: fakeDataUrl,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: (res) => {
        callback(res);
      },
    }); */
  };

  const OnLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(count)].map(() => ({ loading: true, name: {} }))
      )
    );

    GetData((res) => {
      const data = data.concat(res.results);
      setData(data);
      setList(data);
      setLoading(false, () => {
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event("resize"));
      });
    });
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
                  <span style={{fontWeight:"700"}}>{item.nat}/5</span>,
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
                    title={<a href="https://ant.design">{item.name.last}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                  />
                  <div>
                    <Rate allowHalf disabled defaultValue={item.nat} />
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
