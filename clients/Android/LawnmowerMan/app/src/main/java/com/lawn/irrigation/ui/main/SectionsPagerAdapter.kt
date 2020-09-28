package com.lawn.tabbed.ui.main

import android.content.Context
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentPagerAdapter

import com.lawn.irrigation.ui.main.ScheduleSprinklersFragment

import com.lawn.irrigation.ui.main.StartStopSprinklersFragment


/**
 * A [FragmentPagerAdapter] that returns a fragment corresponding to
 * one of the sections/tabs/pages.
 */
class SectionsPagerAdapter(private val context: Context, fm: FragmentManager)
    : FragmentPagerAdapter(fm) {

    override fun getItem(position: Int): Fragment {
        // getItem is called to instantiate the fragment for the given page.
        // Return a PlaceholderFragment (defined as a static inner class below).
        //return PlaceholderFragment.newInstance(position + 1)
        return when (position) {
            0-> {
                StartStopSprinklersFragment()
            }
            else -> {
                ScheduleSprinklersFragment()
            }
        }
    }

    override fun getPageTitle(position: Int): CharSequence? {
        return when (position) {
            0 -> {
                "Start/Stop sprinklers"
            }
            else -> {
                "Schedule sprinklers"
            }
        }
    }

    override fun getCount(): Int {
        // Show 2 total pages.
        return 2
    }
}