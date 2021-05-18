package com.zbaymobile

import android.app.Application
import android.app.IntentService
import android.content.Intent
import android.os.Bundle
import android.os.ResultReceiver
import android.util.Log
import com.jaredrummler.android.shell.Shell
import com.zbaymobile.torcontrol.TorControlConnection
import com.zbaymobile.Utils.Const.DIRECTORY_TOR_DATA
import com.zbaymobile.Utils.Utils.logNotice
import org.torproject.android.binary.TorResourceInstaller
import org.torproject.android.binary.TorServiceConstants
import java.io.*
import java.net.ConnectException
import java.net.InetSocketAddress
import java.net.Socket


class TorService: IntentService(TorService::class.simpleName) {

    private var receiver: ResultReceiver? = null

    private var conn: TorControlConnection? = null

    private lateinit var appBinHome: File
    private lateinit var appCacheHome: File

    private var fileTorrc: File? = null

    private var controlPort: Int = 9051
    private var socksPort: Int = 9050

    override fun onHandleIntent(intent: Intent?) {
        receiver = intent?.getParcelableExtra("receiver")

        appBinHome = filesDir

        if (!appBinHome.exists()) {
            appBinHome.mkdirs()
        }

        appCacheHome = getDir(DIRECTORY_TOR_DATA, Application.MODE_PRIVATE)

        fileTorrc = File(appBinHome, TorServiceConstants.TORRC_ASSET_KEY)

        try {
            val torResourceInstaller = TorResourceInstaller(
                this, // context
                filesDir // install folder
            )

            val fileTorBin = torResourceInstaller.installResources()

            runTorShellCmd(
                fileTorBin
            )

        } catch (e: java.lang.Exception) {
            e.printStackTrace()
            logNotice(e.message!!)
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

        extraLines.append("RunAsDaemon 1").append('\n')

        controlPort = checkPort(9051)
        extraLines.append("ControlPort ").append(controlPort).append('\n')

        socksPort = checkPort(9050)
        extraLines.append("SOCKSPort ").append(socksPort).append('\n')

        extraLines.append("CookieAuthentication 0")

        Log.d("TORRC","torrc.custom=\n$extraLines")

        val fileTorrcCustom = File(fileTorrc?.absolutePath.toString() + ".custom")
        val success: Boolean = updateTorConfigCustom(fileTorrcCustom, extraLines.toString())

        return if (success && fileTorrcCustom.exists()) {
            fileTorrcCustom
        } else {
            null
        }
    }

    private fun runTorShellCmd(fileTorBin: File): Boolean {

        /* Default torrc file is being created by tor-android lib
           so there is a need for overwrite it with custom file
           containing all the proper configuration */
        val fileTorrcCustom: File? = updateTorrcCustomFile()
        if ((fileTorrcCustom?.exists()) == false || (fileTorrcCustom?.canRead()) == false) {
            return false
        }

        val appCacheHome: File = getDir("data", Application.MODE_PRIVATE)

        val command = fileTorBin.canonicalPath.toString() +
                " DataDirectory " + appCacheHome.canonicalPath +
                " --defaults-torrc " + fileTorrcCustom?.canonicalPath

        var exitCode = try {
            shellExec("$command --verify-config")
        } catch (e: Exception) {
            logNotice("Tor configuration did not verify: " + e.message, e)
            return false
        }

        if(exitCode == 0) {
            exitCode = try {
                shellExec(command)
            } catch (e: Exception) {
                logNotice("Tor was unable to start: " + e.message, e)
                return false
            }

            if(exitCode != 0) {
                logNotice("Tor did not start. Exit: $exitCode")
                return false
            }

            initControlConnection()
        }

        return true
    }

    private fun initControlConnection() {
        val socket = Socket("127.0.0.1", controlPort)
        socket.soTimeout = 60000
        conn = TorControlConnection(socket)

        conn?.launchThread(true)

        conn!!.authenticate(byteArrayOf(0))

        addOnion()
    }

    private fun addOnion() {
        val res = conn!!.addOnion("NEW:BEST", mutableMapOf(5555 to "127.0.0.1:5555"), listOf("Detach"))
        val address = res["onionAddress"].toString()
        val key = res["onionPrivKey"].toString()

        Log.d("TOR", "Hidden service created with address $address.onion")

        val bundle = Bundle()
        bundle.putString("ADDRESS", address)
        bundle.putInt("PORT", 5555)
        bundle.putInt("SOCKS", socksPort)
        receiver?.send(0, bundle)
    }

    private fun checkPort(port: Int): Int {
        var isPortUsed = true
        var _port = port
        while (isPortUsed) {
            isPortUsed = isPortOpen("127.0.0.1", port, 500)
            if (isPortUsed) //the specified port is not available, so let Tor find one instead
                _port++
        }
        return _port
    }

    private fun isPortOpen(ip: String?, port: Int, timeout: Int): Boolean {
        return try {
            val socket = Socket()
            socket.connect(InetSocketAddress(ip, port), timeout)
            socket.close()
            true
        } catch (ce: ConnectException) {
            false
        } catch (ex: java.lang.Exception) {
            false
        }
    }

    private fun shellExec(cmd: String): Int {
        val process = Shell.SH.run(cmd)

        process.stdout.map {
            Log.d("TOR", it)
        }

        return process.exitCode
    }
}
