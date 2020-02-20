
import { Buffer } from 'buffer';
import SetCookie from 'set-cookie-parser';
import AppConfig from 'shared/app-config.json';
import { Account } from 'shared/blockchain/account';
import { CHAIN_PUBLISH_ROUTE, PUBKEY_ALGO, SERVER_SIGNING_ENABLED } from 'shared/blockchain/parameters';
import { BroadcastTxResponse, DeviceNotificationRegistrationRequest, DeviceNotificationRegistrationResponse, DeviceNotificationUnregisterResponse, Log, Msg, MsgError, MsgErrorWithLog, RegistrationRequest, RegistrationResponse } from 'shared/blockchain/types';
import { isWeb } from 'shared/styles/utils';
import { delete as deleteRequest, get, post, put, Response, SuperAgentRequest } from 'superagent';

export class Blockchain {
  baseUrl: string;
  static pubkeyAlgo = PUBKEY_ALGO;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getJSON<T>(path: string): Promise<T> {
    const url = this.baseUrl + path;

    const agent = get(url);
    return this.sendJSON<T>(url, agent);
  }

  async putJSON<T>(path: string, putBody: object): Promise<T> {
    const url = this.baseUrl + path;

    const agent = put(url);
    return this.sendJSON<T>(url, agent, putBody);
  }

  async deleteJSON<T>(path: string, deleteBody: object): Promise<T> {
    const url = this.baseUrl + path;

    const agent = deleteRequest(url);
    return this.sendJSON<T>(url, agent, deleteBody);
  }

  async postJSON<T>(path: string, postBody: object): Promise<T> {
    const url = this.baseUrl + path;

    const agent = post(url);
    return this.sendJSON<T>(url, agent, postBody);
  }

  async sendJSON<T>(url: string, agent: SuperAgentRequest, requestBody?: object): Promise<T> {
    agent = this.configureAgent(agent);

    try {
      var { body }: Response = await agent.send(requestBody);
    } catch (err) {
      if (err.status === 401) {
        throw new Error('Your session has expired. Please log in again.');
      }
      if (err.status === 404) {
        throw new Error(err.message);
      }
      // API currently returns 3 different error formats under err.response.body.error
      // 1. "Just an error string"
      // 2. "{\"codespace\":\"claim\",\"code\":101,\"message\":\"Invalid claim body, too short: \"}"
      // 3. "[{"msg_index":0,"success":false,"log":"{\"codespace\":\"claim\",\"code\":102,\"message\":\"Invalid claim body, too long\"}"}]"
      if ((err.status === 400 || err.status === 422) && err.response && err.response.body && err.response.body.error) {
        const error = err.response.body.error;
        // cosmos msg handler validation failed and error is a JSON encoded sdk.Result
        if (error.charAt(0) === '{') {
          const errorMessage = (JSON.parse(error) as MsgError).message;
          throw new Error(errorMessage);
        } if (error.charAt(0) === '[') {
          const errorLog = (JSON.parse(error) as MsgErrorWithLog[])[0].log;
          const errorMessage = (JSON.parse(errorLog) as MsgError).message;
          throw new Error(errorMessage);
        } else {
          throw new Error(error);
        }
      } else if (err.response && err.response.body) {
        body = err.response.body;
      } else {
        return err;
      }
    }

    if (!body) {
      return <T>({ response: true });
    }

    if (!body.data) {
      return <T>({ response: true });
      // throw new Error(`Empty response from request: ${url} ${requestBody}`);
    }

    return <T>(body.data);
  }

  async register({
    authToken, authTokenSecret,
  }: RegistrationRequest): Promise<RegistrationResponse> {
    return await this.postJSON<RegistrationResponse>(`${AppConfig.api.endpoint}/register`, {
      auth_token: authToken,
      auth_token_secret: authTokenSecret,
    });
  }

  async mockRegister(): Promise<RegistrationResponse> {
    return await this.postJSON<RegistrationResponse>(`${AppConfig.api.endpoint}/mock_register`, { });
  }

  async queryGraphQL<T>(query: string, variables: object = { }): Promise<T> {
    return this.postJSON<T>(`${AppConfig.api.endpoint}/graphql`, { query, variables });
  }

  getCookieValue(header: any, name: string): string | undefined {
    const combinedCookieHeader = header['set-cookie'];
    const splitCookieHeaders = SetCookie.splitCookiesString(combinedCookieHeader);
    const cookies = SetCookie.parse(splitCookieHeaders);
    for (let i = 0; i < cookies.length; i++) {
      if (cookies[i].name === name) {
        return cookies[i].value;
      }
    }
  }

  configureAgent(agent: SuperAgentRequest): SuperAgentRequest {
    agent.set({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-mobile-request': isWeb() ? 'false' : 'true',
    });
    return agent;
  }

  getEndpoint(): string {
    return CHAIN_PUBLISH_ROUTE;
  }

  getPublishableTx(account: Account, ...msgs: Msg[]): object {
    if (SERVER_SIGNING_ENABLED) return account.unsignedTx(...msgs);

    return account.signedTx(...msgs);
  }

  async publish<T>(account: Account, ...msgs: Msg[]): Promise<T> {
    console.log('Publishing messages to chain', msgs);
    const response = await this.postJSON<BroadcastTxResponse>(
      this.getEndpoint(), this.getPublishableTx(account, ...msgs),
    );

    console.log('Chain response: ', response);

    if (response) {
      const { logs } = response;
      const log: Log = logs[0];
      if (log.success !== true) {
        throw (JSON.parse(log.log) as MsgError);
      }

      const responseJSON = Buffer.from(response.data, 'hex').toString('utf8');
      const parsedJSON: { type: string, value: T } = JSON.parse(responseJSON);
      console.log('Parsed response: ', parsedJSON);
      return <T>(parsedJSON.value);
    }

    throw new Error('Malformed publish response: ' + (response));
  }

  async registerDeviceToken(request: DeviceNotificationRegistrationRequest)
  : Promise<DeviceNotificationRegistrationResponse> {
    return await this.postJSON<DeviceNotificationRegistrationResponse>(`${AppConfig.api.endpoint}/deviceToken`, {
      address: request.address,
      platform: request.platform,
      token: request.token,
    });
  }

  async unregisterDeviceToken(token: string, platform: string)
  : Promise<DeviceNotificationUnregisterResponse> {
    return await this.postJSON<DeviceNotificationUnregisterResponse>(`${AppConfig.api.endpoint}/deviceToken/unregister`, {
      token,
      platform,
    });
  }
}
