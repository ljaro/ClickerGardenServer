'use strict';


class ChunkProcessor {
    static initProcessChunk(store) {
        store.sizeBufLen = 1;
        store.sizeBuf = Buffer.alloc(store.sizeBufLen);
        store.sizeBufOffset = 0;
        store.buffer = undefined;
        store.bufferLen = 0;
        store.bufferOffset = 0;

        store.bufferLimit = 1000;
    }

    static processChunk (store, chunk, callback) {
        if(chunk.length === 0)
            return;

        let currentOffset = 0;

        while(currentOffset < chunk.length) {
            if(store.buffer) {
                const size = Math.min(store.bufferLen - store.bufferOffset, chunk.length - currentOffset);
                chunk.copy(
                    store.buffer,
                    store.bufferOffset,
                    currentOffset,
                    currentOffset + size);
                store.bufferOffset += size;
                currentOffset += size;
            } else {
                const size = Math.min(store.sizeBufLen - store.bufferOffset, chunk.length - currentOffset);
                chunk.copy(
                    store.sizeBuf,
                    store.sizeBufOffset,
                    currentOffset,
                    currentOffset + size)

                store.sizeBufOffset += size;
                currentOffset += size;

                if(store.sizeBufOffset == store.sizeBufLen) {
                    store.bufferLen = Math.min(store.bufferLimit, store.sizeBuf.readUInt8());
                    store.bufferOffset = 0;
                    if(store.bufferLen > 0) {
                        store.buffer = Buffer.alloc(store.bufferLen);
                    } else {
                        store.sizeBufOffset = 0;
                    }
                }
            }

            if(store.buffer && store.bufferOffset === store.bufferLen) {
                callback(Buffer.from(store.buffer));

                store.sizeBuf = Buffer.alloc(store.sizeBufLen);
                store.sizeBufOffset = 0;
                store.buffer = undefined;
                store.bufferLen = 0;
                store.bufferOffset = 0;
            }
        }
    }

}

exports.ChunkProcessor = ChunkProcessor;