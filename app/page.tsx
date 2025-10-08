import SearchVideo from "@/components/videos/SearchVideo";
import { Suspense } from "react";
const PageRoot = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchVideo />
      </Suspense>
    </div>
  );
};

export default PageRoot;
