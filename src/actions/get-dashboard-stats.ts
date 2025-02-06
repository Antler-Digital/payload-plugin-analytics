import { BasePayload, CollectionSlug } from "payload";
import { AnalyticsPluginOptions, CountryData, TableParams } from "../types";

// Percentage Change = (Length of Dataset A - Length of Dataset B) / Length of Dataset B * 100

export interface DashboardData {
  webpage_views: { value: number; change: number };
  unique_visitors: { value: number; change: number };
  bounce_rate: { value: number; change: number };
  live_visitors: { value: number; change: number };
  visitor_geography: CountryData[];
  views_and_visitors: any[];
  /** In a given date range; default 7 days */
  top_pages: { path: string; value: number; change: number }[];
  /** In a given date range; default 7 days */
  top_referrers: { label: string; count: number; domain: string }[];
  /** In a given date range; default 7 days */
  utm_tracking: {
    campaign: string;
    medium: string;
    source: string;
    visitors: number;
  }[];
  /** In a given date range; default 7 days */
  browsers: { browser: string; visitors: number; fill: string }[];
  devices: Record<string, number | string>[];
  /** In a given date range; default 7 days */
  operating_systems: { os: string; visitors: number; fill: string }[];
}

export class DashboardStats {
  data: any[];
  rangeData: any[];
  opts: TableParams;
  constructor(data: any[], rangeData: any[], opts: TableParams) {
    this.data = data;
    this.rangeData = rangeData;
    this.opts = opts;
  }

  parse(): DashboardData {
    return {
      webpage_views: this.webpage_views,
      unique_visitors: this.unique_visitors,
      bounce_rate: this.bounce_rate,
      live_visitors: this.live_visitors,
      browsers: this.browsers,
      devices: this.devices,
      operating_systems: this.operating_systems,
      visitor_geography: this.visitor_geography,
      views_and_visitors: this.views_and_visitors,
      top_pages: this.top_pages,
      top_referrers: this.top_referrers,
      utm_tracking: this.utm_tracking,
    } as DashboardData;
  }

  get webpage_views() {
    return {
      value: this.data.length,
      change: this.rangeData.length
        ? calculatePercentageChange(this.rangeData.length, this.data.length)
        : 0,
    };
  }

  get unique_visitors() {
    const set = new Set<string>();
    const rangeSet = new Set<string>();
    this.data.forEach((item) => {
      set.add(item.ip_hash);
    });
    this.rangeData.forEach((item) => {
      rangeSet.add(item.ip_hash);
    });

    return {
      value: set.size,
      change: calculatePercentageChange(rangeSet.size, set.size),
    };
  }

  get bounce_rate() {
    return {
      value: 0,
      change: 0,
    };
  }

  get live_visitors() {
    const MINUTES_AGO = 30;
    const visitors = new Set<string>();
    // assume client has been on the site for last 30 minutes
    const liveLimit = new Date(
      Date.now() - MINUTES_AGO * 60 * 1000,
    ).toISOString();
    this.data.forEach((item) => {
      if (item.createdAt > liveLimit) {
        visitors.add(item.ip_hash);
      }
    });
    return {
      value: visitors.size,
    };
  }

  get browsers() {
    const map = new Map<string, number>();
    this.data.forEach((item) => {
      map.set(item.browser, (map.get(item.browser) || 0) + 1);
    });

    const total = Object.fromEntries(map);
    return Object.entries(total)
      .sort((a, b) => a[1] - b[1])
      .map(([browser, visitors], i) => ({
        browser: browser.toLowerCase(),
        visitors,
        fill: `hsl(var(--chart-${i + 1}))`,
      }));
  }

  get devices() {
    const map = new Map<string, number>();
    this.data.forEach((item) => {
      map.set(item.device_type, (map.get(item.device_type) || 0) + 1);
    });

    const total = Object.fromEntries(map);

    return Object.entries(total).reduce(
      (acc, [device, visitors], i) => {
        acc.push({
          [device.toLowerCase()]: visitors,
          fill: `hsl(var(--chart-${i + 1}))`,
        });
        return acc;
      },
      [] as DashboardData["devices"],
    );
  }

  get operating_systems() {
    const map = new Map<string, number>();
    this.data.forEach((item) => {
      map.set(item.os, (map.get(item.os) || 0) + 1);
    });

    const total = Object.fromEntries(map);

    return Object.entries(total)
      .sort((a, b) => a[1] - b[1])
      .map(([os, visitors], i) => ({
        os: os.toLowerCase(),
        visitors,
        fill: `hsl(var(--chart-${i + 1}))`,
      }));
  }

  static getHourFromDate(date: Date) {
    const hour = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${hour}h ${day}/${month}`;
  }

  static getDayFromDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  get views_and_visitors() {
    const map = new Map<string, { views: number; visitors: Set<string> }>();

    if (
      this.opts.date_range === "last_1_day" ||
      this.opts.date_range === "last_3_days"
    ) {
      let hours = 24;
      if (this.opts.date_range === "last_3_days") {
        hours = 72;
      }

      for (let i = hours; i > 0; i--) {
        const hour = DashboardStats.getHourFromDate(
          new Date(Date.now() - i * 60 * 60 * 1000),
        );
        if (!map.has(hour)) {
          map.set(hour, {
            views: 0,
            visitors: new Set<string>(),
          });
        }
      }

      this.data.forEach((item) => {
        const itemHour = DashboardStats.getHourFromDate(
          new Date(item.createdAt),
        );
        if (map.has(itemHour)) {
          const _item = map.get(itemHour);
          if (_item) {
            _item.visitors.add(item.ip_hash);
            _item.views++;
          }
        }
      });
    } else if (this.opts.date_range === "last_7_days") {
      for (let i = 7; i >= 0; i--) {
        const day = DashboardStats.getDayFromDate(
          new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        );
        map.set(day, { views: 0, visitors: new Set<string>() });
      }

      this.data.forEach((item) => {
        const itemDay = DashboardStats.getDayFromDate(new Date(item.createdAt));
        if (map.has(itemDay)) {
          const _item = map.get(itemDay);
          if (_item) {
            _item.visitors.add(item.ip_hash);
            _item.views++;
          }
        }
      });
    } else {
      this.data.forEach((item) => {
        const createdAt = new Date(item.createdAt).toISOString().split("T")[0];

        if (map.has(createdAt)) {
          const _item = map.get(createdAt);
          if (_item) {
            _item.visitors.add(item.ip_hash);
            _item.views++;
          }
        } else {
          map.set(createdAt, { views: 0, visitors: new Set<string>() });
        }
      });
    }

    return Array.from(map.entries())
      .map(([date, { views, visitors }]) => ({
        day: date,
        views,
        visitors: visitors.size,
      }))
      .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  }

  get visitor_geography() {
    const countryMap = new Map<string, number>();
    this.data.forEach((item) => {
      countryMap.set(item.country, (countryMap.get(item.country) || 0) + 1);
    });

    return Array.from(countryMap.entries()).map(([countryCode, views]) => ({
      countryCode,
      views,
    }));
  }

  get top_pages() {
    const map = new Map<string, number>();
    this.data.forEach((item) => {
      map.set(item.path, (map.get(item.path) || 0) + 1);
    });

    const total = Object.fromEntries(map);

    return Object.entries(total)
      .sort((a, b) => b[1] - a[1])
      .map(([path, value], i) => ({
        path,
        value,
        change: 0,
      }))
      .slice(0, 10);
  }

  get top_referrers() {
    // referrer_url
    const map = new Map<string, number>();
    this.data.forEach((item) => {
      // make sure the referrer_url is a valid URL
      if (!item.referrer_url) return;

      map.set(item.referrer_url, (map.get(item.referrer_url) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([referrer, value]) => {
        let domain = "";
        try {
          const url = new URL(referrer);
          domain = `${url.protocol}//${url.host}`;
        } catch (error) {}

        return {
          domain,
          label: referrer,
          count: value,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  get utm_tracking() {
    const campaigns = new Map<
      string,
      { campaign: string; medium: string; source: string; visitors: number }
    >();
    this.data.forEach((item) => {
      if (item.session_id?.utm?.campaign) {
        const key = `${item.session_id.utm.campaign}-${item.session_id.utm.medium}-${item.session_id.utm.source}-${item.session_id.utm.term}-${item.session_id.utm.content}`;

        campaigns.set(key, {
          campaign: item.session_id.utm.campaign,
          medium: item.session_id.utm.medium,
          source: item.session_id.utm.source,
          visitors: (campaigns.get(key)?.visitors || 0) + 1,
        });
      }
    });

    return Array.from(campaigns.entries()).map(
      ([key, { campaign, medium, source, visitors }]) => ({
        campaign,
        medium,
        source,
        visitors,
      }),
    );
  }
}

export async function getDashboardData(
  payload: BasePayload,
  pluginOptions: AnalyticsPluginOptions,
  /** ISO string */
  opts: TableParams,
) {
  try {
    const { collectionSlug: slug } = pluginOptions;
    const collection = `${slug}-events`;
    const sessionsCollection = `${slug}-sessions`;

    const data = await payload.find({
      // @ts-ignore
      collection: collection as CollectionSlug,
      ...(opts.date_from && {
        where: {
          createdAt: {
            greater_than_equal: opts.date_from,
            // less_than_equal: opts.date_to, // default is today
          },
        },
      }),
      populate: {
        [sessionsCollection]: {
          utm: true,
        },
      },
      limit: parseInt(opts.limit || "10000"),
    });

    const rangeData = await payload.find({
      // @ts-ignore
      collection: collection as CollectionSlug,
      ...(opts.date_change &&
        opts.date_from && {
          where: {
            createdAt: {
              greater_than_equal: opts.date_change,
              less_than_equal: opts.date_from,
            },
          },
        }),
      select: {
        ip_hash: true,
        createdAt: true,
      },
      limit: parseInt(opts.limit || "1000"),
    });

    console.log("opts", opts);
    const dashboardStats = new DashboardStats(data.docs, rangeData.docs, opts);

    return {
      data: dashboardStats.parse(),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: true,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}

function calculatePercentageChange(lengthA: number, lengthB: number) {
  // Handle division by zero
  if (lengthA === 0) {
    return 0;
  }

  // Calculate percentage change
  return Math.round(((lengthB - lengthA) / lengthA) * 100 * 100) / 100;
}
