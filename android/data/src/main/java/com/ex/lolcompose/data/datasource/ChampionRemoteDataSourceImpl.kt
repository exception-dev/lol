package com.ex.lolcompose.data.datasource

import com.ex.lolcompose.data.api.ApiService
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.model.ChampionInfo
import javax.inject.Inject

class ChampionRemoteDataSourceImpl @Inject constructor(
    private val apiService: ApiService
) : ChampionRemoteDataSource {
    override suspend fun getChampionList(): ChampionInfo<Champion> =
        apiService.championList()

    override suspend fun getChampion(id: String): ChampionInfo<Champion> =
        apiService.champion(id)
}
