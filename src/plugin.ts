import type { Config, PayloadRequest } from "payload";

import type { AnalyticsPluginOptions } from "./types";

import { initEventsCollection } from "./collections/events";
import { initSessionsCollection } from "./collections/sessions";
import { EventsEndpoint } from "./endpoints/events-endpoint";
import { onInitExtension } from "./utils/onInitExtension";
import { initDeleteHistoryTask } from "./job-queues/delete-history-task";
import { initConfigJobs } from "./job-queues/init-jobs";

export const analyticsPlugin =
  (pluginOptions: AnalyticsPluginOptions = {}) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig };

    const safePluginOptions: Required<AnalyticsPluginOptions> = {
      collectionSlug: "analytics",
      dashboardSlug: "/analytics",
      dashboardLinkLabel: "Analytics",
      maxAgeInDays: 30,
      isServerless: true,
      ...pluginOptions,
    };

    if (!safePluginOptions.dashboardSlug?.startsWith("/")) {
      throw new Error("dashboardSlug must start with '/'");
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

        views: {
          ...(config.admin?.components?.views || {}),
          analyticsDashboard: {
            Component: {
              exportName: "AnalyticsComponent",
              path: "@antler-payload-plugins/plugin-analytics/rsc#AnalyticsComponent",
            },
            path: safePluginOptions.dashboardSlug,
          },
        },

        afterNavLinks: [
          ...(config.admin?.components?.afterNavLinks || []),
          {
            path: "@antler-payload-plugins/plugin-analytics/rsc#AnalyticsNavLink",
            exportName: "AnalyticsNavLink",
            serverProps: {
              label: safePluginOptions.dashboardLinkLabel,
              href: safePluginOptions.dashboardSlug,
            },
          },
        ],
      },
    };

    initConfigJobs(config, safePluginOptions);

    console.log(config.jobs);
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
      // await payload.jobs.queue({
      //   task: `${safePluginOptions.collectionSlug}_delete_history`,
      //   queue: "nightly",
      //   input: {},
      // });
    };

    return config;
  };
