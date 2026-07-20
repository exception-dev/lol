package com.ex.lolcompose.data.repository

import com.ex.lolcompose.data.datasource.ChampionRemoteDataSource
import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.model.ChampionInfo
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.IOException

class ChampionRepositoryImplTest {

    @Test
    fun `champion list is sorted by name`() = runBlocking {
        val dataSource = FakeChampionRemoteDataSource(
            listResponse = championInfo(
                Champion(id = "Zed", name = "제드"),
                Champion(id = "Ahri", name = "아리")
            )
        )

        val result = ChampionRepositoryImpl(dataSource).getChampionList().first()

        assertTrue(result is DataResult.Success)
        val champions = (result as DataResult.Success).data
        assertEquals(listOf("아리", "제드"), champions.map { it.name })
    }

    @Test
    fun `network exception is returned as an error`() = runBlocking {
        val exception = IOException("network unavailable")
        val dataSource = FakeChampionRemoteDataSource(listException = exception)

        val result = ChampionRepositoryImpl(dataSource).getChampionList().first()

        assertTrue(result is DataResult.Error)
        assertEquals(exception, (result as DataResult.Error).exception)
    }

    @Test
    fun `missing champion is returned as an error`() = runBlocking {
        val dataSource = FakeChampionRemoteDataSource(detailResponse = championInfo())

        val result = ChampionRepositoryImpl(dataSource).getChampion("Unknown").first()

        assertTrue(result is DataResult.Error)
        assertTrue((result as DataResult.Error).exception is NoSuchElementException)
    }

    private fun championInfo(vararg champions: Champion): ChampionInfo<Champion> = ChampionInfo(
        type = "champion",
        version = "test",
        data = champions.associateByTo(mutableMapOf()) { it.id }
    )

    private class FakeChampionRemoteDataSource(
        private val listResponse: ChampionInfo<Champion> = ChampionInfo(
            type = "champion",
            version = "test",
            data = mutableMapOf()
        ),
        private val detailResponse: ChampionInfo<Champion> = listResponse,
        private val listException: Throwable? = null
    ) : ChampionRemoteDataSource {
        override suspend fun getChampionList(): ChampionInfo<Champion> {
            listException?.let { throw it }
            return listResponse
        }

        override suspend fun getChampion(id: String): ChampionInfo<Champion> = detailResponse
    }
}
