// PDF page streams are already compressed; store each PDF unchanged in the ZIP.
const crcTable = Uint32Array.from({ length: 256 }, (_, byte) => {
  for (let bit = 0; bit < 8; bit++) byte = (byte >>> 1) ^ ((byte & 1) ? 0xedb88320 : 0);
  return byte;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

export function createZip() {
  const content = [];
  const directory = [];
  const encoder = new TextEncoder();
  let size = 0;
  let directorySize = 0;

  return {
    add(filename, bytes) {
      const name = encoder.encode(filename);
      const crc = crc32(bytes);
      const local = new DataView(new ArrayBuffer(30 + name.length));
      local.setUint32(0, 0x04034b50, true);
      local.setUint16(4, 20, true);
      local.setUint16(6, 0x0800, true); // UTF-8 filenames
      local.setUint16(12, 33, true); // 1980-01-01, earliest ZIP date
      local.setUint32(14, crc, true);
      local.setUint32(18, bytes.length, true);
      local.setUint32(22, bytes.length, true);
      local.setUint16(26, name.length, true);
      new Uint8Array(local.buffer, 30).set(name);

      const entry = new DataView(new ArrayBuffer(46 + name.length));
      entry.setUint32(0, 0x02014b50, true);
      entry.setUint16(4, 20, true);
      new Uint8Array(entry.buffer, 6, 26).set(new Uint8Array(local.buffer, 4, 26));
      entry.setUint32(42, size, true);
      new Uint8Array(entry.buffer, 46).set(name);
      content.push(local.buffer, bytes);
      directory.push(entry.buffer);
      size += local.byteLength + bytes.length;
      directorySize += entry.byteLength;
    },
    blob() {
      const end = new DataView(new ArrayBuffer(22));
      end.setUint32(0, 0x06054b50, true);
      end.setUint16(8, directory.length, true);
      end.setUint16(10, directory.length, true);
      end.setUint32(12, directorySize, true);
      end.setUint32(16, size, true);
      return new Blob([...content, ...directory, end.buffer], { type: 'application/zip' });
    },
  };
}
