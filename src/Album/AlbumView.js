import { Container } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useAlbum } from "../services/queries";
import AlbumImages from "./AlbumImages";
import AlbumUpload from "./AlbumUpload";
import { DownloadButtons } from "./DownloadButtons";

export default function AlbumView() {
  let { albumId } = useParams();
  const albumQuery = useAlbum(albumId);

  const { isFetched, data: album } = albumQuery;
  console.log("Fetching Album", albumQuery, album, albumId);

  if (!isFetched) {
    return <>Loading ...</>;
  }

  let { name, creatorName, uploads } = album;
  if (albumId != album.albumId) {
    uploads = [];
  }

  return (
    <div>
      <Container>
        <h2>
          {name} - {creatorName}
        </h2>
        <AlbumUpload albumId={albumId} />
        <AlbumImages albumId={albumId} images={uploads} />
        <DownloadButtons album={album} />
      </Container>
    </div>
  );
}
