package com.zbaymobile

import android.app.ActivityManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.zbaymobile.Utils.Const.SERVICE_ACTION_EXECUTE
import com.zbaymobile.Utils.Utils.getOutput


class Integrator(private val context: ReactContext): ReactContextBaseJavaModule(), WaggleService.Callbacks, NodeJSService.Callbacks {

    private val prefs =
        (context.applicationContext as MainApplication)
            .sharedPrefs

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

                val service = (binder as WaggleService.LocalBinder).getService()
                service.registerClient(this@Integrator)
                /**
                 * onServiceConnected is being called every time client bind to running Service (even just after starting a new one)
                 * so there is a need to check if Service has been running before last Activity restart
                 * in that case running Waggle service should be bound or a new one started with data of currently existing hidden service
                 * **/
            }

            override fun onServiceDisconnected(p0: ComponentName?) {}
        }

        context.bindService(service, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    override fun onTorInit() {
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onTorInit", true)
    }

    override fun onOnionAdded(data: Bundle) {
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onOnionAdded", true)

        initWaggle(data)
    }

    override fun onWaggleProcessStarted(process: Process?) {
        if(process != null) {
            context
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onWaggleStarted", true)

            getOutput(process)
        }
    }

    private fun initWaggle(data: Bundle) {
        val nodeService = Intent(context, NodeJSService::class.java)

        if(!isMyServiceRunning(NodeJSService::class.java)) {
            Log.i("NodeJS Service", "Starting new service")
            nodeService.putExtra("HIDDEN_SERVICE_DATA", data)
            context.startService(nodeService)
        }

        val serviceConnection = object: ServiceConnection {
            override fun onServiceConnected(p0: ComponentName?, binder: IBinder?) {
                val service = (binder as NodeJSService.LocalBinder).getService()
                service.registerClient(this@Integrator)
            }

            override fun onServiceDisconnected(p0: ComponentName?) {}
        }

        context.bindService(nodeService, serviceConnection, Context.BIND_AUTO_CREATE)
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
