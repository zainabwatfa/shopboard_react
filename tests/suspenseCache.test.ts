// Tests for the Suspense promise cache (src/shared/api/suspenseCache.ts).
// use() needs the SAME promise on every render until the data is invalidated,
// and a failed load must stay cached so only "Try again" (invalidate) refetches.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createCache } from "../src/shared/api/suspenseCache.ts";

test("get returns the same promise for the same key until invalidated", () => {
  let calls = 0;
  const cache = createCache((key: number) => {
    calls += 1;
    return Promise.resolve(key * 2);
  });

  assert.equal(cache.get(1), cache.get(1));
  assert.equal(calls, 1);
});

test("invalidate(key) drops only that key, so the next get reloads it", () => {
  let calls = 0;
  const cache = createCache((key: number) => {
    calls += 1;
    return Promise.resolve(key);
  });

  const first = cache.get(1);
  const other = cache.get(2);
  cache.invalidate(1);

  assert.notEqual(cache.get(1), first);
  assert.equal(cache.get(2), other); // 2 is still cached
  assert.equal(calls, 3); // 1, 2, then 1 again
});

test("invalidate() with no key clears every entry", () => {
  let calls = 0;
  const cache = createCache((key: string) => {
    calls += 1;
    return Promise.resolve(key);
  });

  const before = cache.get("x");
  cache.invalidate();

  assert.notEqual(cache.get("x"), before);
  assert.equal(calls, 2);
});

test("a rejected promise stays cached until invalidated", async () => {
  let calls = 0;
  const cache = createCache(() => {
    calls += 1;
    return Promise.reject(new Error("fail"));
  });

  const failed = cache.get("k");
  await assert.rejects(failed);
  assert.equal(cache.get("k"), failed); // reused, no refetch
  assert.equal(calls, 1);

  cache.invalidate("k");
  const retried = cache.get("k");
  assert.notEqual(retried, failed); // fresh attempt after Try again
  assert.equal(calls, 2);
  await assert.rejects(retried); // settle it so there is no unhandled rejection
});
