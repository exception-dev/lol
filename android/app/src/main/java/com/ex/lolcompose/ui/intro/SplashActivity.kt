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
import com.ex.lolcompose.R
import com.ex.lolcompose.ui.base.BaseComposeActivity
import com.ex.lolcompose.ui.main.MainActivity
import com.ex.lolcompose.ui.theme.LOLComposeTheme
import kotlinx.coroutines.delay
import kotlin.streams.toList

class SplashActivity : BaseComposeActivity() {

    companion object{
        private const val DELAY = 1500L
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            LOLComposeTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Intro(R.string.intro_00){
                        startApp()
                    }
                }
            }
        }




    }


    private fun startApp(){
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