package com.ex.lolcompose.domain.model

import org.junit.Assert.assertEquals
import org.junit.Test

class SkinTest {

    @Test
    fun `parent skin distinguishes base skins from chroma variants`() {
        val skins = listOf(
            Skin(id = "266001", num = 1, name = "Justicar", chromas = false),
            Skin(id = "266002", num = 2, name = "Mecha", chromas = true),
            Skin(id = "266004", num = 4, name = "Mecha Obsidian", chromas = false, parentSkin = 2)
        )

        val baseSkins = skins.filter { it.parentSkin == null }

        assertEquals(listOf(1, 2), baseSkins.map { it.num })
    }
}
