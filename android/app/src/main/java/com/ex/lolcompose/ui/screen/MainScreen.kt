package com.ex.lolcompose.ui.screen

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.dimensionResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import coil.compose.AsyncImage
import com.ex.lolcompose.R
import com.ex.lolcompose.domain.common.Constants
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.ui.state.UiState
import com.ex.lolcompose.ui.viewmodel.MainViewModel

@Composable
fun MainScreen(
    viewModel: MainViewModel = hiltViewModel(),
    onChampionClick: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        when (val state = uiState) {
            UiState.Loading -> LoadingContent()
            is UiState.Success -> ChampionGrid(
                champions = state.data,
                onChampionClick = onChampionClick
            )
            is UiState.Error -> ErrorContent(
                exception = state.exception,
                onRetry = viewModel::retry
            )
        }
    }
}

@Composable
private fun ChampionGrid(
    champions: List<Champion>,
    onChampionClick: (String) -> Unit
) {
    if (champions.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text(
                text = stringResource(id = R.string.champion_empty),
                color = Color.White
            )
        }
        return
    }

    LazyVerticalGrid(
        modifier = Modifier.fillMaxSize(),
        columns = GridCells.Fixed(2),
        contentPadding = PaddingValues(
            horizontal = dimensionResource(id = R.dimen.grid_horizontal_margin),
            vertical = dimensionResource(id = R.dimen.grid_vertical_margin)
        ),
        content = {
            itemsIndexed(
                items = champions,
                key = { _, champion -> champion.id }
            ) { index, champion ->
                ChampionItem(index, champion, onChampionClick)
            }
        }
    )
}

@Composable
fun LoadingContent() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
fun ErrorContent(exception: Throwable, onRetry: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = exception.message ?: stringResource(id = R.string.error_unknown),
            color = Color.White,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) {
            Text(text = stringResource(id = R.string.retry))
        }
    }
}

@Composable
fun ChampionItem(
    index: Int,
    champion: Champion,
    onClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val startPadding = if (index % 2 == 1) dimensionResource(id = R.dimen.grid_item_horizontal_padding) / 2 else 0.dp
    val endPadding = if (index % 2 == 0) dimensionResource(id = R.dimen.grid_item_horizontal_padding) / 2 else 0.dp
    
    Card(
        shape = RoundedCornerShape(4.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF40404d)),
        modifier = modifier
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
