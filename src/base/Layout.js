import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Link,
  List,
  Paper,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import React, { useState } from "react";
import Navigation from "./Navigation";
import { useLoginUser } from "../services/queries";
import { useTheme, useThemeSwitch } from "../services/theme";

const defaultTheme = createTheme();
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const defaultDarkMode = true;

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://picex.wg1.ch">
        PicEx, Alexis Suter
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function getTheme(themeName) {
  switch (themeName) {
    case "dark":
      return darkTheme;
    case "default":
    default:
      return defaultTheme;
  }
}
function AppNavbar() {
  const { isFetched, data: user } = useLoginUser();
  
  const {data: themeName} = useTheme();
  const {mutate: switchTheme} = useThemeSwitch();

  const [menuOpen, setMenuOpen] = useState(false);

  const username = !isFetched ? '...' : user ? user.name : '-';

  const toggleDrawer = () => {
    setMenuOpen(!menuOpen);
  };
  const nav = <Navigation onClick={toggleDrawer} />;
  return (
    <>
      <AppBar position="absolute" open={menuOpen}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "10px",
              //...(menuOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            PicEx
          </Typography>
          {username}
          <IconButton
            color="inherit"
            onClick={switchTheme}
          >
            <DarkModeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={menuOpen} onClose={toggleDrawer}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
{nav}
          {/* <Navigation onClick={toggleDrawer} /> */}
        </List>
      </Drawer>
    </>
  );
}

export default function Layout({ Content }) {
  const {data: themeName} = useTheme();
  const theme = getTheme(themeName);
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppNavbar />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ml: 0 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {Content}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
