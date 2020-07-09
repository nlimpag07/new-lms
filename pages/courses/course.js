import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Layout } from "antd";
import withAuth from "../../hocs/withAuth";
import MainThemeLayout from "../../components/MainThemeLayout";

const Course = (props) => {
  const [comments, setComments] = useState([]);

  async function getComments() {
    const res = await axios.get(
      `https://jsonplaceholder.typicode.com/comments?postId=${props.id}`
    );
    setComments(res.data);
  }

  useEffect(() => {
    getComments();
  }, []);

  //const { nposts } = pageProps;
  return (
    <MainThemeLayout>
      <Layout>
        <h1>Welcome to Courses!!! {props.id} </h1>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <Link
                href={`/courses/course?id=${comment.id}`} /* as={`/courses`} */
              >
                <a>{comment.body}</a>
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    </MainThemeLayout>
  );
};
Course.getInitialProps = async ({ query }) => {
  //console.log({query});
  /* const res = await axios.get(`https://jsonplaceholder.typicode.com/comments?postId=${query.id}` );
  const json = await res.json() */
  return query;
};
export default withAuth(Course);
