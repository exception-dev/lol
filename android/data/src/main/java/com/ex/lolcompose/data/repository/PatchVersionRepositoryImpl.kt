package com.ex.lolcompose.data.repository

import com.ex.lolcompose.data.api.VersionApiService
import com.ex.lolcompose.data.local.PatchVersionStorage
import com.ex.lolcompose.domain.repository.PatchVersionRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject

class PatchVersionRepositoryImpl @Inject constructor(
    private val versionApiService: VersionApiService,
    private val storage: PatchVersionStorage
) : PatchVersionRepository {

    override suspend fun refreshLatestPatchVersion() {
        withContext(Dispatchers.IO) {
            versionApiService.versions()
                .firstOrNull()
                ?.let(storage::savePatchVersion)
        }
    }

    override fun getPatchVersion(): String = storage.getPatchVersion()
}
