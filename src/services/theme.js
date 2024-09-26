import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queries";

export const darkThemeName = "dark";
export const defaultThemeName = "default";
const storageName = "theme";

export const useThemeSwitch = () =>
  useMutation({
    mutationKey: ["theme"],
    mutationFn: async () => {
      const themeName = localStorage.getItem(storageName);
      let newTheme = undefined;
      switch (themeName) {
        case darkThemeName:
          newTheme = defaultThemeName;
          break;
        case defaultThemeName:
        default:
          newTheme = darkThemeName;
          break;
      }
      localStorage.setItem(storageName, newTheme);
      return ({ data: newTheme });
    },
    onSettled: () => queryClient.invalidateQueries(["theme"]),
  });

export const useTheme = () =>
  useQuery({
    queryKey: ["theme"],
    queryFn: () => {
      const currTheme = localStorage.getItem(storageName);
      if (!currTheme) {
        return defaultThemeName;
      }
      return currTheme;
    },
  });
