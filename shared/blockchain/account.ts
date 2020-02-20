import { Buffer } from 'buffer';
import { ec as EC } from 'elliptic';
import { DEFAULT_FEE, DEFAULT_MEMO, PUBKEY_ALGO } from 'shared/blockchain/parameters';
import { Fee, Hex, Msg, MsgConcreteTypes, SignedTx, Tx, UnsignedTx } from 'shared/blockchain/types';
import { canonicalHash, canonicalJSONString, sign } from 'shared/blockchain/util';
import { Address, UserMeta, UserProfile } from 'shared/types/appAccount';

const ec = new EC(PUBKEY_ALGO);

export class Account {
  accountNumber: number;
  id: Address;
  address: Address;
  chainId: string;
  userProfile: UserProfile;
  userMeta: UserMeta;
  invitesLeft: number;
  sequence: number;
  publicKeyHex?: Hex;
  privateKeyHex?: Hex;

  static pubkeyAlgo = PUBKEY_ALGO;

  static pubkeyFromPrivate(hex: Hex): Hex {
    return keyFromHex(hex).getPublic(true, 'hex').toUpperCase();
  }

  static generatePrivateKey(entropy: string): Hex {
    return ec.genKeyPair({ entropy }).getPrivate('hex').toString().toUpperCase();
  }

  constructor({
    chainId,
    id,
    address,
    accountNumber,
    userProfile,
    userMeta,
    invitesLeft,
    sequence,
    publicKeyHex = undefined,
    privateKeyHex = undefined,
  }: {
    chainId: string,
    id: Address,
    address: Address,
    accountNumber: number,
    userProfile: UserProfile,
    userMeta: UserMeta,
    invitesLeft: number,
    sequence: number,
    publicKeyHex?: Hex,
    privateKeyHex?: Hex | undefined,
  }) {
    this.chainId = chainId;
    this.id = address;
    this.address = address;
    this.userProfile = userProfile;
    this.userMeta = userMeta;
    this.invitesLeft = invitesLeft;
    this.accountNumber = accountNumber;
    this.sequence = sequence;
    this.privateKeyHex = privateKeyHex;
    this.publicKeyHex = publicKeyHex;

    if (!this.publicKeyHex && this.privateKeyHex) {
      this.publicKeyHex = Account.pubkeyFromPrivate(this.privateKeyHex);
    }
  }

  export(): string {
    return JSON.stringify(this);
  }

  tx(msgs: Msg[], fee: Fee = DEFAULT_FEE): Tx {
    if (this.sequence === undefined) {
      throw new Error('Account sequence is required to generate transactions.');
    }

    return {
      account_number: this.accountNumber,
      chain_id: this.chainId,
      fee,
      memo: DEFAULT_MEMO,
      msgs: msgs.map(m => m.body),
      sequence: this.sequence,
    };
  }

  stringifyIntFieldsInMsg = (msg: { [key: string]: any}): object => {
    for (const key in msg) {
      if (msg.hasOwnProperty(key)) {
        if (typeof msg[key] === 'object') {
          msg[key] = this.stringifyIntFieldsInMsg(msg[key]);
        } else {
          msg[key] = msg[key].toString();
        }
      }
    }

    if (msg.type === 'truchain/MsgSubmitArgument') {
      msg.value['stake_type'] = parseInt(msg.value['stake_type']);
    }
    
    return msg;
  }

  stringifyIntFieldsInMsgs = (msgs: { [key: string]: any}[]): object[] => {
    const stringified: object[] = [];

    msgs.forEach(msg => {
      stringified.push(this.stringifyIntFieldsInMsg(msg));
    });

    return stringified;
  }

  stringifyIntFields = (tx: Tx): object => {
    const data: object = Object.assign({ }, tx, {
      account_number: tx.account_number.toString(),
      sequence: tx.sequence.toString(),
      fee: {
        amount: tx.fee.amount.map(({ denom, amount }) => {
          return { denom, amount: amount.toString() };
        }),
        gas: tx.fee.gas.toString(),
      },
      msgs: this.stringifyIntFieldsInMsgs(tx.msgs),
    });

    return data;
  }

  sign = (tx: Tx): string => {
    // Have to stringify these int fields for API consumption
    // When decoded by go-amino, they will be parsed as numbers
    const data: object = this.stringifyIntFields(tx);
    return sign(this.key(), canonicalHash(data));
  }

  signableTx(msgs: Msg[], fee: Fee = DEFAULT_FEE): Tx {
    const tx = this.tx(msgs);

    tx.msgs = msgs.map(m => { return { type: MsgConcreteTypes[m.type], value: m.body }; });

    return tx;
  }

  unsignedTx(...msgs: Msg[]): UnsignedTx {
    const tx = this.tx(msgs);
    const txHex = Buffer.from(JSON.stringify(tx), 'utf8').toString('hex').toUpperCase();
    return {
      msg_types: msgs.map(m => m.type),
      tx: txHex,
      tx_raw: canonicalJSONString(this.stringifyIntFields(this.signableTx(msgs))),
    };
  }

  signedTx(...msgs: Msg[]): SignedTx {
    if (this.publicKeyHex === undefined) {
      throw new Error(`Cannot generate transactions for account ${this.address} without a public key`);
    }
    const tx = this.tx(msgs);
    const txHex = Buffer.from(JSON.stringify(tx), 'utf8').toString('hex').toUpperCase();
    return {
      msg_types: msgs.map(m => m.type),
      tx: txHex,
      pubkey_algo: PUBKEY_ALGO,
      pubkey: this.publicKeyHex,
      signature: this.sign(tx),
    };
  }

  private key(): EC.KeyPair {
    if (this.privateKeyHex === undefined) {
      throw new Error(`Cannot get private key for account ${this.address}`);
    }

    return keyFromHex(this.privateKeyHex);
  }
}

function keyFromHex(hex: string): EC.KeyPair {
  const stringBuffer = Buffer.from(hex);         // normally we'd get the raw bytes using Buffer.from(hex, 'hex')
  return ec.keyFromPrivate(stringBuffer, 'hex'); // <- but this method actually wants the bytes of the hex string
}
