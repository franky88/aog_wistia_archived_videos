"use client";

import React, { useState, useEffect } from "react";
import { GetPaginatedVideos } from "@/utils/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import VideoDetails from "./VideoDetails";
import { Button } from "../ui/button"; // ✅ needed for numeric buttons

const VideoList = () => {
  const [videos, setVideos] = useState<WistiaVideo[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await GetPaginatedVideos(page, limit);
      setVideos(response?.data || []);
      setTotal(response?.total || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  const nextPage = () => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  const goToPage = (pageNum: number) => {
    if (pageNum !== page) setPage(pageNum);
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold">Video list</h3>
          <Badge variant="outline" className="rounded-full h-7">
            {total} videos
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-[800px] mt-5 rounded-none bg-white text-slate-800">
        {loading && (
          <div className="p-6">
            <h3>Loading videos...</h3>
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="p-6 text-muted-foreground">No videos found.</div>
        )}

        {!loading &&
          videos.map((video) => (
            <VideoDetails
              key={video.HashedID}
              hashedId={video.HashedID}
              title={video.MediaName.EpisodeTitle}
              downloadLink={video.DownloadLink}
              fileSized={video.FilesizeMB}
            />
          ))}
      </div>

      {total > 0 && (
        <div className="w-full flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                />
              </PaginationItem>

              {getVisiblePages().map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <Button
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    className="rounded-md mx-1"
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  className={
                    page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default VideoList;
