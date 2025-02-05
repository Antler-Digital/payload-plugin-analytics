import { CollectionSlug, Payload } from "payload";
import {
  AnalyticsPluginOptions,
  CreateEventData,
  CreateSessionData,
} from "../types";

export async function getExistingSession(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
  ip_hash: string,
  domain: string,
) {
  const { collectionSlug: slug } = pluginOptions;
  const collection = `${slug}-sessions` as CollectionSlug;
  const session = await payload.find({
    // @ts-ignore
    collection,
    where: {
      ip_hash: {
        equals: ip_hash,
      },
      domain: {
        equals: domain,
      },
    },
    limit: 1,
  });

  return session.totalDocs > 0 ? session.docs[0] : null;
}

export async function createSession(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
  data: CreateSessionData,
) {
  const { collectionSlug: slug } = pluginOptions;
  const collection = slug as CollectionSlug;
  return await payload.create({
    // @ts-ignore
    collection,
    // @ts-ignore
    data,
  });
}

export async function createEvent(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
  data: CreateEventData,
) {
  const { collectionSlug: slug } = pluginOptions;
  const collection = `${slug}-events` as CollectionSlug;
  return await payload.create({
    // @ts-ignore
    collection,
    // @ts-ignore
    data,
  } as any);
}

export async function getEvents(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
) {
  const { collectionSlug: slug } = pluginOptions;
  const collection = `${slug}-events` as CollectionSlug;
  // @ts-ignore
  return await payload.find({ collection });
}
