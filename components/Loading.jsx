import React from "react";
import { ChasingDots, CubeGrid } from "better-react-spinkit";

function Loading() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <h1 style={{ position: "absolute", top: "30%" }}>Loading...</h1>
      <CubeGrid size={60} />
    </div>
  );
}

export default Loading;
