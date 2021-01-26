import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";

export const ViewPortContext = createContext({
  vs: null,
  viewport: null,
  setViewPort: () => {},
});

export const ViewPortProvider = ({ children, vp }) => {
  let vpValue = null;
  vp == "xs" || vp == "sm" || vp == "md"
    ? (vpValue = "mobile")
    : (vpValue = "desktop");

  let [viewport, setViewPort] = useState(vpValue);
  useEffect(() => {
    setViewPort(vpValue);
  }, [vp]);
  return (
    <ViewPortContext.Provider value={{ vp, viewport, setViewPort }}>
      {children}
    </ViewPortContext.Provider>
  );
};

export function useViewPort() {
  const context = useContext(ViewPortContext);
  if (context === undefined) {
    throw new Error("useViewPort must be used within an ViewPortProvider");
  }
  return context;
}
