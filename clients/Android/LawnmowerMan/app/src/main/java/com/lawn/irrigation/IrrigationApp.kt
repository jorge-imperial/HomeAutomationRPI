package com.lawn.irrigation

import android.app.Application
import android.util.Log
import com.lawn.irrigation.data.DataMigration
import io.realm.Realm
import io.realm.RealmConfiguration
import io.realm.mongodb.App
import io.realm.mongodb.AppConfiguration

lateinit var irrigationApp: App

inline fun <reified T> T.TAG(): String = T::class.java.simpleName

class IrrigationApp : Application() {

    override fun onCreate() {
        super.onCreate()

        Realm.init(this)

        val appCfg = AppConfiguration.Builder("garden-oybkr").build()
        irrigationApp = App( appCfg )

        val realmConfig = RealmConfiguration.Builder()
            //.name("samwise.realm")
            //.schemaVersion(1)
            .deleteRealmIfMigrationNeeded() // .migration( DataMigration())
            .build()

        Realm.setDefaultConfiguration(realmConfig)

        Log.v(TAG(), "Initialized the Realm App configuration for: ${irrigationApp.configuration.appId}")
    }
}
