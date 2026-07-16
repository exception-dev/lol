package com.ex.lolcompose.data.datasource

import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.model.ChampionInfo
import retrofit2.Response

interface ChampionRemoteDataSource {
    suspend fun getChampionList(): Response<ChampionInfo<Champion>>
    suspend fun getChampion(id: String): Response<ChampionInfo<Champion>>
}
