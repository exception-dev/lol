package com.ex.lolcompose.domain.model

data class ChampionInfo<T> (
    val type : String,
    val version : String,
    val data : MutableMap<String,T>
)