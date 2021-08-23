package com.zbaymobile

import android.content.Context
import android.content.SharedPreferences
import com.zbaymobile.Utils.Const.SHARED_PREFERENCES


class Prefs(val context: Context) {

    private val ONION_PRIV_KEY = "onion.priv.key"

    private val preferences = getSharedPrefs(context)

    private fun getSharedPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(
            SHARED_PREFERENCES,
            Context.MODE_PRIVATE
        )
    }

    var onionPrivKey: String?
        get() = preferences.getString(ONION_PRIV_KEY, "NEW:BEST")
        set(value) = preferences.edit().putString(ONION_PRIV_KEY, value).apply()

}
