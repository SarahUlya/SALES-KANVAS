import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MutasiBatch } from "../types/mutasiBatch.types";

const URL = "/mutasi-batch";
const KEY = ["mutasi-batch"];

export function useMutasiBatch() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => api<MutasiBatch[]>(URL),
  });
}
