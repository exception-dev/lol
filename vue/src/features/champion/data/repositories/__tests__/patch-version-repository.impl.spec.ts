import { describe, expect, it, vi } from 'vitest'

import type { PatchVersionLocalDataSource } from '@/features/champion/data/datasources/patch-version-local-data-source'
import type { PatchVersionRemoteDataSource } from '@/features/champion/data/datasources/patch-version-remote-data-source'
import { ResilientPatchVersionRepository } from '@/features/champion/data/repositories/patch-version-repository.impl'

describe('ResilientPatchVersionRepository', () => {
  it('stores and returns the latest remote version', async () => {
    const writeVersion = vi.fn<(version: string) => void>()
    const remote: PatchVersionRemoteDataSource = {
      fetchLatestVersion: async () => '16.15.1',
    }
    const local: PatchVersionLocalDataSource = {
      readVersion: () => null,
      writeVersion,
    }

    const repository = new ResilientPatchVersionRepository(remote, local)

    await expect(repository.resolveLatestVersion()).resolves.toBe('16.15.1')
    expect(writeVersion).toHaveBeenCalledWith('16.15.1')
  })

  it('uses the stored version when the network fails', async () => {
    const remote: PatchVersionRemoteDataSource = {
      fetchLatestVersion: async () => Promise.reject(new Error('offline')),
    }
    const local: PatchVersionLocalDataSource = {
      readVersion: () => '16.13.1',
      writeVersion: () => undefined,
    }

    const repository = new ResilientPatchVersionRepository(remote, local)

    await expect(repository.resolveLatestVersion()).resolves.toBe('16.13.1')
  })
})
