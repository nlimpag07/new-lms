import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Breadcrumb } from "antd";
import { useRouter } from "next/router";

const BreadCrumbs = () => {
  const router = useRouter();
  var pathname = router.asPath.split("/");

  //console.log(pathname);
  //pathname = pathname.slice(1);
  pathname[0] == pathname[1] ? (pathname = pathname.slice(1)) : "";
  pathname = pathname.map((path, index) =>
    path == "" ? (
      <Breadcrumb.Item key={index}>
        <a href={`/`}>Home</a>
      </Breadcrumb.Item>
    ) : (
      <Breadcrumb.Item key={index}>
        <Link href={`/courses/[CourseId]`} as={`/courses/${path}`}>
          <a>{path}</a>
        </Link>
      </Breadcrumb.Item>
    )
  );
  return (
    <Breadcrumb style={{ margin: "16px 0" }} separator=">">
      {pathname}
      {/* <div className="breadcrumbs">
      <div>{pathname}</div>
      <style jsx>{`
        .breadcrumbs ul {
          list-style: none;
          padding: 0;
          display: inline-flex;
        }
        .breadcrumbs ul li {
          display: inline-block;
          width: 27%;
          text-align: center;
        }
        .breadcrumbs ul li a,
        .breadcrumbs ul li a:active,
        .breadcrumbs ul li a:focus,
        .breadcrumbs ul li a:visited {
          color: #ffffff;
          text-decoration: underline;
        }
        .breadcrumbs ul li a:hover {
          color: #fdb813;
        }
      `}</style>
    </div> */}
    </Breadcrumb>
  );
};

export default BreadCrumbs;
