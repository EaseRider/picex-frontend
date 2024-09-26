import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAlbum, useLoginUser } from "../services/queries";

export default function AlbumCreate() {
  const navigate = useNavigate();

  const { data: user } = useLoginUser();
  const createAlbum = useCreateAlbum();

  const [creatorName, setCreatorName] = useState(user.name);
  const [name, setName] = useState("");
  const [termsApproval, setTermsApproval] = useState(false);

  const doSubmit = () => {
    let album = { name, creatorName };
    createAlbum.mutate(album, {
      onSuccess: (album) => navigate(`/album/${album.albumId}`),
    });
  };

  return (
    <Box
      onSubmit={doSubmit}
      disabled={createAlbum.isPending}
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        "& .MuiFormControlLabel-root": { m: 1 },
        "& .MuiButtonBase-root": { m: 1 },
      }}
    >
      <TextField
        id="creatorName"
        value={creatorName || ""}
        label="Your name"
        onChange={(e) => setCreatorName(e.target.value)}
        variant="outlined"
        autoComplete="creatorName"
        disabled
      />
      <TextField
        id="name"
        value={name || ""}
        label="Album name"
        onChange={(e) => setName(e.target.value)}
        variant="outlined"
        autoComplete="albumName"
        disabled={createAlbum.isPending}
      />
      <FormControlLabel
        control={<Checkbox />}
        value={termsApproval}
        onChange={() => setTermsApproval(!termsApproval)}
        disabled={createAlbum.isPending}
        label="Accept terms"
      />
      <Button
        variant="outlined"
        disabled={!termsApproval || createAlbum.isPending}
        onClick={doSubmit}
      >
        Create
      </Button>
    </Box>
  );
}
