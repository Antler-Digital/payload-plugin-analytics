import { CollectionSlug, Payload } from 'payload'
import { AnalyticsPluginOptions, CreateEventData, CreateSessionData } from '../types'

export async function getExistingSession(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
  ip_hash: string,
  domain: string,
) {
  const { slug } = pluginOptions
  const collection = (slug ? `${slug}-sessions` : 'analytics-sessions') as CollectionSlug
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
  })

  return session.totalDocs > 0 ? session.docs[0] : null
}

export async function createSession(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
  data: CreateSessionData,
) {
  const { slug } = pluginOptions
  const collection = (slug ? `${slug}-sessions` : 'analytics-sessions') as CollectionSlug
  return await payload.create({
    // @ts-ignore
    collection,
    // @ts-ignore
    data,
  })
}

export async function createEvent(
  payload: Payload,
  pluginOptions: AnalyticsPluginOptions,
  data: CreateEventData,
) {
  const { slug } = pluginOptions
  const collection = (slug ? `${slug}-events` : 'analytics-events') as CollectionSlug
  return await payload.create({
    // @ts-ignore
    collection,
    // @ts-ignore
    data,
  } as any)
}

export async function getEvents(payload: Payload, pluginOptions: AnalyticsPluginOptions) {
  const { slug } = pluginOptions
  const collection = (slug ? `${slug}-events` : 'analytics-events') as CollectionSlug
  // @ts-ignore
  return await payload.find({ collection })
}
