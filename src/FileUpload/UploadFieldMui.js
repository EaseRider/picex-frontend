import UploadFileIcon from "@mui/icons-material/UploadFile";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";

/**
 *
 * @param {File} a
 * @param {File} b
 */
const isSameFile = (a, b) => {
  return (
    a.size === b.size && a.lastModified === b.lastModified && a.name === b.name
  );
};

const ImageItem = ({ image, id, removeFile }) => {
  const reader = new FileReader();
  const [src, setSrc] = useState(undefined);
  if (image.type.match("text")) {
    reader.readAsText(image);
  } else if (image.type.match("image")) {
    reader.readAsDataURL(image);
  }

  reader.onload = (e) => {
    setSrc(e.target.result);
  };

  return (
    <ImageListItem
      sx={{
        //mb: 1,
        width: "100%",
        height: "auto",
      }}
      key={id}
    >
      <img
        srcSet={src}
        src={src}
        alt={image.name}
        //loading="lazy"
      />
      <ImageListItemBar
        sx={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
            "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
        }}
        title={image.name}
        position="bottom"
        actionIcon={
          <IconButton
            onClick={() => removeFile(image)}
            color="primary"
            aria-label={`remove ${image.name}`}
          >
            <DeleteIcon />
          </IconButton>
        }
        actionPosition="right"
      />
    </ImageListItem>
  );
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
  if (isXS) return 2;
  if (isSM) return 3;
  if (isMD) return 4;
  if (isLG) return 5;
  return 6;
};

function UploadImages({ images, removeFile }) {
  const columns = getGaleryColumns();
  if (!images) {
    return <></>;
  }
  return (
    <ImageList
      sx={{
        width: "fit-content",
        //width: 500, height: 450,
        transform: "translateZ(0)",
      }}
      gap={3}
      cols={columns}
      rowHeight={164}
    >
      {images.map((image, index) => (
        <ImageItem image={image} key={index} id={index} removeFile={removeFile} />
      ))}
    </ImageList>
  );
}
const UploadButtons = ({ handleFileSelect, selectedSize, uploadFiles }) => {
  const uploadDisabled = selectedSize < 1;
  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        endIcon={<AttachFileIcon />}
      >
        Choose files
        <input type="file" multiple hidden onChange={handleFileSelect} />
      </Button>
      <Button
        disabled={uploadDisabled}
        component="label"
        variant="contained"
        color="secondary"
        endIcon={<UploadFileIcon />}
        onClick={uploadFiles}
      >
        Upload ({selectedSize}) files
      </Button>
    </>
  );
};

export default function UploadFieldMui({ uploadFileToServer }) {
  const [fileList, setFileList] = useState([]);

  const handleFileSelect = (e) => {
    let files = e.target.files || e.dataTransfer.files;

    files = Object.values(files);
    let newFileList = fileList.filter(
      (f) => !files.some((e) => isSameFile(f, e))
    );
    newFileList.push(...files);
    setFileList(newFileList);
  };
  const removeFile = (file) => {
    console.log('Remove', file);
    setFileList(fl => fl.filter((f) => f !== file));
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const index = fileList.indexOf(file);
      console.log(index, file, fileList);
      fileList[index].loading = true;
      setFileList(fileList);

      if (typeof file === "file" || !("size" in file)) {
        return reject(new Error("No file size"));
      }
      uploadFileToServer(file).then((data) => {
        resolve(data);
      });
    }).then(() => removeFile(file));
  };

  const uploadFiles = () => {
    fileList.forEach((file) => {
      uploadFile(file).then(() => {
        console.log('Done', file)
      });
    });
  };

  return (
    <Box
      sx={{
        //display: "flex",
        //flexWrap: "wrap",
        "& > :not(style)": {
          m: 0,
          // width: 128,
          //height: 128,
        },
      }}
    >
      <Box
        sx={{
          p: 0,
          "> *": {
            mb: 1,
            mr: 1,
          },
          //h: "auto",
        }}
      >
        <UploadButtons
          handleFileSelect={handleFileSelect}
          selectedSize={fileList.length}
          uploadFiles={uploadFiles}
        />
      </Box>
      <Paper
        elevation={1}
        sx={{
          width: "fit-content",
        }}
      >
        <UploadImages images={fileList} removeFile={removeFile} />
      </Paper>
    </Box>
  );
}
