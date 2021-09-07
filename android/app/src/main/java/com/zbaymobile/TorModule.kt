package com.zbaymobile

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Bundle
import android.os.IBinder
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.zbaymobile.Utils.Const.SERVICE_ACTION_EXECUTE
import java.io.File

class TorModule(private val context: ReactApplicationContext): ReactContextBaseJavaModule(), TorService.Callbacks {

    private var torService: TorService? = null

    override fun getName(): String {
        return "TorModule"
    }

    @ReactMethod
    fun startTor(socksPort: Int, controlPort: Int) {

        val service = Intent(context, TorService::class.java)
            service.action = SERVICE_ACTION_EXECUTE
            service.putExtra("socksPort", socksPort)
            service.putExtra("controlPort", controlPort)

        context.startService(service)

        val serviceConnection = object: ServiceConnection {
            override fun onServiceConnected(p0: ComponentName?, binder: IBinder?) {
                torService = (binder as TorService.LocalBinder).getService()
                torService?.bindClient(this@TorModule)
            }

            override fun onServiceDisconnected(p0: ComponentName?) {
                torService?.unbindClient()
            }
        }

        context.bindService(service, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    @ReactMethod
    fun createDataDirectory() {
        val dataDirectory = File(context.filesDir, "waggle/files")
        dataDirectory.mkdirs()

        val path = dataDirectory.absolutePath

        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onDataDirectoryCreated", path)
    }

    @ReactMethod
    fun initPushNotifications() {
        val service = Intent(context, PushNotificationsService::class.java)
        val bundle = Bundle()

        service.putExtras(bundle)

        context.startService(service)
    }

    override fun onTorInit(socksPort: Int, controlPort: Int, authCookie: String) {
        val payload: WritableMap = Arguments.createMap()
        payload.putInt("socksPort", socksPort)
        payload.putInt("controlPort", controlPort)
        payload.putString("authCookie", authCookie)
        context
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onTorInit", payload)
    }

}
