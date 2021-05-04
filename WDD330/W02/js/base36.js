function testParseBigIntBase36() {
  /**
   * Parse string into BigInt in base 36.
   * @param {String} numberString
   * @param {String} keyspace
   * @returns {BigInt}
   */

  function parseBigInt(
    numberString,
    keyspace = "0123456789abcdefghijklmnopqrstuvwxyz"
  ) {
    let result = 0n;
    const keyspaceLength = BigInt(keyspace.length);
    for (let i = 0; i < numberString.length; i++) {
      const value = keyspace.indexOf(numberString[i]);
      if (value === -1) throw new Error("invalid string");
      result = result * keyspaceLength + BigInt(value);
    }
    return result;
  }

  log(parseInt("abcdefg", 36));
  log(parseBigInt("abcdefg"));
  log(parseBigInt("supercalifragilisticexpialidocious"))
}
