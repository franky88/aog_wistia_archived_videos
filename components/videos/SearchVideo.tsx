"use client";

import { GetVideos } from "@/utils/api";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CardVideo from "./CardVideo";
import { Badge } from "../ui/badge";

const SearchVideo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<WistiaVideo[]>([]);
  const [searchItems, setSearchItems] = useState<WistiaVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSearchVideos, setTotalSearchVideos] = useState(0);

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

  const handleSearch = (term?: string) => {
    const query = (term ?? searchTerm).toLowerCase().trim();

    if (!query) {
      setSearchItems([]);
      setTotalSearchVideos(0);
      return;
    }

    const filteredVideos = videos.filter((video) => {
      return (
        video.HashedID.toLowerCase().includes(query) ||
        video.MediaName?.EpisodeTitle?.toLowerCase().includes(query) ||
        video.Uploader?.toLowerCase().includes(query)
      );
    });

    if (filteredVideos.length > 0) {
      setSearchItems(filteredVideos);
      setTotalSearchVideos(filteredVideos.length);
    } else {
      setSearchItems([]);
      setTotalSearchVideos(0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const encoded = encodeURIComponent(searchTerm.trim());
    router.push(`?search=${encoded}`);
    handleSearch();
  };

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchTerm(query);
      handleSearch(query);
    } else {
      setSearchItems([]);
    }
  }, [searchParams, videos]);

  return (
    <div>
      <div className="flex flex-col gap-3 items-center justify-center mt-5">
        <form
          onSubmit={handleSubmit}
          className="w-[800px] relative flex items-center"
        >
          <Search className="absolute left-2.5 top-3 h-6 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search wistia videos"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-background pl-10 pr-28 rounded-xl shadow-none"
          />
          <Button
            type="submit"
            className="absolute right-2 top-2 h-8 px-4 rounded-lg"
          >
            Search
          </Button>
        </form>
        <div className="w-full flex items-start mt-3">
          <h3 className="text-lg font-bold items-center">
            {totalSearchVideos > 1 ? "Videos" : "Video"} found for{" "}
            {searchTerm ? <u>{searchTerm}</u> : "none"}{" "}
            {totalSearchVideos > 1 ? "are" : "is"}{" "}
            <Badge className="h-7 font-bold" variant={"outline"}>
              {totalSearchVideos}
            </Badge>
          </h3>
        </div>

        <div className="mt-5 w-[800px]">
          {searchItems.map((video) => (
            <CardVideo
              key={video.HashedID}
              name={video.MediaName.EpisodeTitle}
              filesize={video.FilesizeMB}
              downloadLink={video.DownloadLink}
              filename={`${video.MediaName.EpisodeTitle}.mp4`}
              uploader={video.Uploader}
              recentplay={video.MostRecentPlay}
              uploaded={video.CreatedAt.split(" ")[0]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchVideo;
