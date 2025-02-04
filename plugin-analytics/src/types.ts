export type AnalyticsPluginOptions = {
  slug?: string;
  maxAgeInDays?: number;
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
  date_from?: string;
  date_change?: string;
  date_range?: DateRange;
}
