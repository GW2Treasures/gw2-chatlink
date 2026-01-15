# @gw2/chatlink

**@gw2/chatlink** is a modern library to encode and decode Guild Wars 2 chatlinks in all runtimes.

## Installation

Install `@gw2/chatlink` with your favorite package manager, for example:

```
npm install @gw2/chatlink 
```

## Usage

```ts
import { encode, decode, ChatlinkType } from '@gw2/chatlink';

encode(ChatlinkType.Item, { id: 46762, quantity: 10, skin: 5807, upgrades: [24554, 24615] })
// -> '[&AgGqtgDgrxYAAOpfAAAnYAAA]'

decode('[&BtIWAAA=]')
// -> { type: ChatlinkType.Skin, id: 5842 }
```

## License

**@gw2/chatlink** is licensed under the [MIT License](./LICENSE).
