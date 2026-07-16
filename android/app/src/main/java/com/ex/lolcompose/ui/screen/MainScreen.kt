package com.ex.lolcompose.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.ex.lolcompose.R
import com.ex.lolcompose.domain.common.Constants
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.ui.viewmodel.MainViewModel

@Composable
fun MainScreen(
    viewModel: MainViewModel = hiltViewModel(),
    onChampionClick: (String) -> Unit
) {
    val championList by viewModel.list.collectAsState(initial = emptyList())
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        LazyVerticalGrid(
            modifier = Modifier.fillMaxSize(),
            columns = GridCells.Fixed(2),
            contentPadding = PaddingValues(
                horizontal = dimensionResource(id = R.dimen.grid_horizontal_margin),
                vertical = dimensionResource(id = R.dimen.grid_vertical_margin)
            ),
            content = {
                itemsIndexed(championList) { index, champion ->
                    ChampionItem(index, champion, onChampionClick)
                }
            }
        )
    }
}

@Composable
fun ChampionItem(index: Int, champion: Champion, onClick: (String) -> Unit) {
    val startPadding = if (index % 2 == 1) dimensionResource(id = R.dimen.grid_item_horizontal_padding) / 2 else 0.dp
    val endPadding = if (index % 2 == 0) dimensionResource(id = R.dimen.grid_item_horizontal_padding) / 2 else 0.dp
    
    Card(
        shape = RoundedCornerShape(4.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF40404d)),
        modifier = Modifier
            .padding(start = startPadding)
            .padding(end = endPadding)
            .padding(bottom = dimensionResource(id = R.dimen.grid_item_vertical_padding)),
        onClick = { onClick(champion.id) }
    ) {
        AsyncImage(
            model = Constants.getImageUrl(champion.id),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(885f / 522f)
        )
        Text(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            text = champion.name,
            fontSize = 14.sp,
            color = Color.White,
            textAlign = TextAlign.Center
        )
    }
}
