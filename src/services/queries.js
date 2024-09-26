import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  album,
  checkAuth,
  createAlbum,
  googleUpload,
  login,
  logout,
  uploadImage,
} from "./api";
import { doGoogleOauth2, logoutGoogleOauth2 } from "./oauth2";

export const queryClient = new QueryClient();

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login", "user"],
    mutationFn: login,
    onSuccess: (user) => queryClient.setQueryData(["user"], user),
  });
};

export const useLoginUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: checkAuth,
  });

const deleteCookie = (name) =>
  (document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT");

export const useExecLogout = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSettled: async () => {
      console.log("Settled Logout!");
      deleteCookie("JSESSIONID");
      await queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useAlbum = (albumId) =>
  useQuery({
    queryKey: ["album", albumId],
    queryFn: () => album(albumId),
  });

export const useCreateAlbum = () =>
  useMutation({
    mutationKey: ["album"],
    mutationFn: createAlbum,
    onSuccess: (album) =>
      queryClient.setQueryData(["album", album.albumId], album),
  });

export const useUploadeImage = (albumId) =>
  useMutation({
    mutationKey: ["image"],
    mutationFn: uploadImage,
    onSettled: () => queryClient.invalidateQueries(["album", albumId]),
  });

export const useGoogleUpload = (albumId) =>
  useMutation({
    mutationKey: ["googleupload", albumId],
    mutationFn: () => googleUpload(albumId),
    onError: () => queryClient.invalidateQueries(["user"]),
  });

export const useGoogleOauth2 = () =>
  useMutation({
    mutationKey: ["googleoauth2"],
    mutationFn: () => doGoogleOauth2(),
    onSettled: () => queryClient.invalidateQueries(["user"]),
  });
export const useLogoutGoogleOauth2 = () =>
  useMutation({
    mutationKey: ["googleoauth2logout"],
    mutationFn: () => logoutGoogleOauth2(),
    onSettled: () => queryClient.invalidateQueries(["user"]),
  });
