package com.ex.lolcompose.domain.repository

import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import kotlinx.coroutines.flow.Flow

interface ChampionRepository {
    fun getChampionList(): Flow<DataResult<List<Champion>>>
    fun getChampion(id: String): Flow<DataResult<Champion>>
}
