import { describe, expect, it } from 'vitest';
import { installApiCache } from '../../src/api/installApiCache';
import { QUERY_CACHE_CONTEXT_KEY } from '@pastweb/tools/api/createQueryCache/constants';
import type { QueryCache } from '@pastweb/tools';

describe('api installer', () => {
  it('creates a GlobalContext installer for the query cache', () => {
    const queryCache = {} as QueryCache;
    const install = installApiCache({ queryCache });

    expect(install([])).toEqual({
      [QUERY_CACHE_CONTEXT_KEY]: queryCache,
    });
  });
});
