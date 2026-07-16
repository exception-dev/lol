package com.ex.lolcompose.ui.main

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.SystemBarStyle
import android.graphics.Color as AndroidColor
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.ex.lolcompose.ui.screen.DetailScreen
import com.ex.lolcompose.ui.screen.MainScreen
import com.ex.lolcompose.ui.theme.LOLComposeTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(AndroidColor.TRANSPARENT)
        )
        setContent {
            LOLComposeTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    LOLApp(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun LOLApp(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "main",
        modifier = modifier
    ) {
        composable("main") {
            MainScreen(
                onChampionClick = { championId ->
                    navController.navigate("detail/$championId")
                }
            )
        }
        composable(
            route = "detail/{championId}",
            arguments = listOf(navArgument("championId") { type = NavType.StringType })
        ) { backStackEntry ->
            val championId = backStackEntry.arguments?.getString("championId") ?: ""
            DetailScreen(
                championId = championId,
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
