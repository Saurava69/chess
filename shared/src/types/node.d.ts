// Node.js global types
declare global {
    var Buffer: {
        from(data: string, encoding?: BufferEncoding): Buffer;
        alloc(size: number): Buffer;
        concat(list: Uint8Array[], totalLength?: number): Buffer;
    };
}

// Buffer interface
interface Buffer extends Uint8Array {
    toString(encoding?: BufferEncoding): string;
    write(string: string, offset?: number, length?: number, encoding?: BufferEncoding): number;
    subarray(start?: number, end?: number): Buffer;
    slice(start?: number, end?: number): Buffer;
}

type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";

export {};