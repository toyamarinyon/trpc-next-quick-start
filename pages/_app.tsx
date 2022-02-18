import "../styles/globals.css";
import { AppType } from "next/dist/shared/lib/utils";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config() {
    return {
      url: "/api/trpc",
    };
  },
})(MyApp);
