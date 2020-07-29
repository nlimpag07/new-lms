import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout } from "antd";
import withAuth from "../../hocs/withAuth";
import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import { useRouter } from "next/router";
const Course = (props) => {
  const router = useRouter();
  const { courseId } = router.query;
  console.log(router.query);
  const [comments, setComments] = useState([]);

  async function getComments(id) {
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/comments?postId=${id}`
    );
    setComments(res.data);
    console.log(res.data);
  }

  useEffect(() => {
    getComments(courseId);
  }, []);

  return (
    <MainThemeLayout>
      <Layout>
        <h1>Welcome to Course #{courseId}  </h1>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div>
                <p>{comment.name}</p>
                <p>{comment.body}</p>
                <p>by: {comment.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </Layout>
    </MainThemeLayout>
  );
};

export default withAuth(Course);
