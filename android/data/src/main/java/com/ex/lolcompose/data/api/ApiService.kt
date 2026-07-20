package com.ex.lolcompose.data.api

import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.model.ChampionInfo
import retrofit2.http.GET
import retrofit2.http.Path

interface ApiService {

    @GET("data/ko_KR/champion.json")
    suspend fun championList(): ChampionInfo<Champion>

    @GET("data/ko_KR/champion/{id}.json")
    suspend fun champion(@Path("id") id: String): ChampionInfo<Champion>

}
