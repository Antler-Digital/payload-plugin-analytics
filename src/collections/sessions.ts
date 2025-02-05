import { CollectionConfig } from "payload";
import { AnalyticsPluginOptions } from "../types";

export function initSessionsCollection({
  collectionSlug: slug,
}: AnalyticsPluginOptions): CollectionConfig {
  return {
    slug: `${slug}-sessions`,
    admin: {
      hidden: true,
    },
    fields: [
      {
        name: "ip_hash",
        type: "text",
        required: true,
      },
      {
        name: "domain",
        type: "text",
        required: true,
      },
      {
        name: "session_start",
        type: "date",
        required: true,
        defaultValue: () => new Date(),
      },
      {
        name: "session_end",
        type: "date",
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
      {
        name: "duration",
        type: "number",
      },
      {
        type: "group",
        name: "utm",
        fields: [
          {
            name: "source",
            type: "text",
          },
          {
            name: "medium",
            type: "text",
          },
          {
            name: "campaign",
            type: "text",
          },
          {
            name: "term",
            type: "text",
          },
          {
            name: "content",
            type: "text",
          },
        ],
      },
    ],
  };
}
