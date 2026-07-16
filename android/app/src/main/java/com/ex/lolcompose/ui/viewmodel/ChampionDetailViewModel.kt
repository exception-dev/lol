package com.ex.lolcompose.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.usecase.GetChampionUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChampionDetailViewModel @Inject constructor(
    private val getChampionUseCase: GetChampionUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState

    fun getChampionDetail(id: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            getChampionUseCase(id)
                .catch { e ->
                    _uiState.value = UiState.Error(e)
                }
                .collect { champion ->
                    _uiState.value = UiState.Success(champion)
                }
        }
    }

    sealed class UiState {
        object Loading : UiState()
        data class Success(val champion: Champion) : UiState()
        data class Error(val exception: Throwable) : UiState()
    }
}
