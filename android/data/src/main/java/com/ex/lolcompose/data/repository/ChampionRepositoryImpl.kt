package com.ex.lolcompose.data.repository

import com.ex.lolcompose.data.datasource.ChampionRemoteDataSource
import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.repository.ChampionRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

class ChampionRepositoryImpl @Inject constructor(
    private val remoteDataSource: ChampionRemoteDataSource
) : ChampionRepository {

    override fun getChampionList(): Flow<DataResult<List<Champion>>> = flow<DataResult<List<Champion>>> {
        val champions = remoteDataSource.getChampionList()
            .data
            .values
            .sortedBy { it.name }
        emit(DataResult.Success(champions))
    }.catch { exception ->
        emit(DataResult.Error(exception))
    }

    override fun getChampion(id: String): Flow<DataResult<Champion>> = flow<DataResult<Champion>> {
        val champion = remoteDataSource.getChampion(id)
            .data[id]
            ?: throw NoSuchElementException("Champion not found: $id")
        emit(DataResult.Success(champion))
    }.catch { exception ->
        emit(DataResult.Error(exception))
    }
}
