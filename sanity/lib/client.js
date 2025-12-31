import "server-only";
import { createClient } from "@sanity/client";
import { projectId, dataset, apiVersion, token } from "@/lib/sanity.api";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // importante para contenido siempre actualizado
  token,
});

export async function sanityFetch({
  query,
  qParams = {},
  tags = ["sanity"],
}) {
  return client.fetch(query, qParams, {
    cache: "force-cache",
    next: {
      tags,
      revalidate: 3600, // fallback si el webhook falla
    },
  });
}
