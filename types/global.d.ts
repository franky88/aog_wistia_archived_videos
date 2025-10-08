interface MediaName {
  EpisodeTitle: string;
}

interface Project {
  ChannelName: string;
}

interface WistiaVideo {
  MediaName: MediaName;
  Project: Project;
  HashedID: string;
  MediaType: string;
  MediaLink: string;
  CreatedAt: string;
  MostRecentPlay: string;
  TotalPlays: number;
  DownloadLink: string;
  FilesizeMB: number;
  DurationSec: number;
  Uploader: string;
  Archived?: boolean;
  filename: string;
}

interface Video {
  data: WistiaVideo[];
  total: number;
}

// interface WistiaVideo {
//     videos: Video;
// }
