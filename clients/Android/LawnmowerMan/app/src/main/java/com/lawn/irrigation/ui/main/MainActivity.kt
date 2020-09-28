package com.lawn.irrigation.ui.main

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.MenuItem
import androidx.annotation.RequiresApi
import com.google.android.material.tabs.TabLayout
import androidx.viewpager.widget.ViewPager
import androidx.appcompat.app.AppCompatActivity
import com.lawn.irrigation.R
import com.lawn.irrigation.irrigationApp
import com.lawn.irrigation.ui.login.LoginActivity
import com.lawn.irrigation.TAG
import com.lawn.tabbed.ui.main.SectionsPagerAdapter
import io.realm.Realm
import io.realm.mongodb.User
import io.realm.mongodb.sync.SyncConfiguration

class MainActivity : AppCompatActivity() {

    private lateinit var realm: Realm
    private var user: User? = null

    override fun onStart() {
        super.onStart()
        try {
            user = irrigationApp.currentUser()
        } catch (e: IllegalStateException) {
            Log.w(TAG(), e)
        }
        if (user == null) {
            // if no user is currently logged in, start the login activity so the user can authenticate
            startActivity(Intent(this, LoginActivity::class.java))
        }
        else {
            // configure realm to use the current user and the partition corresponding to "My Project"
            val user : User? = irrigationApp.currentUser()
            val partitionValue : String = "00000000"
            val config = SyncConfiguration.Builder(user!!, partitionValue).build()
            realm = Realm.getInstance(config)

            // save this configuration as the default for this entire app so other activities and threads can open their own realm instances
            Realm.setDefaultConfiguration(config)

            //val results = realm.where<Status>().findAll()

            // Sync all realm changes via a new instance, and when that instance has been successfully created connect it to an on-screen list (a recycler view)
            Realm.getInstanceAsync(config, object: Realm.Callback() {
                override fun onSuccess(realm: Realm) {
                    // since this realm should live exactly as long as this activity, assign the realm to a member variable
                    this@MainActivity.realm = realm

                }
            })
        }
    }
    override fun onStop() {
        super.onStop()
        user.run {
            realm.close()
        }
    }


    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // default instance uses the configuration created in the login activity
        realm = Realm.getDefaultInstance()

        val sectionsPagerAdapter = SectionsPagerAdapter(this, supportFragmentManager)
        val viewPager: ViewPager = findViewById(R.id.view_pager)
        viewPager.adapter = sectionsPagerAdapter
        val tabs: TabLayout = findViewById(R.id.tabs)
        tabs.setupWithViewPager(viewPager)

    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.activity_main_menu, menu)
        return true
    }


    override fun
            onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_logout -> {
                user?.logOutAsync {
                    if (it.isSuccess) {
                        // always close the realm when finished interacting to free up resources
                        realm.close()
                        user = null
                        Log.v(TAG(), "user logged out")
                        startActivity(Intent(this, LoginActivity::class.java))
                    } else {
                        Log.e(TAG(), "log out failed! Error: ${it.error}")
                    }
                }
                true
            }
            else -> {
                super.onOptionsItemSelected(item)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        // if a user hasn't logged out when the activity exits, still need to explicitly close the realm
        realm.close()
    }

}

