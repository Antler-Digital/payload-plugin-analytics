export type AnalyticsPluginOptions = {
  /**
   * Base collection name for plugin collections
   * @default 'analytics'
   * @example Creates two collections: `{collectionSlug}-sessions` and `{collectionSlug}-events`
   */
  collectionSlug?: string;
  /**
   * Route the analytics dashboard is viewable on in the admin panel.
   * @default "/analytics"
   */
  dashboardSlug?: string;
  /**
   * Name of the link to the analytics dashboard in the admin nav menu.
   * @default "Analytics"
   */
  dashboardLinkLabel?: string;
  /**
   * Maximum number of days to store events and sessions in the database.
   * @default 60
   */
  maxAgeInDays?: number;
  /**
   * Determines if the deployment is serverless (Vercel) or self-hosted.
   * This is required to set up cron jobs correctly for deleting sessions.
   * @default true
   */
  isServerless?: boolean;
};

export type DeviceType = "desktop" | "mobile" | "tablet";

export interface CreateSessionData {
  ip_hash: string;
  domain: string;
  user_agent?: string;
  device_type?: DeviceType;
  os?: string;
  browser?: string;
  country?: string;
}

export interface CreateEventData extends CreateSessionData {
  event_type: string;
  session_id: string;
  path: string;
  query_params?: string;
  referrer_url?: string;
  utm?: {
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

export interface CountryData {
  countryCode: string;
  views: number;
}

export interface CountryInfo {
  name: string;
  alpha2: string;
  alpha3: string;
  numeric: string;
}

export type DateRange =
  | "last_1_day"
  | "last_3_days"
  | "last_7_days"
  | "last_30_days"
  | "last_60_days"
  | "all_time";

export interface TableParams {
  limit?: string;
  page?: string;
  date_from?: Date;
  date_change?: Date;
  date_range?: DateRange;
}

interface VercelCron {
  path: string;
  schedule: string;
}

export interface VercelJson {
  crons: VercelCron[];
  [key: string]: any;
}
