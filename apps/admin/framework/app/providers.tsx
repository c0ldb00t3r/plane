"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { InstanceProvider } from "../../app/(all)/instance.provider";
import { StoreProvider } from "../../app/(all)/store.provider";
import { ToastWithTheme } from "../../app/(all)/toast";
import { UserProvider } from "../../app/(all)/user.provider";

const DEFAULT_SWR_CONFIG = {
  refreshWhenHidden: false,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnMount: true,
  refreshInterval: 600_000,
  errorRetryCount: 3,
};

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider themes={["light", "dark"]} defaultTheme="system" enableSystem>
      <ToastWithTheme />
      <SWRConfig value={DEFAULT_SWR_CONFIG}>
        <StoreProvider>
          <InstanceProvider>
            <UserProvider>{children}</UserProvider>
          </InstanceProvider>
        </StoreProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
