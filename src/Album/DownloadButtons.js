import DownloadIcon from "@mui/icons-material/Download";
import { Button } from "@mui/material";
import React from "react";
import GoogleIcon from "../other/GoogleIcon";
import {
  useLoginUser,
  useGoogleOauth2,
  useGoogleUpload,
  useLogoutGoogleOauth2,
} from "../services/queries";

export function DownloadButtons({ album }) {
  let { albumId } = album;
  const googleUpload = useGoogleUpload(albumId);
  const { data: user } = useLoginUser();
  const googleOauth2 = useGoogleOauth2();

  let hasGoogle = user?.cloudConnections.find((uc) => uc.cloudName == "google");
  console.log("User", user);

  const downloadAllUrl = `/api/files/${albumId}/all`;

  return (
    <>
      <Button
        href={downloadAllUrl}
        download
        variant="contained"
        startIcon={<DownloadIcon />}
      >
        Download all
      </Button>
      <br />
      {hasGoogle && (
        <Button
          onClick={googleUpload.mutate}
          disabled={!hasGoogle || googleUpload.isPending}
          variant="contained"
          startIcon={<GoogleIcon rotating={googleUpload.isPending} />}
        >
          Upload to Google Photos
        </Button>
      )}
      {!hasGoogle && (
        <Button
          onClick={googleOauth2.mutate}
          disabled={hasGoogle || googleOauth2.isPending}
          variant="contained"
          startIcon={<GoogleIcon rotating={googleOauth2.isPending} />}
        >
          Connect to Google
        </Button>
      )}
    </>
  );
}
