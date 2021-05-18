package com.zbaymobile

import android.os.Bundle
import android.os.Handler
import android.os.ResultReceiver

class TorResultReceiver(handler: Handler?) : ResultReceiver(handler) {
    private var receiver: Receiver? = null

    interface Receiver {
        fun onOnionAdded(data: Bundle)
    }

    fun setReceiver(_receiver: Receiver?) {
        receiver = _receiver
    }

    override fun onReceiveResult(resultCode: Int, resultData: Bundle) {
        if (receiver != null) {
            if(resultCode == 0) {
                receiver!!.onOnionAdded(resultData)
            }
        }
    }
}
