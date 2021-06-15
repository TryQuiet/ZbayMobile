package com.zbaymobile

import android.app.ActivityManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Build
import android.os.IBinder
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.zbaymobile.Utils.Const.SERVICE_ACTION_EXECUTE
import com.zbaymobile.Utils.Utils.getOutput


class Integrator(private val context: ReactContext): ReactContextBaseJavaModule(), WaggleService.Callbacks {

    private var waggleService: WaggleService? = null

    override fun getName(): String {
        return "Integrator"
    }

    @ReactMethod
    fun initAndroidServices() {

        val service = Intent(context, WaggleService::class.java)
            service.action = SERVICE_ACTION_EXECUTE

        if(!isMyServiceRunning(WaggleService::class.java)) {
            Log.i("Tor Service", "Starting new service")
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(service)
            } else {
                context.startService(service)
            }
        }

        val serviceConnection = object: ServiceConnection {
            override fun onServiceConnected(p0: ComponentName?, binder: IBinder?) {
                waggleService = (binder as WaggleService.LocalBinder).getService()
                waggleService?.bindClient(this@Integrator)
            }

            override fun onServiceDisconnected(p0: ComponentName?) {
                waggleService?.unbindClient()
            }
        }

        context.bindService(service, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    override fun onTorInit() {
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onTorInit", true)
    }

    override fun onOnionAdded() {
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onOnionAdded", true)
    }

    override fun onWaggleProcessStarted(process: Process?) {
        if(process != null) {
            context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onWaggleStarted", true)

            getOutput(process)
        }
    }

    private fun isMyServiceRunning(serviceClass: Class<*>): Boolean {
        val manager: ActivityManager? =
            context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager?
        for (service in manager?.getRunningServices(Int.MAX_VALUE)!!) {
            if (serviceClass.name == service.service.className) {
                return true
            }
        }
        return false
    }
}
