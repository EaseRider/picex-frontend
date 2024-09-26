import { IconButton, ImageListItemBar, useMediaQuery } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import DownloadIcon from "@mui/icons-material/Download";
import { useTheme } from "@emotion/react";
import { downloadImageJs } from "../services/api";

const downloadImage = (e, imgUrl, fileName, albumId) => {
  console.log(imgUrl);
  e.preventDefault();
  downloadImageJs(albumId, fileName);
}

const getImageUrl = (albumId, image) => `/api/files/${albumId}/${image.fileName}`

const ImageItem = ({ albumId, image }) => {
  const imgUrl = getImageUrl(albumId, image);
  return   <ImageListItem 
  sx={{
    //mb: 1,
    width: "100%",
    height: "auto",
  }}>
    <img
      srcSet={imgUrl}
      src={imgUrl}
      alt={image.uploaderName}
      loading="lazy"
    />
    <ImageListItemBar
      sx={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
      }}
      title={image.uploaderName}
      position="bottom"
      actionIcon={
        <IconButton
        onClick={(e) => downloadImage(e, imgUrl, image.fileName, albumId)}
        href={imgUrl}
        download
          color='primary'
          aria-label={`download ${image.uploaderName}`}
        >
          <DownloadIcon />
        </IconButton>
      }
      actionPosition="left"
    />
  </ImageListItem>
};

const getGaleryColumns = () => {
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isSM = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMD = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isLG = useMediaQuery(theme.breakpoints.up("lg"));
  //const isXL = useMediaQuery(theme.breakpoints.up("xl"));

  // *    xs: 0,
  // *    sm: 600,
  // *    md: 900,
  // *    lg: 1200,
  // *    xl: 1536,
  if (isXS) return 1;
  if (isSM) return 2;
  if (isMD) return 3;
  if (isLG) return 4;
  return 6;
};
export default function AlbumImages({ albumId, images }) {
  const columns = getGaleryColumns();
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('sm'));
  if (!images) {
    return <></>;
  }
  console.log("AlbumImages", albumId, images);
  return (
    <ImageList
    
      sx={{  width: 'auto', height: 450, transform: "translateZ(0)" }}
      gap={1}
      cols={columns}
    >
      {images.map((image) => (
        <ImageItem key={image.id} albumId={albumId} image={image} />
      ))}
    </ImageList>
  );
}
