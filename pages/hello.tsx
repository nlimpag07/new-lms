import React, {useState} from "react";
import MainThemeLayout from "../components/theme-layout/MainThemeLayout";
import Loader from "../components/theme-layout/loader/loader";


const Hello = () => {
  const [loading, setLoading] = useState(true);

  return (
    <MainThemeLayout>
      <div>HELLO</div>
      <Loader loading={loading}></Loader>
    </MainThemeLayout>
  );
};

export default Hello;
