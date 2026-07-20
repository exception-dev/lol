package com.ex.lolcompose.domain.usecase

import com.ex.lolcompose.domain.repository.PatchVersionRepository
import javax.inject.Inject

class RefreshLatestPatchVersionUseCase @Inject constructor(
    private val repository: PatchVersionRepository
) {
    suspend operator fun invoke() = repository.refreshLatestPatchVersion()
}
