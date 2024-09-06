"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState, useEffect } from "react";
import { GetPaginatedVideos } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";

const VideoList = () => {
  const [videos, setVideos] = useState<WistiaVideo[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchVideos = async () => {
    try {
      const response = await GetPaginatedVideos(page, limit);
      setVideos(response || []);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [page]);

  const nextPage = () => setPage((prevPage) => prevPage + 1);
  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <div className="mx-auto flex flex-col w-[800px] items-center justify-center mt-5">
      <Card className="w-[800px]">
        <CardHeader>
          <CardTitle>Video list</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Media name</TableHead>
                <TableHead>File size</TableHead>
                <TableHead>Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.HashedID}>
                  <TableCell>{video.MediaName.EpisodeTitle}</TableCell>
                  <TableCell>{video.FilesizeMB} MB</TableCell>
                  <TableCell>
                    <a
                      href={`${video.DownloadLink}`}
                      download={`${video.MediaName.EpisodeTitle}.mp4`}
                    >
                      <Button variant="outline" className="h-7">
                        Download
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={prevPage}
              isActive={page === 1 ? false : true}
            >
              Previous
            </PaginationPrevious>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={nextPage}
              isActive={page >= 1 ? true : false}
            >
              Next
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default VideoList;
