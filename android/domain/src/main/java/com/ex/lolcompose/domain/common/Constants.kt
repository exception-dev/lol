package com.ex.lolcompose.domain.common

object Constants {

    const val LOL_VERSION = "16.14.1"
    const val BASE_URL = "https://ddragon.leagueoflegends.com/cdn"

    fun getImageUrl(name : String) = "$BASE_URL/img/champion/splash/${name}_0.jpg"

    fun getSpellImageUrl(name: String) = "$BASE_URL/$LOL_VERSION/img/spell/$name"
    fun getPassiveImageUrl(name: String) = "$BASE_URL/$LOL_VERSION/img/passive/$name"
    fun getSkinImageUrl(name : String, skinNum : Int) = "$BASE_URL/img/champion/loading/${name}_${skinNum}.jpg"
}