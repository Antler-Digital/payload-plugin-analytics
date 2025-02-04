import { CollectionSlug, Endpoint } from "payload";
import crypto from "crypto";
import {
  createEvent,
  createSession,
  getEvents,
  getExistingSession,
} from "../utils/db-helpers";
import {
  getDomain,
  getIpAddress,
  getUserAgent,
  getDeviceType,
  getOs,
  getBrowser,
  getReferrerUrl,
  getUtmParams,
  getQueryParams,
  getPathname,
  getCountry,
} from "../utils/request-helpers";
import {
  AnalyticsPluginOptions,
  CreateEventData,
  CreateSessionData,
  TableParams,
} from "../types";
import * as WebpageActions from "../actions/get-webpage-views";
import { getDashboardData } from "../actions/get-dashboard-stats";

const headers: ResponseInit["headers"] = {
  "Content-Type": "application/json",
};

const hashIpAddress = (ip: string) => {
  return crypto.createHash("sha256").update(ip).digest("hex");
};

// 1x1 transparent GIF pixel (base64 encoded)
const TRANSPARENT_PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

export function EventsEndpoint(
  pluginOptions: AnalyticsPluginOptions,
): Endpoint {
  return {
    path: "/events",
    method: "get",
    handler: async (req) => {
      try {
        const payload = req.payload;
        const ip = getIpAddress(req);
        const hashedIp = hashIpAddress(ip);
        const domain = getDomain(req);
        const userAgent = getUserAgent(req);
        const deviceType = userAgent ? getDeviceType(userAgent) : undefined;
        const os = userAgent ? getOs(userAgent) : undefined;
        const browser = userAgent ? getBrowser(userAgent) : undefined;
        const country = ip ? getCountry(req) : undefined;
        const path = getPathname(req);

        let session = await getExistingSession(
          payload,
          pluginOptions,
          hashedIp,
          domain,
        );

        const sessionData: CreateSessionData = {
          ip_hash: hashedIp,
          domain,
          user_agent: userAgent,
          device_type: deviceType,
          os,
          browser,
          country,
        } as any;

        if (!session) {
          session = await createSession(payload, pluginOptions, sessionData);
        }

        // Handle session end
        if (req.query.event === "session_end" && req.query.duration) {
          // Just update the session, don't create an event
          const collection = pluginOptions.slug
            ? `${pluginOptions.slug}-sessions`
            : "analytics-sessions";
          await payload.update({
            // @ts-ignore
            collection: collection,
            id: session.id,
            data: {
              // @ts-ignore
              session_end: new Date(),
              // @ts-ignore
              duration: parseInt(req.query.duration as string),
            } as any,
          });

          // Return early - no need to create an event
          return new Response(TRANSPARENT_PIXEL, {
            headers: { "Content-Type": "image/gif" },
          });
        }

        // Only create events for page views
        const eventData: CreateEventData = {
          ...sessionData,
          session_id: session.id.toString(),
          path: path,
          event_type: "page_view",
          query_params: getQueryParams(req)?.toString(),
          referrer_url: getReferrerUrl(req),
          utm: getUtmParams(req),
        };

        await createEvent(payload, pluginOptions, eventData);

        return new Response(TRANSPARENT_PIXEL, {
          headers: { "Content-Type": "image/gif" },
        });
      } catch (error) {
        console.error("Analytics tracking error:", {
          error,
          path: req.pathname,
          domain: getDomain(req),
        });

        // Still return the pixel to avoid client-side errors
        // but with a 500 status code
        return new Response(TRANSPARENT_PIXEL, {
          status: 500,
          headers: { "Content-Type": "image/gif" },
        });
      }
    },
  };
}

export function GetEvents(pluginOptions: AnalyticsPluginOptions): Endpoint {
  return {
    path: "/events",
    method: "get",
    handler: async (req) => {
      try {
        const payload = req.payload;

        const events = await getEvents(payload, pluginOptions);

        return new Response(JSON.stringify(events?.docs), { headers });
      } catch (error) {
        return Response.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }
    },
  };
}

export function Dashboard(pluginOptions: AnalyticsPluginOptions): Endpoint {
  return {
    path: "/dashboard",
    method: "post",
    handler: async (req) => {
      try {
        const payload = req.payload;

        let opts = {
          date_range: "last_7_days",
          date_change: undefined,
          date_from: undefined,
        } as TableParams;

        try {
          const json = await req?.json?.();

          opts.date_from = json?.date_from;
          opts.date_range = json?.date_range;
          /**
           * The date_change is the date from which the data is being compared to.
           * eg if the date_from is 7 days ago, the date_change is 14 days ago.
           */
          opts.date_change = json?.date_change ?? undefined;
        } catch (error) {
          console.error("Error parsing request body", error);
        }

        const data = await getDashboardData(payload, pluginOptions, opts);

        return new Response(JSON.stringify(data), { headers });
      } catch (error) {
        return Response.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }
    },
  };
}

export function GetStats(pluginOptions: AnalyticsPluginOptions): Endpoint {
  return {
    path: "/stats/:widget",
    method: "get",
    handler: async (req) => {
      try {
        const payload = req.payload;

        const widget = req.routeParams?.["widget"];
        const params = req.query;

        if (!widget) {
          return new Response(
            JSON.stringify({ message: "Widget param is required" }),
            {
              headers,
            },
          );
        }

        const { slug } = pluginOptions;
        const collection = (
          slug ? `${slug}-events` : "analytics-events"
        ) as CollectionSlug;
        const sessionsCollection = (
          slug ? `${slug}-sessions` : "analytics-sessions"
        ) as CollectionSlug;

        switch (widget) {
          case "top-pages":
            return await WebpageActions.getTopPages(
              payload,
              collection,
              params as TableParams,
            );
          case "top-referrers":
            return await WebpageActions.topReferrers(
              payload,
              collection,
              params as TableParams,
            );
          case "utm-tracking":
            return await WebpageActions.getUTMTracking(
              payload,
              sessionsCollection,
              params as TableParams,
            );
          case "browsers":
            return await WebpageActions.getBrowsers(
              payload,
              collection,
              params as TableParams,
            );
          case "devices":
            return await WebpageActions.getDevices(
              payload,
              collection,
              params as TableParams,
            );
          case "operating-systems":
            return await WebpageActions.getOperatingSystems(
              payload,
              collection,
              params as TableParams,
            );

          case "webpage-views":
            return await WebpageActions.getWebpageViews(payload, collection);
          case "unique-visitors":
            return await WebpageActions.getUniqueVisitors(payload, collection);
          case "live-visitors":
            return await WebpageActions.getLiveVisitors(payload, collection);
          case "bounce-rate":
            return await WebpageActions.getBounceRate(payload, collection);
          case "page-views-and-visitors":
            return await WebpageActions.getPageViewsAndVisitors(
              payload,
              collection,
            );
          case "visitor-geography":
            return await WebpageActions.getVisitorGeography(
              payload,
              collection,
            );

          default:
            return new Response(
              JSON.stringify({ message: `Unrecognized param: ${widget}` }),
              {
                headers,
              },
            );
        }
      } catch (error) {
        return Response.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }
    },
  };
}
