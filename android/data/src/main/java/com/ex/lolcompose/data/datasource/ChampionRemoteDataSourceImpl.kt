package com.ex.lolcompose.data.datasource

import com.ex.lolcompose.data.api.ApiService
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.model.ChampionInfo
import retrofit2.Response
import javax.inject.Inject

class ChampionRemoteDataSourceImpl @Inject constructor(
    private val apiService: ApiService
) : ChampionRemoteDataSource {
    override suspend fun getChampionList(): Response<ChampionInfo<Champion>> =
        apiService.championList()

    override suspend fun getChampion(id: String): Response<ChampionInfo<Champion>> =
        apiService.champion(id)
}
