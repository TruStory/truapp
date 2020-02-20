import AppConfig from 'shared/app-config.json';
import { Coins } from 'shared/types/currency';

export const DEFAULT_FEE_COIN = {
  denom: Coins.TRU,
  amount: AppConfig.default_fee.amount,
  humanReadable: '0.001',
};

export const DEFAULT_FEE = {
  amount: [DEFAULT_FEE_COIN],
  gas: AppConfig.default_fee.gas,
};

export const DEFAULT_MEMO = AppConfig.default_memo;
export const PUBKEY_ALGO = 'secp256k1';
export const CHAIN_ID = AppConfig.chain_id;
export const CHAIN_URL = AppConfig.chain_url;

export const CHAIN_PUBLISH_ROUTE =  `${AppConfig.api.endpoint}/unsigned`;
export const SERVER_SIGNING_ENABLED = true;
