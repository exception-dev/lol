package com.ex.lolcompose.data.di

import com.ex.lolcompose.data.datasource.ChampionRemoteDataSource
import com.ex.lolcompose.data.datasource.ChampionRemoteDataSourceImpl
import com.ex.lolcompose.data.repository.ChampionRepositoryImpl
import com.ex.lolcompose.domain.repository.ChampionRepository
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {

    @Binds
    @Singleton
    abstract fun bindChampionRepository(
        championRepositoryImpl: ChampionRepositoryImpl
    ): ChampionRepository

    @Binds
    @Singleton
    abstract fun bindChampionRemoteDataSource(
        championRemoteDataSourceImpl: ChampionRemoteDataSourceImpl
    ): ChampionRemoteDataSource
}
