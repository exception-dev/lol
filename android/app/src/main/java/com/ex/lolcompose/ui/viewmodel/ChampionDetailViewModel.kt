package com.ex.lolcompose.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ex.lolcompose.domain.common.DataResult
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.usecase.GetChampionUseCase
import com.ex.lolcompose.domain.usecase.GetPatchVersionUseCase
import com.ex.lolcompose.ui.state.UiState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChampionDetailViewModel @Inject constructor(
    private val getChampionUseCase: GetChampionUseCase,
    getPatchVersionUseCase: GetPatchVersionUseCase
) : ViewModel() {

    val patchVersion: String = getPatchVersionUseCase()

    private val _uiState = MutableStateFlow<UiState<Champion>>(UiState.Loading)
    val uiState: StateFlow<UiState<Champion>> = _uiState
    private var requestJob: Job? = null
    private var championId: String? = null

    fun getChampionDetail(id: String, forceRefresh: Boolean = false) {
        if (!forceRefresh && championId == id && _uiState.value is UiState.Success) return

        championId = id
        requestJob?.cancel()
        requestJob = viewModelScope.launch {
            _uiState.value = UiState.Loading
            getChampionUseCase(id)
                .collect { result ->
                    _uiState.value = when (result) {
                        is DataResult.Success -> UiState.Success(result.data)
                        is DataResult.Error -> UiState.Error(result.exception)
                    }
                }
        }
    }

    fun retry() {
        championId?.let { getChampionDetail(it, forceRefresh = true) }
    }
}
