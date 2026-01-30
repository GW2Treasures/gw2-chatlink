interface Uint8ArrayConstructor {
  /** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64 */
  static fromBase64?(string: string, options?: { alphabet: 'base64' | 'base64url', lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial' }): Uint8Array<ArrayBuffer>;
}

