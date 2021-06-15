package com.zbaymobile

import android.app.*
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Binder
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.zbaymobile.Scheme.Onion
import com.zbaymobile.Utils.Const.DEFAULT_CONTROL_PORT
import com.zbaymobile.Utils.Const.DEFAULT_SOCKS_PORT
import com.zbaymobile.Utils.Const.NOTIFICATION_CHANNEL_ID
import com.zbaymobile.Utils.Const.NOTIFICATION_FOREGROUND_SERVICE_ID
import com.zbaymobile.Utils.Const.SERVICE_ACTION_EXECUTE
import com.zbaymobile.Utils.Const.SERVICE_ACTION_STOP
import com.zbaymobile.Utils.Const.TAG_TOR
import com.zbaymobile.Utils.Utils.checkPort
import net.freehaven.tor.control.TorControlConnection
import org.torproject.jni.TorService
import java.io.*
import java.util.concurrent.Executors


class WaggleService: Service() {

    private var notificationManager: NotificationManager? = null
    private var notificationBuilder: NotificationCompat.Builder? = null

    private val binder = LocalBinder()
    private val executor = Executors.newCachedThreadPool()

    private lateinit var prefs: Prefs
    private lateinit var client: Callbacks

    private var torControlConnection: TorControlConnection? = null
    private var torServiceConnection: ServiceConnection? = null
    private var shouldUnbindTorService = false

    private var controlPort: Int = DEFAULT_CONTROL_PORT
    private var socksPort: Int = DEFAULT_SOCKS_PORT

    var onions = mutableListOf<Onion>()

    @RequiresApi(api = Build.VERSION_CODES.O)
    private fun createNotificationChannel() {
        val notificationManager: NotificationManager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        val name: CharSequence =
            getString(R.string.app_name)

        val channel =
            NotificationChannel(NOTIFICATION_CHANNEL_ID, name, NotificationManager.IMPORTANCE_LOW)

        notificationManager.createNotificationChannel(channel)
    }

    private fun buildNotification(): Notification {
        val intent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, 0)

        if(notificationBuilder == null) {
            notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager?
            notificationBuilder = NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle(getString(R.string.app_name))
                .setSmallIcon(R.drawable.ic_notification)
                .setContentIntent(pendingIntent)
                .setCategory(Notification.CATEGORY_SERVICE)
                .setOngoing(true)
        }

        // Set Exit button action
        val exitIntent =
            Intent(this, WaggleService::class.java).setAction(SERVICE_ACTION_STOP)

        notificationBuilder!!.addAction(
            android.R.drawable.ic_delete,
            getString(R.string.close),
            PendingIntent.getService(this, 0, exitIntent, 0)
        )

        return notificationBuilder!!.build()
    }

    override fun onCreate() {
        super.onCreate()
        prefs = (application as MainApplication).sharedPrefs
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            createNotificationChannel()

        val notification = buildNotification()
        startForeground(NOTIFICATION_FOREGROUND_SERVICE_ID, notification)

        val action = intent?.action
        if(action != null){
            when(action) {
                SERVICE_ACTION_EXECUTE -> {
                    Log.d(TAG_TOR, "Service executed")
                    executor.execute(IncomingIntentRouter(intent))
                }
                SERVICE_ACTION_STOP -> {
                    Log.d(TAG_TOR, "Service stopped")
                    stopService()
                }
            }

        } else {
            Log.d(TAG_TOR, "Got null onStartCommand() action")
        }

        return START_STICKY
    }

    private fun startTor() {
        /**
         * Default torrc file is being created by tor-android lib
         * so there is a need for overwrite it with custom file
         * containing all the proper configuration
         **/
        val fileTorrcCustom: File? = updateTorrcCustomFile()
        if ((fileTorrcCustom?.exists()) == false || (fileTorrcCustom?.canRead()) == false)
            return

        torServiceConnection = object: ServiceConnection {
            override fun onServiceConnected(componentName: ComponentName?, iBinder: IBinder?) {
                val torService = (iBinder as TorService.LocalBinder).service
                try {
                    torControlConnection = torService.torControlConnection
                    while(torControlConnection == null) {
                        Log.d(TAG_TOR, "Waiting for Tor control connection...")
                        Thread.sleep(500)
                        torControlConnection = torService.torControlConnection
                    }

                    /** Tor has been successfully initialized **/
                    client.onTorInit()

                    val onionPort = checkPort(5555)
                    addOnion(onionPort)

                } catch(e: IOException) {
                    e.printStackTrace()
                    stopTor()
                    torServiceConnection = null
                } catch(e: InterruptedException) {
                    e.printStackTrace()
                    stopTor()
                    torServiceConnection = null
                }
            }

            override fun onServiceDisconnected(p0: ComponentName?) {
                torServiceConnection = null
            }

            override fun onNullBinding(name: ComponentName?) {
                stopTor()
                torServiceConnection = null
            }

            override fun onBindingDied(name: ComponentName?) {
                stopTor()
                torServiceConnection = null
            }
        }

        val serviceIntent = Intent(
            this,
            TorService::class.java
        )

        shouldUnbindTorService = if (Build.VERSION.SDK_INT < 29) {
            bindService(serviceIntent, torServiceConnection!!, BIND_AUTO_CREATE)
        } else {
            bindService(serviceIntent, BIND_AUTO_CREATE, executor, torServiceConnection!!)
        }
    }

    private fun updateTorConfigCustom(fileTorrcCustom: File?, extraLines: String?): Boolean {
        val fos = FileWriter(fileTorrcCustom, false)
        val ps = PrintWriter(fos)
        ps.print(extraLines)
        ps.flush()
        ps.close()
        return true
    }

    private fun updateTorrcCustomFile(): File? {
        val extraLines = StringBuffer()

        extraLines.append("RunAsDaemon 0").append('\n')

        extraLines.append("CookieAuthentication 0").append('\n')

        controlPort = checkPort(prefs.controlPort)
        prefs.controlPort = controlPort
        extraLines.append("ControlPort ").append(controlPort).append('\n')

        socksPort = checkPort(prefs.socksPort)
        prefs.socksPort = socksPort
        extraLines.append("SOCKSPort ").append(socksPort).append('\n')

        Log.d("TORRC","torrc.custom=\n$extraLines")

        val fileTorrcCustom = TorService.getTorrc(this)
        val success: Boolean = updateTorConfigCustom(fileTorrcCustom, extraLines.toString())

        return if (success && fileTorrcCustom.exists()) {
            fileTorrcCustom
        } else {
            null
        }
    }

    @Synchronized
    @Throws(java.lang.Exception::class)
    private fun stopTor() {
        if (torControlConnection != null) {
            Log.d(TAG_TOR, "Deleting all existing hidden services")
            onions.map { onion ->
                torControlConnection?.delOnion(onion.address)
                Log.i(TAG_TOR, "${onion.address} deleted")
            }
            onions.clear()

            try {
                Log.d(TAG_TOR, "Using control port to shutdown Tor")
                torControlConnection?.shutdownTor("HALT")
            } catch (e: IOException) {
                Log.d(TAG_TOR, "Error shutting down Tor via control port", e)
            }

            if (shouldUnbindTorService) {
                unbindService(torServiceConnection!!)
                shouldUnbindTorService = false
            }

            torControlConnection = null
        }
    }

    fun addOnion(port: Int) {
        val res = try {
            torControlConnection!!.addOnion(prefs.onionPrivKey, mutableMapOf(port to "127.0.0.1:$port"), listOf("Detach"))
        } catch(e: IllegalArgumentException) {
            // Invalid priv key
            torControlConnection!!.addOnion("NEW:BEST", mutableMapOf(port to "127.0.0.1:$port"), listOf("Detach"))
        }

        val address = res["onionAddress"].toString()
        val key = res["onionPrivKey"].toString()

        prefs.onionPrivKey = key

        Log.d(TAG_TOR, "Hidden service created with address $address.onion")
        val onion = Onion(
            address = address,
            key = key,
            port = port
        )
        onions.add(onion)

        val bundle = Bundle()
        bundle.putString("ADDRESS", address)
        bundle.putInt("PORT", port)
        bundle.putInt("SOCKS", socksPort)

        client.onOnionAdded(bundle)
    }

    override fun onBind(p0: Intent?): IBinder {
        return binder
    }

    private fun stopService() {
        stopTor()
        stopForeground(true)
    }

    override fun onDestroy() {
        stopService()
        super.onDestroy()
    }

    fun registerClient(client: Callbacks) {
        this.client = client
    }

    interface Callbacks {
        fun onTorInit()
        fun onOnionAdded(data: Bundle)
    }

    inner class LocalBinder: Binder() {
        fun getService(): WaggleService {
            return this@WaggleService
        }
    }

    inner class IncomingIntentRouter(val intent: Intent?): Runnable {
        override fun run() {
            startTor()
        }
    }
}
