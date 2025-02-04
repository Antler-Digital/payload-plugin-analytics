import type { Config } from "payload";

import type { AnalyticsPluginOptions } from "./types";

import { initEventsCollection } from "./collections/events";
import { initSessionsCollection } from "./collections/sessions";
import { EventsEndpoint } from "./endpoints/events-endpoint";
import { onInitExtension } from "./utils/onInitExtension";

export const analyticsPlugin =
  (pluginOptions: AnalyticsPluginOptions = {}) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig };

    const eventsCollection = initEventsCollection(pluginOptions);
    const sessionsCollection = initSessionsCollection(pluginOptions);

    config.endpoints = [
      ...(config.endpoints || []),
      {
        path: "/events",
        method: "get",
        handler: EventsEndpoint(pluginOptions).handler,
      },
    ];

    config.admin = {
      ...(config.admin || {}),

      // Add additional admin config here

      components: {
        ...(config.admin?.components || {}),

        views: {
          ...(config.admin?.components?.views || {}),
          analyticsDashboard: {
            Component: {
              path: "@antler-payload-plugins/plugin-analytics",
              exportName: "AnalyticsDashboard",
            },
            path: `/analytics`,
          },
        },

        afterNavLinks: [
          ...(config.admin?.components?.afterNavLinks || []),
          {
            path: "@antler-payload-plugins/plugin-analytics",
            exportName: "AnalyticsNavLink",
          },
        ],
      },
    };

    config.collections = [
      ...(config.collections || []),
      eventsCollection,
      sessionsCollection,
    ];

    config.onInit = async (payload) => {
      if (incomingConfig.onInit) {
        await incomingConfig.onInit(payload);
      }
      // Add additional onInit code by using the onInitExtension function
      onInitExtension(pluginOptions, payload);
    };

    return config;
  };
