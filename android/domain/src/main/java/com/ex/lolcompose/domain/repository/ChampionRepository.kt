package com.ex.lolcompose.domain.repository

import com.ex.lolcompose.domain.model.Champion
import kotlinx.coroutines.flow.Flow

interface ChampionRepository {
    fun getChampionList(): Flow<List<Champion>>
    fun getChampion(id: String): Flow<Champion>
}
