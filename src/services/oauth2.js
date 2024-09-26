import { axiosInstance } from "./api";

export const logoutGoogleOauth2 = async () =>
  await axiosInstance.get("/cloud/google/logout");

export const doGoogleOauth2 = async () =>
  doOauth2("/oauth2/authorization/google");

const doOauth2 = async (url) => {
  const windowFeatures =
    "toolbar=no, menubar=no, width=600, height=750, top=100, left=100";
  const w = window.open(url, "_blank", windowFeatures);
  console.log("Opened", w);

  const oauthChecker = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject("timedout"), 120 * 1000);
    const checkLocation = () => {
      try {
        return w.location.href === window.location.origin + "/oauth2/success";
      } catch (e) {}
    };
    const periodicCheck = () => {
      console.log(
        "PeriodicCheck",
        w.location,
        window.location.origin + "/oauth2/success"
      );
      if (checkLocation()) {
        w.close();
        clearTimeout(timeout);
        resolve("Logged In");
        return;
      } else if (w.closed) {
        reject("userAborted");
        return;
      } else {
        setTimeout(periodicCheck, 500);
      }
    };
    console.log("gugus");
    return setTimeout(periodicCheck, 500);
  });
  console.log("Promise", oauthChecker);
  return oauthChecker;
};
