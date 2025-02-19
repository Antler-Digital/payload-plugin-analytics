import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AnalyticsPluginOptions, VercelJson } from "../types";
import type { Config, PayloadRequest, JobsConfig, Payload } from "payload";
import { initDeleteHistoryTask } from "./delete-history-task";

/**
 * Initialises the plugin cron jobs if hosted on a dedicated server
 * @param config
 * @param pluginOptions
 */
export const initConfigJobs = (
  config: Config,
  pluginOptions: Required<AnalyticsPluginOptions>
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

      const existingCron = cronConfig.some(({ queue }) => queue === "nightly");

      if (!existingCron) {
        cronConfig.push({
          queue: "nightly",
          cron: "0 * * * *",
        });
      }

      return cronConfig;
    };
  }
};

/**
 * Initialises cron jobs for the plugin if hosted on Vercel
 * @param pluginOptions
 * @param payload
 * @returns
 */
export const onInitCrons = async (
  pluginOptions: AnalyticsPluginOptions,
  payload: Payload
): Promise<void> => {
  try {
    const { isServerless, collectionSlug } = pluginOptions;

    if (!isServerless) {
      return;
    }

    const vercelJson = path.resolve(process.cwd(), "vercel.json");

    let fileContent: VercelJson = {
      crons: [],
    };

    if (fs.existsSync(vercelJson)) {
      const content = JSON.parse(fs.readFileSync(vercelJson, "utf-8"));
      fileContent = {
        ...content,
      };
    }

    const payloadNightlyCronPath = "/api/payload-jobs/run?queue=nightly";

    const existingCron = fileContent.crons.some(
      ({ path }) => path === payloadNightlyCronPath
    );

    if (!existingCron) {
      fileContent.crons.push({
        path: payloadNightlyCronPath,
        schedule: "0 * * * *",
      });

      fs.writeFileSync(vercelJson, JSON.stringify(fileContent));
    }

    await payload.jobs.queue({
      task: `${collectionSlug}_delete_history`,
      queue: "nightly",
      input: {},
    });
  } catch (err: unknown) {
    payload.logger.error({
      err,
      msg: "Error creating Cron Jobs",
    });
  }
};
