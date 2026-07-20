package com.ex.lolcompose.domain.usecase

import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.repository.ChampionRepository
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class GetChampionListUseCase @Inject constructor(
    private val repository: ChampionRepository
) {
    operator fun invoke(): Flow<DataResult<List<Champion>>> = repository.getChampionList()
}
