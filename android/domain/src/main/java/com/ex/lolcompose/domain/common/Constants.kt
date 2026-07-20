package com.ex.lolcompose.domain.common

object Constants {

    const val FALLBACK_LOL_VERSION = "16.14.1"
    const val DATA_DRAGON_URL = "https://ddragon.leagueoflegends.com/"
    const val BASE_URL = "https://ddragon.leagueoflegends.com/cdn"

    fun getImageUrl(name : String) = "$BASE_URL/img/champion/splash/${name}_0.jpg"

    fun getSpellImageUrl(name: String, patchVersion: String = FALLBACK_LOL_VERSION) =
        "$BASE_URL/$patchVersion/img/spell/$name"

    fun getPassiveImageUrl(name: String, patchVersion: String = FALLBACK_LOL_VERSION) =
        "$BASE_URL/$patchVersion/img/passive/$name"

    fun getSkinImageUrl(name : String, skinNum : Int) = "$BASE_URL/img/champion/loading/${name}_${skinNum}.jpg"
}
