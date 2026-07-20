package com.ex.lolcompose.domain.usecase

import com.ex.lolcompose.domain.repository.PatchVersionRepository
import javax.inject.Inject

class GetPatchVersionUseCase @Inject constructor(
    private val repository: PatchVersionRepository
) {
    operator fun invoke(): String = repository.getPatchVersion()
}
