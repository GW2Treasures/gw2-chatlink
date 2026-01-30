# @gw2/chatlink

**@gw2/chatlink** is a modern library to encode and decode Guild Wars 2 chatlinks in all modern runtimes.

## Installation

Install `@gw2/chatlink` with your favorite package manager, for example:

```
npm install @gw2/chatlink 
```

## Usage

```ts
import { encodeChatlink, decodeChatlink, ChatlinkType } from '@gw2/chatlink';

encodeChatlink(ChatlinkType.Item, { itemId: 46762, quantity: 1, skin: 3709 })
// "[&AgGqtgCAfQ4AAA==]"

decodeChatlink('[&BtIWAAA=]')
// "{ type: ChatlinkType.Skin, id: 5842 }"
```

## License

**@gw2/chatlink** is licensed under the [MIT License](./LICENSE).
