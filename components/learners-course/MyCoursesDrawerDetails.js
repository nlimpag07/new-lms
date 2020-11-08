import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCourseList } from "../../providers/CourseProvider";
import { useAuth } from "../../providers/Auth";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

import {
  Layout,
  Row,
  Col,
  Button,
  Modal,
  Divider,
  Card,
  Avatar,
  Menu,
  Dropdown,
  Select,
  Input,
  Tooltip,
  Drawer,
  Rate,
  List,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CourseCircularUi from "../theme-layout/course-circular-ui/course-circular-ui";
import {
  EditOutlined,
  EllipsisOutlined,
  EyeOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
const { Meta } = Card;

const { Search } = Input;
const list = {
  visible: {
    opacity: 1,
    transition: {
      ease: "easeIn",
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      ease: "easeIn",
      duration: 0.5,
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};
const apiBaseUrl = process.env.apiBaseUrl;
const apidirectoryUrl = process.env.directoryUrl;
const token = Cookies.get("token");
const linkUrl = Cookies.get("usertype");

const MyCoursesDrawerDetails = ({
  mycourseDetails,
  setdrawerVisible,
  drawerVisible,
}) => {
  const router = useRouter();
  const { userDetails } = useAuth();
  const [reviewDetails, setReviewDetails] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  console.log("Course Details:", mycourseDetails);

  let {isApproved, startDate, endDate } = mycourseDetails;
  const learnerId = mycourseDetails.id;
  //Reassigning courseDetails
  var courseDetails = mycourseDetails.course;
  let {
    id,
    featureImage,
    featureVideo,
    courseLanguage,
    courseCategory,
    title,
    description,
    courseInstructor,
    courseOutline,
    courseType,
    courseLevel,
    courseTag,
    relatedCourse,
    learner,
  } = courseDetails;
  //console.log(learner);
  const listData = [
    {
      title: `${
        courseType &&
        courseType.map((type, index) => {
          return type.courseType.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "video"]} size="lg" />,
    },
    {
      title: `${courseDetails.durationTime} ${courseDetails.durationType}`,
      avatar: <FontAwesomeIcon icon={["far", "clock"]} size="lg" />,
    },

    {
      title: `${
        courseLanguage &&
        courseLanguage.map((lang, index) => {
          return lang.language.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "globe-americas"]} size="lg" />,
    },
    {
      title: `${courseDetails.passingGrade}% passing grade`,
      avatar: <FontAwesomeIcon icon={["fas", "chart-line"]} size="lg" />,
    },
    {
      title: `${
        courseLevel &&
        courseLevel.map((clevel, index) => {
          return clevel.level.name + " ";
        })
      }`,
      avatar: <FontAwesomeIcon icon={["fas", "star"]} size="lg" />,
    },
  ];

  useEffect(() => {
    if (learner.length) {
      let ratingArr = learner.map((l, index) => {
        let theRating = 0;
        if (l.courseRating != 0) theRating = l.courseRating;
        return theRating;
      });
      let totalLearners =
        ratingArr.length > 0 && ratingArr[0] > 0 ? ratingArr.length : 0;
      let sumRating =
        ratingArr.length > 0 && ratingArr[0] > 0
          ? ratingArr.reduce((a, b) => a + b, 0)
          : 0;
      setReviewDetails({
        average: sumRating > 0 ? sumRating / totalLearners : 0,
        learnersCount: totalLearners > 0 ? totalLearners : 0,
      });

      
    } else {
      setReviewDetails({
        average: 0,
        learnersCount: 0,
      });
      //setHasStarted(false);
    }

    //Check if Learner Already in progress
    if (startDate) {
      console.log(startDate)
      setHasStarted(true);
    } else {
      setHasStarted(false);
    }
    //console.log("Is on", isOnLearner);
  }, [drawerVisible]);

  function onStartOrContinueCourse(e) {
    e.preventDefault();

    console.log("onStartOrContinueCourse", id);
    //console.log("The text:", copyText);
    //if approved and has not started
    if (isApproved == 1) {
      //Check if the Learner has not started this course
      if (!startDate) {
        //Learner has not started the course
        //Update Enrollment  and set startDate then redirect to Outlines
        var config = {
          method: "put",
          url: apiBaseUrl + "/learner/StartCourse/" + learnerId,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "plain/text",
          },
          data: null,
        };
        async function fetchData(config) {
          try {
            const response = await axios(config);
            if (response) {
              //setOutcomeList(response.data.result);
              let theRes = response.data.response
              //console.log("Response", response.data);
              // wait for response if the verification is true              
              if(theRes){
                //true
                setdrawerVisible(false);
                //Redirect to Course Outline
                router.push(
                  `/${linkUrl}/my-courses/[courseId]/[outlines]`,
                  `/${linkUrl}/my-courses/${id}/learning-outlines`
                );
              }else{
                //false
                Modal.error({
                  title: "Error: Unable to Start Course",
                  content: response.data.message + " Please contact Technical Support",
                  centered: true,
                  width: 450,
                  onOk: () => {
                    //setdrawerVisible(false);
                    visible: false;
                  },
                });
              }
            }
          } catch (error) {
            const { response } = error;
            const { request, data } = response; // take everything but 'request'

            //console.log('Error Response',data.message);
            Modal.error({
              title: "Error: Unable to Start Course",
              content: data.message + " Please contact Technical Support",
              centered: true,
              width: 450,
              onOk: () => {
                //setdrawerVisible(false);
                visible: false;
              },
            });
          }
          //setLoading(false);
        }
        fetchData(config);


      } else {
        //The learner already started this course, just
        //directly redirect to course outline
        router.push(
          `/${linkUrl}/my-courses/[courseId]/[outlines]`,
          `/${linkUrl}/my-courses/${id}/learning-outlines`
        );
      }
    } else {
      Modal.info({
        title: "Notice: Enrollment Needs Approval",
        content: "Your enrollment to this course has yet to be approved.",
        centered: true,
        width: 450,
        onOk: () => {
          setdrawerVisible(false);
          visible: false;
        },
      });
    }
  }

  return (
    <Drawer
      title={title} /* {`${courseDetails != "" ? courseDetails.title : ""}`} */
      height={`60vh`}
      onClose={() => setdrawerVisible(false)}
      visible={drawerVisible}
      bodyStyle={{ paddingBottom: 0 }}
      placement={`bottom`}
      maskClosable={false}
      destroyOnClose={true}
      className="drawer-course-details"
    >
      <motion.div initial="hidden" animate="visible" variants={list}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} sm={24} md={18}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} sm={12} md={12}>
                <h1>About this course</h1>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <div className="star-rating">
                  <Rate
                    allowHalf
                    disabled
                    defaultValue={reviewDetails.average}
                  />{" "}
                  {reviewDetails.average} ({reviewDetails.learnersCount}{" "}
                  reviews)
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <div className="course-desc">
                  {/* <p>{`${
                    courseDetails != "" ? courseDetails.description : ""
                  }`}</p> */}
                  <p>
                    {decodeURI(description)}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum. Lorem ipsum dolor sit
                    amet, consectetur adipisicing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi
                    ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id
                    est laborum.
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <h2>Related Courses</h2>
                {relatedCourse && relatedCourse.length
                  ? relatedCourse.map((rltdCourse, index) => (
                      <Link
                        key={index}
                        href={`/${linkUrl}/course-catalogue/[...manage]`}
                        as={`/${linkUrl}/course-catalogue/view/${rltdCourse.courseRelated.course.id}`}
                      >
                        <a className="drawer-related-course">
                          {rltdCourse.courseRelated.course.title}
                        </a>
                      </Link>
                    ))
                  : "None"}
              </Col>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <div xs={24} className="drawerActionButtons">
              {hasStarted ? (
                <Button
                  type="primary"
                  shape="round"
                  size="large"                  
                  onClick={onStartOrContinueCourse}
                  /* onClick={() =>
                    router.push(
                      `/${linkUrl}/course-catalogue/[...manage]`,
                      `/${linkUrl}/course-catalogue/view/${id}`
                    )
                  } */
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  danger
                  onClick={onStartOrContinueCourse}
                >
                  Start Course
                </Button>
              )}
              <Button
                shape="round"
                size="large"
                onClick={() =>
                  router.push(
                    `/${linkUrl}/course-catalogue/[...manage]`,
                    `/${linkUrl}/course-catalogue/view/${id}`
                  )
                }
              >
                Course Details
              </Button>
            </div>
            <List
              itemLayout="horizontal"
              dataSource={listData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={item.avatar} title={item.title} />
                </List.Item>
              )}
            />
            <div className="Course-Tags">
              <h2>Tags</h2>
              {courseTag &&
                courseTag.map((tags, index) => (
                  <Button key={index} className="tag-button">
                    {tags.tag.name}
                  </Button>
                ))}
            </div>
          </Col>
        </Row>
      </motion.div>
      <style jsx global>{`
        .drawer-course-details .ant-drawer-title {
          font-size: 1.2rem;
        }
        .drawer-course-details .ant-drawer-content {
          background-color: #f9f9f9;
        }
        .drawer-course-details .ant-drawer-content h1,
        .drawer-course-details .ant-drawer-content h2 {
          color: #e69138;
        }
        .drawer-course-details .ant-drawer-content a.drawer-related-course {
          margin-right: 1rem;
        }
        .drawer-course-details .ant-drawer-content .course-desc {
          min-height: 150px;
        }
        .drawer-course-details .ant-drawer-content .course-desc p {
          font-size: 16px;
        }
        .star-rating {
          font-size: 1.2rem;
          text-align: right;
        }
        .star-rating .ant-rate {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        .star-rating .ant-rate-star:not(:last-child) {
          margin-right: 15px;
        }
        .drawer-course-details .ant-drawer-content .Course-Tags {
          margin-top: 2rem;
        }
        .drawer-course-details .ant-drawer-content .Course-Tags .tag-button {
          border-radius: 5px;
          border: 1px solid #333333;
          padding: 5px;
          margin-right: 15px;
          background-color: #ffffff;
        }
        .drawer-course-details .ant-drawer-content .drawerActionButtons {
          margin-bottom: 2rem;
        }
        .drawer-course-details .ant-drawer-content .drawerActionButtons button {
          margin-right: 1rem;
          font-size: 1rem;
        }
      `}</style>
    </Drawer>
  );
};

export default MyCoursesDrawerDetails;
