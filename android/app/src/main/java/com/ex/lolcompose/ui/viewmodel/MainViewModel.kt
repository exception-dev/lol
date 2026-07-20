package com.ex.lolcompose.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.usecase.GetChampionListUseCase
import com.ex.lolcompose.ui.state.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.onStart
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

@OptIn(ExperimentalCoroutinesApi::class, FlowPreview::class)
@HiltViewModel
class MainViewModel @Inject constructor(
    private val getChampionListUseCase: GetChampionListUseCase
) : ViewModel() {
    private val refreshRequests = MutableSharedFlow<Unit>(replay = 1).apply {
        tryEmit(Unit)
    }

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val debouncedSearchQuery = _searchQuery
        .debounce { query ->
            if (query.isBlank()) 0L else SEARCH_DEBOUNCE_MILLIS
        }
        .distinctUntilChanged()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.Eagerly,
            initialValue = ""
        )

    private val championListState = refreshRequests
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

    val uiState: StateFlow<UiState<List<Champion>>> = combine(
        championListState,
        debouncedSearchQuery
    ) { state, query ->
        if (state is UiState.Success) {
            val normalizedQuery = query.trim()
            UiState.Success(
                if (normalizedQuery.isEmpty()) {
                    state.data
                } else {
                    state.data.filter { champion ->
                        champion.name.contains(normalizedQuery, ignoreCase = true)
                    }
                }
            )
        } else {
            state
        }
    }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.Lazily,
            initialValue = UiState.Loading
        )

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun clearSearchQuery() {
        _searchQuery.value = ""
    }

    fun retry() {
        refreshRequests.tryEmit(Unit)
    }

    private companion object {
        const val SEARCH_DEBOUNCE_MILLIS = 200L
    }
}
