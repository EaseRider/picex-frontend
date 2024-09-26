import { Link } from "@mui/material";
import { useLoginUser, useLogoutGoogleOauth2 } from "../services/queries";

export default function About() {
  const { data: user } = useLoginUser();
  const logoutGoogle = useLogoutGoogleOauth2();

  let hasGoogle = user?.cloudConnections?.find((uc) => uc.cloudName == "google");
  
  return (
    <>
      <p>
        This App is created by Alexis Suter find me on Github:{" "}
        <Link
          href="https://github.com/EaseRider"
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/EaseRider
        </Link>
      </p>
      {hasGoogle && (
        <p>
          <Button
            onClick={logoutGoogle.mutate}
            disabled={!hasGoogle}
            variant="contained"
            color="error"
            startIcon={<GoogleIcon rotating={logoutGoogle.isPending} />}
          >
            Disconnect from Google
          </Button>
        </p>
      )}
    </>
  );
}
