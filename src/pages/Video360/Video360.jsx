import React from "react";
import Video360RecentVideos from "./Video360RecentVideos";
import Video360Hero from "./Video360Hero";
import Video360How from "./Video360How";

function Video360() {

  return (
    <div>
      <Video360Hero />
      <Video360How />
      <Video360RecentVideos />
    </div>
  );
}

export default Video360;
