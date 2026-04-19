import { useQuery } from "@tanstack/react-query";
import { getAutomations } from "../api/automations";

export function useAutomations() {
  return useQuery({
    queryKey: ["automations"],
    queryFn: getAutomations,
    staleTime: 5 * 60 * 1000,
  });
}
