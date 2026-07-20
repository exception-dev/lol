package com.ex.lolcompose.ui.intro

import android.content.Intent
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.annotation.StringRes
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.lifecycle.lifecycleScope
import com.ex.lolcompose.R
import com.ex.lolcompose.domain.usecase.RefreshLatestPatchVersionUseCase
import com.ex.lolcompose.ui.base.BaseComposeActivity
import com.ex.lolcompose.ui.main.MainActivity
import com.ex.lolcompose.ui.theme.LOLComposeTheme
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.async
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.streams.toList
import javax.inject.Inject

@AndroidEntryPoint
class SplashActivity : BaseComposeActivity() {

    @Inject
    lateinit var refreshLatestPatchVersionUseCase: RefreshLatestPatchVersionUseCase

    private lateinit var patchVersionRefresh: Deferred<Unit>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        patchVersionRefresh = lifecycleScope.async {
            runCatching { refreshLatestPatchVersionUseCase() }
            Unit
        }

        setContent {
            LOLComposeTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Intro(R.string.intro_00){
                        startAppWhenPatchVersionIsReady()
                    }
                }
            }
        }




    }


    private fun startAppWhenPatchVersionIsReady() {
        lifecycleScope.launch {
            patchVersionRefresh.await()
            startApp()
        }
    }

    private fun startApp() {
        val intent = Intent(this@SplashActivity, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
fun String.splitToCodePoints(): List<String> {
    return codePoints()
        .toList()
        .map {
            String(Character.toChars(it))
        }
}

@Composable
fun Intro(@StringRes strId: Int, onAnimationEnd : () -> Unit) {

    var textToDisplay by remember { mutableStateOf("") }

    val textCharsList: List<String> =  stringResource(id = strId).splitToCodePoints()

    LaunchedEffect(strId) {
        for (codePoint in textCharsList) {
            textToDisplay += codePoint
            delay(300)
        }
        onAnimationEnd()
    }

    Text(
        text = textToDisplay,
        modifier = Modifier
            .fillMaxSize()
            .wrapContentHeight(),
        textAlign = TextAlign.Center,
        color = Color.White
    )
}
