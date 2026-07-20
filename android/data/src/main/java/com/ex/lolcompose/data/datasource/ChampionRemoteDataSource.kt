package com.ex.lolcompose.data.datasource

import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.model.ChampionInfo

interface ChampionRemoteDataSource {
    suspend fun getChampionList(): ChampionInfo<Champion>
    suspend fun getChampion(id: String): ChampionInfo<Champion>
}
