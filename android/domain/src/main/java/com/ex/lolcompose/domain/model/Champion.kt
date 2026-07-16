package com.ex.lolcompose.domain.model

data class Champion(
    val id : String = "",
    val name : String = "",
    val title : String = "",
    val lore : String = "",
    val tags : List<String>? = null,
    val skins : List<Skin>? = null,
    val spells : List<Spell>? = null,
    val passive : Passive? = null
)
