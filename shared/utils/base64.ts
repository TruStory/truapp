import { Base64 } from 'js-base64';

export function btoa(rawString : string) : string {
  return Base64.btoa(rawString);
}
