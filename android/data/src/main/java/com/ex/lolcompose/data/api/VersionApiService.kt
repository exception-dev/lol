package com.ex.lolcompose.data.api

import retrofit2.http.GET

interface VersionApiService {
    @GET("api/versions.json")
    suspend fun versions(): List<String>
}
