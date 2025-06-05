import { useSearchParams } from "next/navigation";
import React from "react";

export function useCreateQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      // Create a copy of the current URL search parameters
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Iterate over the provided params and update the search parameters
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "" || value === undefined) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      // Return the updated search parameters as a string
      return newSearchParams.toString();
    },
    [searchParams], // Ensure the callback is updated when searchParams changes
  );

  return { createQueryString };
}