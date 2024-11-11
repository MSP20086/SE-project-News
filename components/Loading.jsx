"use client"

import { hatch } from 'ldrs'

const Loading = () => {
hatch.register()
  return (
    <div className="flex justify-center items-center h-screen">
        <l-hatch
        size="28"
        stroke="4"
        speed="3.5" 
        color="black" 
        ></l-hatch>
    </div>
  );
};

export default Loading;
