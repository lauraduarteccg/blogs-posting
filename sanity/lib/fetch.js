import "server-only";
import { draftMode } from "next/headers";
import { client } from "@/sanity/lib/client";

const DEFAULT_PARAMS = {};
const DEFAULT_TAGS = ["sanity"];

export const token = process.env.SANITY_API_READ_TOKEN;

export async function sanityFetch({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}) {
  const { isEnabled } = await draftMode();
  const isDraftMode = isEnabled;

  if (isDraftMode && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required."
    );
  }

  const isDevelopment = process.env.NODE_ENV === "development";

  return client
    .withConfig({
      useCdn: false, 
    })
    .fetch(query, params, {
      ...(isDraftMode && {
        token,
        perspective: "previewDrafts",
      }),
      next: {
        tags,
        revalidate: isDraftMode ? 30 : 3600,
      },
      cache: isDraftMode || isDevelopment ? "no-store" : "force-cache",
    });
}
