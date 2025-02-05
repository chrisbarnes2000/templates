import { Client, Environment } from "square";
import crypto from 'crypto';
import {
  IntegrationClassI,
  InitProps,
  InitReturns,
  VerifyWebhookSignatureProps,
  SubscriptionProps,
  SubscribeReturns,
  WebhooksProps,
  Events,
  AnyObject,
  Truthy,
  DeleteWebhookEndpointProps,
  TestConnection,
} from "../../../types/sourceClassDefinition";

export default class SquareIntegration implements IntegrationClassI {
  id = "sandbox-sq0idb-TFf_EmComK7MWat_w3hznQ";
  name = "Square";
  square: Client;

  readonly SQUARE_SECRET_KEY: string;

  constructor({
    SQUARE_SECRET_KEY,
    environment
  }: {
    SQUARE_SECRET_KEY: string;
    environment: string;
  }) {
    const squareEnvironment = environment === 'live' ? Environment.Production : Environment.Sandbox;

    this.square = new Client({
      accessToken: SQUARE_SECRET_KEY,
      environment: squareEnvironment,
    });

    this.SQUARE_SECRET_KEY = SQUARE_SECRET_KEY;
  }

  async init({ webhookUrl, events }: InitProps): Promise<InitReturns> {
    const webhook = await this.square.webhookSubscriptionsApi.createWebhookSubscription({
      subscription: {
        name: `buildable-${this.randomHex()}`,
        eventTypes: events,
        notificationUrl: webhookUrl,
      },
    });

    return {
      webhookData: webhook.result,
      events: webhook.result.subscription.eventTypes,
    };
  }

  async verifyWebhookSignature({ request, signature, secret, webhookUrl }: VerifyWebhookSignatureProps): Promise<Truthy> {
    const { body } = request;

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(webhookUrl + body);

    const hash = hmac.digest('base64');

    const isValid = hash === signature;

    if (!isValid) throw new Error('Signature verification failed');

    return isValid;
  }

  async getWebhooks(): Promise<AnyObject | AnyObject[]> {
    const webhookEndpoint = await this.square.webhookSubscriptionsApi.listWebhookSubscriptions();

    return webhookEndpoint.result;
  }

  async getSubscribedEvents({ webhookId }: WebhooksProps): Promise<Events> {
    const webhook: AnyObject =
      await this.square.webhookSubscriptionsApi.retrieveWebhookSubscription(webhookId);

    return webhook.result.subscription.eventTypes;
  }

  async deleteWebhookEndpoint({ webhookId }: DeleteWebhookEndpointProps): Promise<Truthy> {
    try {
      await this.square.webhookSubscriptionsApi.deleteWebhookSubscription(webhookId);
      return true;
    } catch (error) {
      throw new Error((error as any).errors[0].detail);
    }
  }

  async subscribe({ webhookId, events }: SubscriptionProps): Promise<SubscribeReturns> {
    const subscribedEvents = await this.getSubscribedEvents({
      webhookId,
    });

    const eventsAfterSubscribe = subscribedEvents.concat(events);

    const updatedWebhook = await this.square.webhookSubscriptionsApi.updateWebhookSubscription(
      webhookId,
      {
        subscription: {
          eventTypes: eventsAfterSubscribe,
        },
      },
    );

    return {
      webhook: updatedWebhook.result,
      events: updatedWebhook.result.subscription.eventTypes,
    };
  }

  async unsubscribe({
    webhookId,
    events,
  }: SubscriptionProps): Promise<{ events: Events; webhook?: any; webhooks?: any }> {
    const subscribedEvents = await this.getSubscribedEvents({
      webhookId,
    });

    const eventsAfterUnsubscribe = subscribedEvents.filter(
      (event: string) => !events.includes(event),
    );

    if (!eventsAfterUnsubscribe.length) {
      await this.deleteWebhookEndpoint({ webhookId });

      return {
        events: [],
      };
    }

    const updatedWebhook = await this.square.webhookSubscriptionsApi.updateWebhookSubscription(
      webhookId,
      {
        subscription: {
          eventTypes: eventsAfterUnsubscribe,
        },
      },
    );

    return {
      webhook: updatedWebhook.result,
      events: updatedWebhook.result.subscription.eventTypes,
    };
  }

  async testConnection(): Promise<TestConnection> {
    try {
      const data: any = await this.getWebhooks();
      if (data.status > 299) {
        throw new Error(`Square API returned status code ${data.status}`);
      }
      return {
        success: true,
        message: "Connection to Square Webhooks API is healthy",
      };
    } catch (e) {
      throw new Error("Unable to establish a connection with Square: " + (e as Error).message);
    }
  }

  private randomHex(): string {
    return Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
  }
}
