package com.ex.lolcompose.ui.viewmodel

import androidx.lifecycle.ViewModel
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.domain.usecase.GetChampionListUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    getChampionListUseCase: GetChampionListUseCase
) : ViewModel() {
    val list: Flow<List<Champion>> = getChampionListUseCase()
}
