import { AnalyticsPluginOptions } from "../types";
import type { Config, PayloadRequest, JobsConfig } from "payload";
import { initDeleteHistoryTask } from "./delete-history-task";

export const initConfigJobs = (
  config: Config,
  pluginOptions: Required<AnalyticsPluginOptions>,
) => {
  config.jobs = {
    tasks: [],
    workflows: [],
    autoRun: [],
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${process.env.CRON_SECRET}`;
      },
    },
    ...config.jobs,
  } satisfies Config["jobs"];

  config.jobs.tasks.push(initDeleteHistoryTask(pluginOptions));

  if (!pluginOptions.isServerless) {
    config.jobs.autoRun = async (payload) => {
      const autoRun = config.jobs?.autoRun;
      const cronConfig: JobsConfig["autoRun"] = [];

      if (autoRun) {
        if (Array.isArray(autoRun)) {
          cronConfig.concat(autoRun);
        } else {
          const crons = await autoRun(payload);
          cronConfig.concat(crons);
        }
      }
      cronConfig.push({
        queue: "nightly",
        cron: "0 * * * *",
      });

      return cronConfig;
    };
  }
};
