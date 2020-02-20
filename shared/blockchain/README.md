# Blockchain

This module provides the blockchain API to the mobile client application. It consumes the TruChain JSON API over HTTP(S), and exports relevant types.

## `class Account`

`Account` is an identified user that may make publish blockchain transactions from the device.

## `class TruChain`

`TruChain` exports all blockchain functionality to the mobile client. It provides facilities for registering keys, publishing messages, and making GraphQL queries.

## Performing generic functions

### Generating/registering a keypair

```ts
import {
  Account,
  RegistrationResponse,
  TruChain,
} from '../blockchain';

const privateKeyHex = Account.generatePrivateKey();
const pubkeyHex = Account.pubkeyFromPrivate(privateKeyHex);
const response = await TruChain.Local.register({
  pubkey: pubkeyHex,
  name: 'Test User',
});
```

### Constructing an `Account`

```ts
const {
  address,
  account_number,
  sequence
} = <RegistrationResponse>response;

const a = new Account({
  chainId: 'test-chain-jpxzxG', // your chainId here
  accountNumber: account_number,
  address,
  sequence,
  privateKeyHex,
});

const Chain = new TruChain({account: a}); // Points to 0.0.0.0:1337 by default
```

### Publishing a message

```ts
// from src/blockchain/truchain.ts
async function submitStory({body, categoryId}: SubmitStory): Promise<number|Error> {
  try {
    const response = await this.publish<SubmitStoryResponse>({
      type: 'SubmitStoryMsg',
      body: {
        creator: (this.account || {address: ''}).address,
        category_id: categoryId,
        kind: 0,
        body,
      },
    });

    return (<SubmitStoryResponse>response).id;
  } catch (err) {
    return <Error>err;
  }
}
```

### Making a GraphQL query

```ts
interface MyExpectedResponseType {
  stories: []object;
}

const result = Chain.queryGraphQL<MyExpectedResponseType>(`query {
  stories(categoryID: $categoryID) {
    creator,
    body
  }
}`, {categoryID: '1'});
```

## Performing domain-specific functions

The domain-specific `TruChain` methods just wrap the above generic ones. Below, you'll find usage examples of the domain-level methods (see `src/blockchain/truchain.ts` for the full set of supported functions).

### Submitting a story

```ts
async function submitStory({body, categoryId}: {body: string, categoryId: number}): Promise<number> {
  const storyId: number | Error = await Chain.submitStory({body, categoryId});

  if (storyId instanceof Error) {
    throw storyId;
  } else {
    return <number>storyId;
  }
}
```

### Querying for stories

```ts
import { CategoryStories, StoryStub } from '../blockchain';

async function categoryStories(categoryId: number): Promise<StoryStub[]> {
  const response: CategoryStories | Error = await Chain.categoryStories(categoryId);

  if (response instanceof Error) {
    throw response;
  }

  return response.stories;
}
```