import VideoList from "@/components/videos/VideoList";
import SearchVideo from "@/components/videos/SearchVideo";
import { Suspense } from "react";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchVideo />
      </Suspense>
      <VideoList />
    </div>
  );
};

export default Page;
