package com.ex.lolcompose.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.usecase.GetChampionListUseCase
import com.ex.lolcompose.ui.state.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@OptIn(ExperimentalCoroutinesApi::class)
@HiltViewModel
class MainViewModel @Inject constructor(
    private val getChampionListUseCase: GetChampionListUseCase
) : ViewModel() {
    private val refreshRequests = MutableSharedFlow<Unit>(replay = 1).apply {
        tryEmit(Unit)
    }

    val uiState: StateFlow<UiState<List<Champion>>> = refreshRequests
        .flatMapLatest {
            getChampionListUseCase()
                .map { result ->
                    val state: UiState<List<Champion>> = when (result) {
                        is DataResult.Success -> UiState.Success(result.data)
                        is DataResult.Error -> UiState.Error(result.exception)
                    }
                    state
                }
                .onStart { emit(UiState.Loading) }
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.Lazily,
            initialValue = UiState.Loading
        )

    fun retry() {
        refreshRequests.tryEmit(Unit)
    }
}
