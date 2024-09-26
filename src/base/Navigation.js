import CollectionsIcon from "@mui/icons-material/Collections";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useExecLogout, useLoginUser } from "../services/queries";

const InternalEntry = ({ onClick, to, text, icon, deleteAction }) => {
  return (
    <ListItem
      secondaryAction={
        deleteAction && (
          <IconButton edge="end" aria-label="delete" onClick={deleteAction}>
            <DeleteIcon />
          </IconButton>
        )
      }
      disablePadding
    >
      <ListItemButton
        disabled={!onClick}
        onClick={onClick}
        component={Link}
        to={to}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

function KnownAlbums({ onClick }) {
  const { data } = useLoginUser();
  const knownAlbums = data?.knownAlbums ?? [];
  return (
    <>
      {knownAlbums.map((album) => (
        <InternalEntry
          key={album.albumId}
          onClick={onClick}
          to={"/album/" + album.albumId}
          text={album.name + (album.creatorName && " - " + album.creatorName)}
          icon={<CollectionsIcon />}
          deleteAction={() => deleteKnownAlbum(album.albumId)}
        />
      ))}
      {knownAlbums.length > 0 && <Divider sx={{ my: 1 }} />}
    </>
  );
}

export default function Navigation({ onClick }) {
  const { mutate: execLogout } = useExecLogout();

  const doLogout = () => {
    execLogout();
    onClick();
  };
  return (
    <>
      <InternalEntry
        onClick={onClick}
        to="/"
        text="New Album"
        icon={<CreateNewFolderIcon />}
      />
      <Divider sx={{ my: 1 }} />
      <KnownAlbums onClick={onClick} />
      <InternalEntry
        onClick={onClick}
        to="/about"
        text="About"
        icon={<InfoIcon />}
      />
      <InternalEntry
        onClick={doLogout}
        to="/"
        text="Logout"
        icon={<LogoutIcon />}
      />
    </>
  );
}
