import { fetchApi } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";

export const meQueryOptions = queryOptions({
  queryKey: ["me"],
  retry: false,
  staleTime: 1000 * 60 * 5,
  queryFn: async () => {
    const response = await fetchApi.get("/auth/me");

    if (!response.ok) return null;

    return response.json();
  },
});

