package com.lawn.irrigation.ui.main

import android.os.Build
import android.os.Bundle
import android.os.SystemClock
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SeekBar
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import com.lawn.irrigation.R
import com.lawn.irrigation.data.Commands
import com.lawn.irrigation.data.Status
import io.realm.Realm
import io.realm.RealmObjectChangeListener
import io.realm.kotlin.createObject
import io.realm.kotlin.where
import kotlinx.android.synthetic.main.fragment_start_stop.*
import org.bson.types.ObjectId

import org.json.JSONObject



class StartStopSprinklersFragment : Fragment()  {

    private val maxTime = 15*60
    private val minTime = 0
    private val initialProgress = maxTime/2
    private val barAnimationSec = 5

    private lateinit var statusListener: RealmObjectChangeListener<Status>
    private lateinit var currentSprinklerStatus : Status


    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        super.onViewCreated(view, savedInstanceState)

        val bars = arrayOf (progressSprinkler1, progressSprinkler2, progressSprinkler3, progressSprinkler4)
        val timers = arrayOf(sprinkler_timer1,sprinkler_timer2,sprinkler_timer3,sprinkler_timer4)
        val buttons = arrayOf(toggleSprinkler1,toggleSprinkler2,toggleSprinkler3,toggleSprinkler4)

        // --------------------------------------------------------------------
        // This might not be neccesary.
        val refreshButton = refresh_status
        refreshButton.setOnClickListener() {
            val realm = Realm.getDefaultInstance()

            // TODO: We only need the last status, not the whole collection...
            val results = realm.where<Status>().findAll()

            if (results.size >0) {
                val relaysStatus: String? = results[0]?.relays

                if (relaysStatus != null) {
                    updateStatus(relaysStatus)
                }
            }
        }

        for ((i,p) in bars.withIndex()) {
            p.min = minTime
            p.max = maxTime
            p.progress = initialProgress

            p.setOnSeekBarChangeListener(object: SeekBar.OnSeekBarChangeListener{
                override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                    if (fromUser)
                       timers[i].base = SystemClock.elapsedRealtime() + (1000*progress)
                }
                override fun onStartTrackingTouch(seekBar: SeekBar?) {}
                override fun onStopTrackingTouch(seekBar: SeekBar?) {}
            })
        }

        for ((i, t) in timers.withIndex()) {
            t.base = SystemClock.elapsedRealtime() + (initialProgress*1000)
            t.isCountDown = true
            t.setOnChronometerTickListener {
                val elapsedMillis: Long =  SystemClock.elapsedRealtime() - it.base

                val elapsedSec = -elapsedMillis/1000
                val remainder =   elapsedSec % barAnimationSec

                Log.d("ELAPSED ", "Time: $elapsedMillis   $elapsedSec    $remainder")

                if (remainder ==0L) {
                    if (buttons[i].isChecked) { // running!
                        val n = bars[i].progress - barAnimationSec
                        Log.d("PROG ", "prog ->$n")
                        bars[i].setProgress(n, true)
                        if (elapsedSec == 0L) {
                            Log.d("PROG", "Stopping")
                            buttons[i].isChecked = false
                            it.stop()
                            sendStopCommand(i)
                        }
                    }
                }
            }
        }

        for ((i, toggle) in buttons.withIndex()) {
            toggle.setOnClickListener {
                if (toggle.isChecked) {
                    timers[i].base =
                        SystemClock.elapsedRealtime() + (bars[i].progress * 1000)

                    sendStartCommand(i)
                    timers[i].start()
                }
                else {
                    sendStopCommand(i)
                    timers[i].stop()
                }
            }
        }

        // Add a listener for changes
        val realm = Realm.getDefaultInstance()
        val results = realm.where<Status>().findAll()

        if (results != null && results.size>0) {
            currentSprinklerStatus = results[0]!!

            statusListener = RealmObjectChangeListener { currentSprinklerStatus, changeSet ->
                if (changeSet != null) {

                    for (fieldName in changeSet.getChangedFields()) {
                        // "Field '$fieldName' changed."
                        Log.d("CHANGE", fieldName)
                        if (fieldName == "relays") {
                            Log.d("CHANGE", "Relay status changed!!!" + currentSprinklerStatus.relays)
                        }
                    }
                }
            }

            // Observe object notifications.
            currentSprinklerStatus.addChangeListener(statusListener)
        }
    }


    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_start_stop, container, false)
    }


    private fun updateStatus(relaysStatus :String ) {
        val jsonObject = JSONObject( relaysStatus )
        val relays = jsonObject.getJSONArray("relays")
        for (i in 0 until relays!!.length()) {
            // TODO: What do we do with the status?
            val relay = relays.getJSONObject(i).getString("state")
        }
    }

    private fun sendStartCommand(relay: Int ) {
        sendCommand(relay, 1)
    }


    private fun sendStopCommand(relay: Int) {
        sendCommand(relay, 0)
    }


    private fun sendCommand(relay: Int, state: Int) {
        val cmd =  "{ \"set\" : { \"relay\": $relay, \"state\": $state  } }"
        Log.d("COMMAND", cmd)

        val realm = Realm.getDefaultInstance()
        realm.executeTransaction{ realm ->
            val primaryKeyValue = ObjectId.get()
            val c = realm.createObject<Commands>(primaryKeyValue)
            c._partition = "00000000"
            c.command = cmd
            c.timestamp = System.currentTimeMillis()
        }
    }
}