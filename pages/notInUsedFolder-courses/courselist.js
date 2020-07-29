import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout } from "antd";

import MainThemeLayout from "../../components/theme-layout/MainThemeLayout";
import withAuth from "../../hocs/withAuth";

const CourseList = (props) => {
  const [posts, setPosts] = useState(props.posts);

  async function getPosts() {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    setPosts(res.data);
  }
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <MainThemeLayout>
      <Layout>
        <h1>Welcome to the Course List!!! </h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/courses/[courseId]`} as={`/courses/${post.id}`}>
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    </MainThemeLayout>
  );
};
CourseList.getInitialProps = async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  const { data } = res;
  //console.log("Loading in server for Courses");
  return { posts: data };
};
export default withAuth(CourseList);
