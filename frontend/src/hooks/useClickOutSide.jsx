import { useEffect, useRef } from "react";

function useClickOutSide(action) {
  const nodRef = useRef();
  const handleClick = (e) => {
    if (nodRef.current && !nodRef.current.contains(e.target)) {
      action();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return nodRef;
}

export default useClickOutSide;
