import type { Config } from "payload";

import type { AnalyticsPluginOptions } from "./types";

import { initEventsCollection } from "./collections/events";
import { initSessionsCollection } from "./collections/sessions";
import { EventsEndpoint } from "./endpoints/events-endpoint";
import { onInitExtension } from "./utils/onInitExtension";
import packageJSON from "../package.json";
// import { initConfigJobs, onInitCrons } from "./job-queues/init-jobs";

const packageName = packageJSON.name;

export const analyticsPlugin =
  (pluginOptions: AnalyticsPluginOptions = {}) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig };

    const safePluginOptions: Required<AnalyticsPluginOptions> = {
      collectionSlug: "analytics",
      dashboardSlug: "/analytics",
      dashboardLinkLabel: "Analytics",
      maxAgeInDays: 60,
      isServerless: true,
      ...pluginOptions,
    };

    const { dashboardSlug, dashboardLinkLabel, maxAgeInDays } =
      safePluginOptions;

    if (dashboardSlug.startsWith("/")) {
      safePluginOptions.dashboardSlug = dashboardSlug.replace(/^\//, "");
    }

    const eventsCollection = initEventsCollection(safePluginOptions);
    const sessionsCollection = initSessionsCollection(safePluginOptions);

    config.endpoints = [
      ...(config.endpoints || []),
      {
        path: "/events",
        method: "get",
        handler: EventsEndpoint(safePluginOptions).handler,
      },
    ];

    config.admin = {
      ...(config.admin || {}),

      // Add additional admin config here

      components: {
        ...(config.admin?.components || {}),

        /**
         * Since we use a semi-private pipeline, we need to dynamically add the package name to the path
         */
        views: {
          ...(config.admin?.components?.views || {}),
          analyticsDashboard: {
            Component: {
              exportName: "AnalyticsComponent",
              path: `${packageName}/rsc`,
              serverProps: {
                pluginOptions: safePluginOptions,
                maxAgeInDays,
              },
            },
            path: dashboardSlug,
          },
        },

        afterNavLinks: [
          ...(config.admin?.components?.afterNavLinks || []),
          {
            path: `${packageName}/rsc`,
            exportName: "AnalyticsNavLink",
            serverProps: {
              label: dashboardLinkLabel,
              href: `/admin/${dashboardSlug}`,
            },
          },
        ],
      },
    };

    // initConfigJobs(config, safePluginOptions);

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
      onInitExtension(safePluginOptions, payload);
      // await onInitCrons(safePluginOptions, payload);
    };

    return config;
  };
