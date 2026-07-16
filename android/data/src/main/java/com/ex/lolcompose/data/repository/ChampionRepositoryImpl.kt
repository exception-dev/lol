package com.ex.lolcompose.data.repository

import com.ex.lolcompose.data.datasource.ChampionRemoteDataSource
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.repository.ChampionRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class ChampionRepositoryImpl @Inject constructor(
    private val remoteDataSource: ChampionRemoteDataSource
) : ChampionRepository {

    override fun getChampionList(): Flow<List<Champion>> = flow {
        val response = remoteDataSource.getChampionList()
        if (response.isSuccessful) {
            val list = response.body()?.data?.values?.toList()?.sortedBy { it.name } ?: emptyList()
            emit(list)
        } else {
            emit(emptyList())
        }
    }

    override fun getChampion(id: String): Flow<Champion> = flow {
        val response = remoteDataSource.getChampion(id)
        if (response.isSuccessful) {
            val champion = response.body()?.data?.values?.firstOrNull()
            champion?.let { emit(it) }
        }
    }
}
