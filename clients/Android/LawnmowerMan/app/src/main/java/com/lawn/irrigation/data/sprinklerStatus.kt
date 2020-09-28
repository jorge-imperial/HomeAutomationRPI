package com.lawn.irrigation.data

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey



//open class Status( _zone_id: String = "000000", _timestamp: String = "" ) : RealmObject() {
open class Status() : RealmObject() {
    @PrimaryKey var _id: String = ""
    var _partition: String  = ""
    var timestamp: Long  = 0
    var relays: String = ""
}
