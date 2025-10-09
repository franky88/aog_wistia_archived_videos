"use client";

import { GetVideos } from "@/utils/api";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CardVideo from "./CardVideo";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

const SearchVideo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<WistiaVideo[]>([]);
  const [searchItems, setSearchItems] = useState<WistiaVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSearchVideos, setTotalSearchVideos] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      setCurrentPage(1);
      return;
    }

    const filteredVideos = videos.filter((video) => {
      return (
        video.HashedID.toLowerCase().includes(query) ||
        video.MediaName?.EpisodeTitle?.toLowerCase().includes(query) ||
        video.Uploader?.toLowerCase().includes(query)
      );
    });

    setSearchItems(filteredVideos);
    setTotalSearchVideos(filteredVideos.length);
    setCurrentPage(1);
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

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    } else {
      setSearchItems([]);
      setTotalSearchVideos(0);
    }
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchItems.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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
            placeholder="Search videos"
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

        <div className="flex items-center justify-center">
          {searchTerm ? (
            <small className="flex items-center gap-3 px-4 py-2 text-muted-foreground">
              <span>
                {totalSearchVideos} {totalSearchVideos > 1 ? "videos" : "video"}{" "}
                found for {searchTerm}
              </span>
            </small>
          ) : null}
        </div>

        <div className="mb-2 w-full">
          {currentItems.length > 0 ? (
            <>
              {currentItems.map((video) => (
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

              <div className="flex justify-center mt-5">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={handlePreviousPage}
                        className={
                          currentPage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      />
                    </PaginationItem>
                    <span className="px-4 py-2 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <PaginationItem>
                      <PaginationNext
                        onClick={handleNextPage}
                        className={
                          currentPage === totalPages
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            searchTerm && (
              <p className="text-muted-foreground text-sm text-center mt-10">
                No videos found.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchVideo;
