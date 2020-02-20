global.Buffer = require('buffer').Buffer; // necessary to make JSON stringification of buffers work
import { stringify as canonicalJSON } from 'deterministic-json';
import { ec as EC } from 'elliptic';
import { sha256 } from 'hash.js';
import { Hex } from 'shared/blockchain/types';

// Get canonical string of a JS object by recursively sorting keys
export function canonicalJSONString(obj: object): Hex {
  return canonicalJSON(obj);
}

// Get canonical SHA-256 hash of a JS object by recursively sorting keys
export function canonicalHash(obj: object): Hex {
  const json = canonicalJSON(obj);
  // Need to feed json as Buffer array of bytes to sha256 otherwise utf8
  // characters that consist of more than one byte will not be hashed correctly
  // "a" character consists of 1 byte printed in hex bytes as 61
  // "“" character consists of 3 bytes printed in hex as bytes e2809d
  const byteArray = Buffer.from(json);
  return sha256().update(byteArray).digest('hex');
}

// Sign a function and return an appropriately-formatted signature
export function sign(key: EC.KeyPair, hex: Hex): Hex {
  const sig = key.sign(hex, { canonical: true });

  // See formatting requirements:
  // https://github.com/tendermint/tendermint/commit/b1bc3e4f894c840d7b311af28fc9e1c58bbc8769

  const r = sig.r.toString('hex', 32);
  const s = sig.s.toString('hex', 32);

  return r + s;
}
