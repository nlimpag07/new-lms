import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout } from "antd";

import MainThemeLayout from "../../components/MainThemeLayout";
import withAuth from "../../hocs/withAuth";

const Dashboard = (props) => {
  const [posts, setPosts] = useState(props.posts);

  async function getPosts() {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    setPosts(res.data);
  }
  useEffect(() => {
    getPosts();
  }, []);

  //const { nposts } = pageProps;
  return (
    <MainThemeLayout>
      <Layout>
        <h1>Welcome to the dashboard!!! </h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/courses/course?id=${post.id}`} /* as={`/courses`} */
              >
                <a>{post.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    </MainThemeLayout>
  );
};
Dashboard.getInitialProps = async () => {

  const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  const { data } = res;
  return { posts: data };
};
export default withAuth(Dashboard);
