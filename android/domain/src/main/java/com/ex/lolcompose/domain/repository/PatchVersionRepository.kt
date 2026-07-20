package com.ex.lolcompose.domain.repository

interface PatchVersionRepository {
    suspend fun refreshLatestPatchVersion()
    fun getPatchVersion(): String
}
