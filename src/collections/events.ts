import { CollectionConfig, CollectionSlug } from "payload";
import { AnalyticsPluginOptions } from "../types";
import { Dashboard, GetEvents, GetStats } from "../endpoints/events-endpoint";

export function initEventsCollection(
  pluginOptions: AnalyticsPluginOptions,
): CollectionConfig {
  const { collectionSlug: slug } = pluginOptions;
  return {
    slug: `${slug}-events`,

    endpoints: [
      GetEvents(pluginOptions),
      GetStats(pluginOptions),
      Dashboard(pluginOptions),
    ],
    admin: {
      hidden: true,
    },
    fields: [
      {
        name: "timestamp",
        type: "date",
        required: true,
        defaultValue: () => new Date(),
      },
      {
        name: "session_id",
        type: "relationship",
        relationTo: `${slug}-sessions` as CollectionSlug,
        required: true,
      },
      {
        name: "domain",
        type: "text",
        required: true,
      },
      {
        name: "path",
        type: "text",
        required: true,
      },
      {
        name: "query_params",
        type: "text",
      },
      {
        name: "referrer_url",
        type: "text",
      },
      {
        name: "ip_hash",
        type: "text",
        required: true,
      },
      {
        name: "user_agent",
        type: "text",
      },
      {
        name: "device_type",
        type: "select",
        options: ["desktop", "mobile", "tablet"],
      },
      {
        name: "os",
        type: "text",
      },
      {
        name: "browser",
        type: "text",
      },
      {
        name: "country",
        type: "text",
      },
    ],
  };
}
