package com.ex.lolcompose.ui.screen

import android.annotation.SuppressLint
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.util.lerp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.AsyncImage
import com.ex.lolcompose.R
import com.ex.lolcompose.domain.common.Constants
import com.ex.lolcompose.domain.model.Champion
import com.ex.lolcompose.ui.state.UiState
import com.ex.lolcompose.ui.viewmodel.ChampionDetailViewModel
import kotlin.math.absoluteValue
import androidx.compose.ui.platform.LocalResources

@Composable
fun DetailScreen(
    championId: String,
    viewModel: ChampionDetailViewModel = hiltViewModel(),
    onBackClick: () -> Unit
) {
    LaunchedEffect(championId) {
        viewModel.getChampionDetail(championId)
    }

    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        when (val state = uiState) {
            UiState.Loading -> LoadingContent()
            is UiState.Success -> DetailContent(
                champion = state.data,
                patchVersion = viewModel.patchVersion
            )
            is UiState.Error -> ErrorContent(
                exception = state.exception,
                onRetry = viewModel::retry
            )
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun DetailContent(champion: Champion, patchVersion: String) {
    Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
        AsyncImage(
            model = Constants.getImageUrl(champion.id),
            contentDescription = null,
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(885f / 522f)
        )

        Spacer(modifier = Modifier.height(20.dp))

        val textModifier = Modifier.padding(horizontal = 8.dp)

        Text(
            text = champion.name,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            modifier = textModifier
        )

        val tags = champion.tags
        if (!tags.isNullOrEmpty()) {
            Spacer(modifier = Modifier.height(10.dp))
            FlowRow(modifier = Modifier.padding(8.dp)) {
                tags.forEach { tag ->
                    Text(
                        text = tag,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier
                            .background(
                                color = Color(0xFFFF0000),
                                shape = RoundedCornerShape(28.dp)
                            )
                            .padding(8.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        Text(
            text = champion.title,
            fontSize = 14.sp,
            color = Color.White,
            modifier = textModifier
        )

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = champion.lore,
            fontSize = 12.sp,
            color = Color.White,
            lineHeight = 16.sp,
            modifier = textModifier
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        SkillInfoLayout(champion, patchVersion)

        SkinLayout(champion)
        
        Spacer(modifier = Modifier.height(40.dp))
    }
}

@SuppressLint("DiscouragedApi")
@Composable
fun SkillInfoLayout(champion: Champion, patchVersion: String) {
    Column(modifier = Modifier.padding(8.dp)) {
        champion.passive?.let {
            SkillInfo(
                title = stringResource(id = R.string.champion_00),
                titleModifier = Modifier
                    .background(color = Color(0xFF2166F3), shape = RoundedCornerShape(16.dp))
                    .padding(horizontal = 8.dp, vertical = 2.dp),
                name = it.name,
                description = it.description,
                imgUrl = Constants.getPassiveImageUrl(it.image.full, patchVersion)
            )
        }

        champion.spells?.forEachIndexed { index, spell ->
            val titleId = LocalResources.current.getIdentifier(
                "champion_spell_$index", "string", LocalContext.current.packageName
            )
            val title = if (titleId != 0) stringResource(id = titleId) else ""
            
            var description = spell.description
            if (spell.tooltip.isNotEmpty()) {
                description += "\n\n${spell.tooltip}"
            }

            SkillInfo(
                title = title,
                titleModifier = Modifier
                    .size(20.dp)
                    .background(color = Color(0xFF2166F3), shape = CircleShape)
                    .wrapContentHeight(),
                name = spell.name,
                description = description,
                imgUrl = Constants.getSpellImageUrl(spell.image.full, patchVersion)
            )
        }
    }
}

@Composable
fun SkillInfo(title: String, titleModifier: Modifier, name: String, description: String, imgUrl: String) {
    Row(modifier = Modifier.padding(vertical = 12.dp)) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            AsyncImage(model = imgUrl, contentDescription = null, modifier = Modifier.size(50.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                color = Color.White,
                modifier = titleModifier,
                textAlign = TextAlign.Center,
                fontSize = 10.sp
            )
        }

        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(text = name, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = description, color = Color.LightGray, fontSize = 12.sp, lineHeight = 16.sp)
        }
    }
}

@Composable
fun SkinLayout(champion: Champion) {
    println("champion.skins : ${champion.skins}")
    val skins = champion.skins.orEmpty().filter { it.parentSkin == null }
    if (skins.isNotEmpty()) {
        Spacer(modifier = Modifier.height(20.dp))
        val pagerState = rememberPagerState(pageCount = { skins.size })
        
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = 64.dp)
        ) { page ->
            val skin = skins[page]
            Card(
                modifier = Modifier
                    .graphicsLayer {
                        val pageOffset = ((pagerState.currentPage - page) + pagerState.currentPageOffsetFraction).absoluteValue
                        lerp(start = 0.85f, stop = 1f, fraction = 1f - pageOffset.coerceIn(0f, 1f)).also { scale ->
                            scaleX = scale
                            scaleY = scale
                        }
                        alpha = lerp(start = 0.5f, stop = 1f, fraction = 1f - pageOffset.coerceIn(0f, 1f))
                    }
                    .fillMaxWidth()
                    .aspectRatio(308f / 560f),
                shape = RoundedCornerShape(8.dp)
            ) {
                Box {
                    AsyncImage(
                        model = Constants.getSkinImageUrl(champion.id, skin.num),
                        contentDescription = null,
                        modifier = Modifier.fillMaxSize()
                    )
                    Text(
                        text = skin.name,
                        fontSize = 12.sp,
                        color = Color.White,
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0x80000000))
                            .padding(vertical = 8.dp)
                            .align(Alignment.BottomCenter),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}
