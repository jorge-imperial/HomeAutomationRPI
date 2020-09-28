package com.lawn.irrigation.data

import io.realm.DynamicRealm
import io.realm.FieldAttribute
import io.realm.RealmMigration

// Example migration adding a new class
class DataMigration : RealmMigration {
    override fun migrate(realm: DynamicRealm, oldVersion: Long, newVersion: Long) {
        var oldVersion = oldVersion

        // DynamicRealm exposes an editable schema
        val schema = realm.schema

        // Migrate to version 1: Add a new class.
        // Example:
        // open class Person(
        //     var name: String = "",
        //     var age: Int = 0,
        // ): RealmObject()
        if (oldVersion == 0L) {
            //schema.create("Person")
            //    .addField("name", String::class.java)
            //    .addField("age", Int::class.javaPrimitiveType)
            oldVersion++
        }

        // Migrate to version 2: Add a primary key + object references
        // Example:
        // open class Person(
        //     var name: String = "",
        //     var age: Int = 0,
        //     @PrimaryKey
        //     var id: Int = 0,
        //     var favoriteDog: Dog? = null,
        //     var dogs: RealmList<Dog> = RealmList()
        // ): RealmObject()

        if (oldVersion == 1L) {
            //schema.get("Person")!!
            //    .addField("id", Long::class.javaPrimitiveType, FieldAttribute.PRIMARY_KEY)
            //    .addRealmObjectField("favoriteDog", schema.get("Dog"))
            //    .addRealmListField("dogs", schema.get("Dog"))
            oldVersion++
        }
    }
}