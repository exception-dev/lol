package com.ex.lolcompose.data.di

import com.ex.lolcompose.data.BuildConfig
import com.ex.lolcompose.data.api.ApiService
import com.ex.lolcompose.data.api.VersionApiService
import com.ex.lolcompose.data.local.PatchVersionStorage
import com.ex.lolcompose.domain.common.Constants
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    private const val CONNECT_TIMEOUT = 20L
    private const val WRITE_TIMEOUT = 20L
    private const val READ_TIMEOUT = 20L

    @Singleton
    @Provides
    fun provideGson() : Gson = GsonBuilder().create()

    @Singleton
    @Provides
    fun provideOkHttpClient() = OkHttpClient.Builder().apply {
        connectTimeout(CONNECT_TIMEOUT, TimeUnit.SECONDS)
        writeTimeout(WRITE_TIMEOUT, TimeUnit.SECONDS)
        readTimeout(READ_TIMEOUT, TimeUnit.SECONDS)

        addInterceptor(HttpLoggingInterceptor().apply {
            if (BuildConfig.DEBUG) {
                level = HttpLoggingInterceptor.Level.BODY
            }
        })
    }.build()

    @Singleton
    @Provides
    fun provideVersionApiService(okHttpClient: OkHttpClient, gson: Gson): VersionApiService =
        Retrofit.Builder().apply {
            baseUrl(Constants.DATA_DRAGON_URL)
            addConverterFactory(GsonConverterFactory.create(gson))
            client(okHttpClient)
        }.build().create(VersionApiService::class.java)

    @Singleton
    @Provides
    fun provideApiService(
        okHttpClient: OkHttpClient,
        gson: Gson,
        patchVersionStorage: PatchVersionStorage
    ): ApiService = Retrofit.Builder().apply {
        baseUrl("${Constants.BASE_URL}/${patchVersionStorage.getPatchVersion()}/")
        addConverterFactory(GsonConverterFactory.create(gson))
        client(okHttpClient)
    }.build().create(ApiService::class.java)
}
