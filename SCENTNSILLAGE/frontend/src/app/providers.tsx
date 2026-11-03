import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/app/store";
import { queryClient } from "@/app/queryClient";
import { AuthBootstrap } from "@/features/auth/components/AuthBootstrap";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>{children}</AuthBootstrap>
      </QueryClientProvider>
    </Provider>
  );
}
