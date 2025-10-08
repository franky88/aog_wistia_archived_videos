"use client";

import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

interface Video {
  name: string;
  filesize: number;
  downloadLink: string;
  filename: string;
  uploader: string;
  recentplay: string;
  uploaded: string;
}

const CardVideo: React.FC<Video> = ({
  name,
  filesize,
  downloadLink,
  filename,
  uploader,
  recentplay,
  uploaded,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      setProgress(0);

      const response = await fetch(downloadLink);
      if (!response.ok) throw new Error("Network error");

      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total) {
            setProgress(Math.round((received / total) * 100));
          }
        }
      }

      const blob = new Blob(chunks as unknown as BlobPart[], {
        type: "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <Card className="w-[800px] mb-5 shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            {name}
            <Button
              variant="outline"
              className="h-7"
              onClick={handleDownload}
              disabled={loading}
            >
              {loading ? `${progress}%` : <Download className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              className="rounded-lg h-20 bg-slate-200 p-5"
              src="/images/placeholder.jpg"
            />
            <AvatarFallback>VI</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-between w-full">
            <div className="flex flex-col">
              <small>File size: {filesize}MB</small>
              <small>Last played: {recentplay}</small>
            </div>
            <small className="text-muted-foreground">
              Date uploaded: {uploaded} | by: {uploader}
            </small>

            {loading && (
              <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
                <div
                  className="h-2 bg-blue-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardVideo;
