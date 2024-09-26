import axios from "axios";
// to simulate slow requests add this before fetch:
// (await new Promise((resolve) => setTimeout(resolve, 5000))) ||
export const axiosInstance = axios.create({ baseURL: "/api" });

/** AUTH */
export const login = async (loginRequest) =>
  (await axiosInstance.post("/auth/simple_signup", loginRequest)).data;

export const checkAuth = async () =>
  (
    await axiosInstance.get("/auth/checkauth", {
      validateStatus: (status) => [200, 400].includes(status),
    })
  ).data;

export const logout = async () => await axiosInstance.get("/logout");

/** ALBUM */
export const album = async (id) =>
  (await axiosInstance.get(`/album/${id}`)).data;

export const createAlbum = async (albumRequest) =>
  (await new Promise((resolve) => setTimeout(resolve, 2000))) ||
  (await axiosInstance.post(`/album`, albumRequest)).data;

/** CLOUD */
export const googleUpload = async (albumId) =>
  await axiosInstance.get(`/cloud/google/${albumId}`);

/** IMAGE UPLOAD */
export const uploadImage = async ({albumId, file}) => {
  console.log("Uploading", albumId, file);
  let formData = new FormData();
  formData.append("file", file);
  return (
    (await new Promise((resolve) => setTimeout(resolve, 2000))) ||
    (await axiosInstance.post(`/files/${albumId}`, formData))
  );
};

/** IMAGE DL */
export const downloadImageJs = async (albumId, fileName) =>
  await axiosInstance
    .get(`/files/${albumId}/${fileName}`, { responseType: "arraybuffer" })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    });
