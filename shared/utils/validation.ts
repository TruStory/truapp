import isUrl from 'is-url';
import removeMd from 'remove-markdown';
import { Color } from 'shared/styles/colors';

export interface FormErrors {
  [key: string]: Array<string|undefined>;
}

const ValidationUtil = {
  err: (isValid: boolean, msg: string) => {
    return isValid ? undefined : msg;
  },
  errors: (errs: FormErrors): string[] => {
    return Object.keys(errs).reduce((acc: string[], k: string) => {
      const fieldErrors = errs[k].filter(e => e !== undefined) as string[];
      return fieldErrors.length ? acc.concat(fieldErrors) : acc;
    }, []);
  },
  stringExists: (text: string | undefined): boolean => {
    if (text === undefined) { return false; }
    if (text.trim() === '') {
      return false;
    }
    return true;
  },
  exists: (v: any | undefined) => {
    if (typeof v === 'string') {
      return v.trim() === '';
    }
    return v !== undefined;
  },
  maxLength: (s: string | undefined, n: number) => {
    if (s === undefined || s.length === undefined) {
      return false;
    }
    return ValidationUtil.getLengthWithUnicodeCharacters(s) <= n;
  },
  minLength: (s: string | undefined, n: number) => {
    if (s === undefined || s.length === undefined) {
      return false;
    }
    return ValidationUtil.getLengthWithUnicodeCharacters(s) >= n;
  },
  prefixUrl: (url: string): string => {
    const prefix = 'http://';
    const prefixedUrl = `${prefix}${url}`;

    if (!/^https?:\/\//i.test(url) && ValidationUtil.validateUrl(prefixedUrl)) {
      return prefixedUrl;
    }
    return url;
  },
  validateUrl: (text: string): boolean => {
    return isUrl(text);
  },
  validateEmail: (text: string): boolean => {
    const regex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regex.test(text);
  },
  validateUsername: (username: string): boolean => {
    const regex = RegExp(/^[a-zA-Z0-9_]{1,28}$/);
    return regex.test(username);
  },
  validatePassword: (password: string): boolean => {
    const regex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    return regex.test(password);
  },
  capitalizeFirstLetter: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  getLengthWithUnicodeCharactersAndAddress: (text: string) => {
  // each user mention is rewritten as a cosmos address on the blockchain
  // rewrite each mention with a cosmos address to
  // calculate final character count on blockchain
    const textWithAddresses = text.replace(/\B@[A-Za-z0-9_]+/g, '@cosmos1w3e82cmgv95kuctrvdex2emfwd68yctjpzp3mr');

    return ValidationUtil.getLengthWithUnicodeCharacters(textWithAddresses);
  },
  getLengthWithUnicodeCharacters: (text: string) => {
    const textWithoutMarkdown = removeMd(text);

    const joiner = '\u{200D}';
    const split = textWithoutMarkdown.split(joiner);
    let count = 0;

    for (const s of split) {
      const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join('')).length;
      count += num;
    }

    return Math.ceil(count / split.length);
  },
  validateCharacterCount: (minSize: number, maxSize: number, text: string, includeAddressLength: boolean): { message: string; color: Color } => {
    const unicodeLength = includeAddressLength ? ValidationUtil.getLengthWithUnicodeCharactersAndAddress(text) :
      ValidationUtil.getLengthWithUnicodeCharacters(text);

    let message, color;
    if (ValidationUtil.maxLength(text, minSize - 1)) {
      message = `${unicodeLength}/${maxSize}`;
      color = Color.RED;
    } else if (ValidationUtil.minLength(text, maxSize + 1)) {
      message = `${unicodeLength}/${maxSize}`;
      color = Color.RED;
    } else {
      message = `${unicodeLength}/${maxSize}`;
      color = Color.GRAY;
    }
    return {
      message,
      color,
    };
  },
};

export default ValidationUtil;
