// @ts-nocheck
import { AnalyticsPluginOptions } from "../types";
import type { TaskConfig } from "payload";

export const initDeleteHistoryTask = (
  pluginOptions: Required<AnalyticsPluginOptions>,
): TaskConfig<string> => {
  const { collectionSlug, maxAgeInDays } = pluginOptions;
  return {
    slug: `${collectionSlug}_delete_history`,
    retries: {
      shouldRestore: false,
    },
    inputSchema: [],
    outputSchema: [],
    handler: async ({ req }) => {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - maxAgeInDays);
      daysAgo.setHours(0, 0, 0, 0);

      await req.payload.db.deleteMany({
        collection: `${collectionSlug}-events`,
        where: {
          date: {
            less_than: daysAgo,
          },
        },
      });

      await req.payload.db.deleteMany({
        collection: `${collectionSlug}-sessions`,
        where: {
          date: {
            less_than: daysAgo,
          },
        },
      });

      return {
        output: {},
      };
    },
  };
};
