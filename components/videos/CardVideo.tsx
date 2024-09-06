import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface Video {
  name: string;
  filesize: number;
  downloadLink: string;
  filename: string;
}

const CardVideo: React.FC<Video> = ({
  name,
  filesize,
  downloadLink,
  filename,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage
              className="rounded-sm bg-slate-200 p-5"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbG0iPjxyZWN0IHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgeD0iMyIgeT0iMyIgcng9IjIiLz48cGF0aCBkPSJNNyAzdjE4Ii8+PHBhdGggZD0iTTMgNy41aDQiLz48cGF0aCBkPSJNMyAxMmgxOCIvPjxwYXRoIGQ9Ik0zIDE2LjVoNCIvPjxwYXRoIGQ9Ik0xNyAzdjE4Ii8+PHBhdGggZD0iTTE3IDcuNWg0Ii8+PHBhdGggZD0iTTE3IDE2LjVoNCIvPjwvc3ZnPg=="
            />
            <AvatarFallback>VI</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-4">
            <small>File size: {filesize}MB</small>
            <a href={downloadLink} download={filename}>
              <Button variant="outline" className="h-7">
                Download
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardVideo;
