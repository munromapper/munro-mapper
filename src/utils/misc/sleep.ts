// src/utils/misc/sleep.ts
// This file contains a utility function for sleeping/delaying execution

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}