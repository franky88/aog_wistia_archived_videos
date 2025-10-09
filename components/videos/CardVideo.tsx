"use client";

import { Download } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
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
    <div className="w-full border px-1 rounded-xl bg-white mb-5 shadow-none">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex gap-4 text-slate-800">
            <Image
              src={"/images/placeholder.jpg"}
              width={150}
              height={150}
              alt="ph"
            />
            <div className="flex flex-col items-start justify-between w-full">
              <h3 className="font-bold">{name}</h3>
              <div className="flex flex-col">
                <small>File size: {filesize}MB</small>
                <small>Last played: {recentplay}</small>
              </div>
              <small className="text-muted-foreground">
                Date uploaded: {uploaded} | by: {uploader}
              </small>
            </div>
          </div>
          <Button
            variant="default"
            className="h-7"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? `${progress}%` : <Download className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="w-full h-1 bg-gray-200 rounded-lg">
          <div
            className="h-1 bg-blue-500 rounded-lg transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default CardVideo;
