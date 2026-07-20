package com.ex.lolcompose.data.local

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import com.ex.lolcompose.domain.common.Constants
import dagger.hilt.android.qualifiers.ApplicationContext
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PatchVersionStorage @Inject constructor(
    @ApplicationContext context: Context
) {
    private val preferences: SharedPreferences = context.getSharedPreferences(
        PREFERENCES_NAME,
        Context.MODE_PRIVATE
    )

    fun savePatchVersion(version: String) {
        if (version.isBlank()) return

        val cipher = Cipher.getInstance(TRANSFORMATION).apply {
            init(Cipher.ENCRYPT_MODE, getOrCreateSecretKey())
            updateAAD(ASSOCIATED_DATA)
        }
        val encryptedVersion = cipher.doFinal(version.toByteArray(StandardCharsets.UTF_8))

        preferences.edit()
            .putString(KEY_ENCRYPTED_PATCH_VERSION, encryptedVersion.toBase64())
            .putString(KEY_INITIALIZATION_VECTOR, cipher.iv.toBase64())
            .commit()
    }

    fun getPatchVersion(): String = runCatching {
        val encryptedVersion = preferences
            .getString(KEY_ENCRYPTED_PATCH_VERSION, null)
            ?.fromBase64()
            ?: return@runCatching null
        val initializationVector = preferences
            .getString(KEY_INITIALIZATION_VECTOR, null)
            ?.fromBase64()
            ?: return@runCatching null

        val cipher = Cipher.getInstance(TRANSFORMATION).apply {
            init(
                Cipher.DECRYPT_MODE,
                getOrCreateSecretKey(),
                GCMParameterSpec(GCM_TAG_LENGTH_BITS, initializationVector)
            )
            updateAAD(ASSOCIATED_DATA)
        }

        String(cipher.doFinal(encryptedVersion), StandardCharsets.UTF_8)
    }.getOrNull()
        .orEmpty()
        .ifBlank { Constants.FALLBACK_LOL_VERSION }

    private fun getOrCreateSecretKey(): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEY_STORE).apply { load(null) }
        (keyStore.getKey(KEY_ALIAS, null) as? SecretKey)?.let { return it }

        return KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            ANDROID_KEY_STORE
        ).apply {
            init(
                KeyGenParameterSpec.Builder(
                    KEY_ALIAS,
                    KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
                )
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .setKeySize(KEY_SIZE_BITS)
                    .build()
            )
        }.generateKey()
    }

    private fun ByteArray.toBase64(): String = Base64.encodeToString(this, Base64.NO_WRAP)

    private fun String.fromBase64(): ByteArray = Base64.decode(this, Base64.NO_WRAP)

    companion object {
        const val PREFERENCES_NAME = "patch_version_preferences"
        private const val KEY_ENCRYPTED_PATCH_VERSION = "encrypted_patch_version"
        private const val KEY_INITIALIZATION_VECTOR = "patch_version_iv"
        private const val KEY_ALIAS = "lol_patch_version_key"
        private const val ANDROID_KEY_STORE = "AndroidKeyStore"
        private const val TRANSFORMATION = "AES/GCM/NoPadding"
        private const val KEY_SIZE_BITS = 256
        private const val GCM_TAG_LENGTH_BITS = 128
        private val ASSOCIATED_DATA = "lol_patch_version".toByteArray(StandardCharsets.UTF_8)
    }
}
