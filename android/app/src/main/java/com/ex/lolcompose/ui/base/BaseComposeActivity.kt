package com.ex.lolcompose.ui.base

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.viewModels
import com.ex.lolcompose.ui.base.vm.BaseViewModel

open class BaseComposeActivity : ComponentActivity() {

    protected open val viewModel by viewModels<BaseViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

    }

}