"use client";

import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Image from "next/image";

interface VideoDetailsProps {
  hashedId: string;
  title: string;
  downloadLink: string;
  fileSized: number;
}

const VideoDetails = ({
  hashedId,
  title,
  downloadLink,
  fileSized,
}: VideoDetailsProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleDownload = async ({
    downloadLink,
    filename,
  }: {
    downloadLink: string;
    filename: string;
  }) => {
    try {
      setDownloadLoading(true);
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
      setDownloadLoading(false);
      setProgress(0);
    }
  };
  return (
    <div className="border hover:bg-slate-100/30 mb-1 rounded-lg">
      <div className="flex items-start justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div>
            <Image
              src={"/images/placeholder.jpg"}
              width={150}
              height={150}
              alt="ph"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold">{title}</h3>
            <small className="text-muted-foreground">
              Hashed ID: <strong>{hashedId.toUpperCase()}</strong>
            </small>
            <small className="text-muted-foreground">
              Size: {fileSized} MB
            </small>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            className="h-7"
            onClick={() =>
              handleDownload({
                downloadLink: downloadLink,
                filename: `${title}.mp4`,
              })
            }
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              `${progress}%`
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {downloadLoading && (
        <div className="w-full h-1 bg-gray-200 rounded-none">
          <div
            className="h-1 bg-blue-500 rounded-none transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default VideoDetails;
