package com.ex.lolcompose.ui.viewmodel

import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.repository.ChampionRepository
import com.ex.lolcompose.domain.usecase.GetChampionListUseCase
import com.ex.lolcompose.ui.state.UiState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.test.UnconfinedTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.io.IOException

@OptIn(ExperimentalCoroutinesApi::class)
class MainViewModelTest {
    private val dispatcher = UnconfinedTestDispatcher()

    @Before
    fun setUp() {
        Dispatchers.setMain(dispatcher)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `successful result is exposed and cached`() = runTest(dispatcher) {
        val champion = Champion(id = "Ahri", name = "아리")
        val repository = CountingChampionRepository(DataResult.Success(listOf(champion)))
        val viewModel = MainViewModel(GetChampionListUseCase(repository))

        val firstState = viewModel.uiState.first { it is UiState.Success }
        val secondState = viewModel.uiState.first { it is UiState.Success }

        assertEquals(listOf(champion), (firstState as UiState.Success).data)
        assertEquals(firstState, secondState)
        assertEquals(1, repository.listRequestCount)
    }

    @Test
    fun `failed result is exposed as an error`() = runTest(dispatcher) {
        val exception = IOException("network unavailable")
        val repository = CountingChampionRepository(DataResult.Error(exception))
        val viewModel = MainViewModel(GetChampionListUseCase(repository))

        val state = viewModel.uiState.first { it is UiState.Error }

        assertTrue(state is UiState.Error)
        assertEquals(exception, (state as UiState.Error).exception)
    }

    private class CountingChampionRepository(
        private val listResult: DataResult<List<Champion>>
    ) : ChampionRepository {
        var listRequestCount = 0
            private set

        override fun getChampionList(): Flow<DataResult<List<Champion>>> = flow {
            listRequestCount++
            emit(listResult)
        }

        override fun getChampion(id: String): Flow<DataResult<Champion>> = flow {
            emit(DataResult.Error(UnsupportedOperationException()))
        }
    }
}
