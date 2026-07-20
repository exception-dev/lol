package com.ex.lolcompose.domain.model

data class Skin(
    val id : String,
    val num : Int,
    val name : String,
    val chromas : Boolean,
    val parentSkin : Int? = null
)
