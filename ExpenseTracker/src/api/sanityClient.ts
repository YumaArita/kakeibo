import { createClient } from "@sanity/client";
import {
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_TOKEN,
  SANITY_API_VERSION,
} from "@env";

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: false,
  token: SANITY_TOKEN,
  apiVersion: SANITY_API_VERSION,
});

export default client;
