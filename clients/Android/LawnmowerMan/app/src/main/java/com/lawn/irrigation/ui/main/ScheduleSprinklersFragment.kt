package com.lawn.irrigation.ui.main

import android.os.Bundle
import android.os.SystemClock
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Chronometer
import android.widget.SeekBar
import androidx.fragment.app.Fragment
import com.lawn.irrigation.R
import kotlinx.android.synthetic.main.fragment_schedule.*

class ScheduleSprinklersFragment : Fragment() {

    private var chrono1 : Chronometer? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // Inflate the layout for this fragment
        return inflater!!.inflate(R.layout.fragment_schedule, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)



    }
}