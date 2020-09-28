package com.lawn.irrigation.data

import io.realm.RealmObject
import io.realm.annotations.PrimaryKey
import org.bson.types.ObjectId

open class Commands() : RealmObject() {
    @PrimaryKey var _id: ObjectId = ObjectId()
    var _partition: String  = ""
    var timestamp: Long  = 0
    var command: String = ""

}
