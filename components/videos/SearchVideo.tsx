"use client";

import { GetVideos } from "@/utils/api";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import CardVideo from "./CardVideo";
import BlankCard from "./BlankCard";
import Link from "next/link";
import { Separator } from "../ui/separator";

const SearchVideo = () => {
  const [videos, setVideos] = useState<WistiaVideo[]>([]);
  const [searchItems, setSearchItems] = useState<WistiaVideo[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await GetVideos();
      setVideos(response || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filteredVideos = videos.filter(
      (video) => video.HashedID.toLowerCase() === query
    );
    setSearchItems(filteredVideos);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 items-center justify-center mt-14">
        <div className="flex flex-col items-center justify-between">
          <div className="flex h-5 items-center space-x-4 mb-10">
            <Link className=" text-blue-300" href="/">
              <small>Home</small>
            </Link>
            <Separator orientation="vertical" />
            <Link className=" text-blue-300" href="/video">
              <small>Video list</small>
            </Link>
          </div>
          <strong className="ml-auto">AOG Archived Wistia Videos</strong>
        </div>

        <form className="w-[800px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search wistia video hashed ID..."
              name="search"
              className="w-full appearance-none bg-background pl-8 shadow-none"
              onChange={handleSearch}
            />
          </div>
        </form>

        {(searchItems.length > 0 ? searchItems : []).map((video) => (
          <CardVideo
            key={video.HashedID}
            name={video.MediaName.EpisodeTitle}
            filesize={video.FilesizeMB}
            downloadLink={video.DownloadLink}
            filename={`${video.MediaName.EpisodeTitle}.mp4`}
          />
        )) ?? <BlankCard></BlankCard>}
      </div>
    </div>
  );
};

export default SearchVideo;
