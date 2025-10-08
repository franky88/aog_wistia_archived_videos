"use client";

import React, { useState, useEffect } from "react";
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
import { Download } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const VideoList = () => {
  const [videos, setVideos] = useState<WistiaVideo[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // 👈 make limit dynamic
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
  }, [page, limit]); // 👈 re-fetch when limit changes

  const nextPage = () => setPage((prevPage) => prevPage + 1);
  const prevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

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

      <div className="w-[800px] mt-5 border rounded-xl bg-white text-slate-800">
        <Table className="w-full rounded-x">
          <TableHeader>
            <TableRow>
              <TableHead>Media name</TableHead>
              <TableHead>Hashed ID</TableHead>
              <TableHead>File size</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading videos...</TableCell>
              </TableRow>
            ) : (
              videos.map((video) => (
                <TableRow key={video.HashedID}>
                  <TableCell>{video.MediaName.EpisodeTitle}</TableCell>
                  <TableCell>{video.HashedID}</TableCell>
                  <TableCell>{video.FilesizeMB} MB</TableCell>
                  <TableCell>
                    <a
                      href={`${video.DownloadLink}`}
                      download={`${video.MediaName.EpisodeTitle}.mp4`}
                    >
                      <Button variant="outline" className="h-7">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="w-full text-right">
        <Pagination className="mt-5 text-right">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={prevPage} isActive={page > 1}>
                Previous
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={nextPage}
                isActive={page * limit < total}
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default VideoList;
