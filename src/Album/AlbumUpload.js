import React from "react";
import UploadFieldMui from "../FileUpload/UploadFieldMui";
import { useUploadeImage } from "../services/queries";

export default function AlbumUpload({ albumId }) {
  const upload = useUploadeImage(albumId);
  const uploadFileToServer = file => upload.mutateAsync({albumId, file});
  
  return (
    <>
      <UploadFieldMui uploadFileToServer={uploadFileToServer} />
    </>
  );
}
