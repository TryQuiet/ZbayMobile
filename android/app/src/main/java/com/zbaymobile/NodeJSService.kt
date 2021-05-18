package com.zbaymobile

import android.app.IntentService
import android.content.Intent
import com.zbaymobile.Utils.Utils.exec
import com.zbaymobile.Utils.Utils.getNativeLibraryDir
import com.zbaymobile.Utils.Utils.getOutput
import com.zbaymobile.Utils.Utils.logNotice
import com.zbaymobile.Utils.Utils.setFilePermissions
import java.io.File


class NodeJSService: IntentService(NodeJSService::class.simpleName) {

    override fun onHandleIntent(intent: Intent?) {
        try {
            val filesDirectory = File(filesDir, "waggle/files")

            // Create ipfs paths
            val channels = File(filesDirectory, "ZbayChannels")
            channels.mkdirs()
            setFilePermissions(channels)

            val orbitdb = File(filesDirectory, "OrbitDB")
            orbitdb.mkdirs()
            setFilePermissions(orbitdb)

            val hiddenServiceData = intent?.getBundleExtra("HIDDEN_SERVICE_DATA")

            val dynamicLibraries = File(filesDir, "libs/lib")
            val waggle = File(filesDir, "waggle/waggle")

            val nativeLibraryDir = getNativeLibraryDir(applicationContext)
            val dir = File(nativeLibraryDir!!)

            val process = exec(
                dir = dir,
                command = arrayOf(
                    "./libnode.so",
                    "${waggle.canonicalPath}/lib/mobileWaggleManager.js",
                    "-a", "${hiddenServiceData?.getString("ADDRESS")}.onion",
                    "-p", "${hiddenServiceData?.getInt("PORT")}",
                    "-s", "${hiddenServiceData?.getInt("SOCKS")}",
                    "-d", "$filesDirectory"
                ),
                env = mapOf(
                    "LD_LIBRARY_PATH" to "$dynamicLibraries",
                    "HOME" to "$filesDirectory",
                    "TMP_DIR" to "$filesDirectory"
                )
            )
            // Log process response
            getOutput(process)
        } catch(e: java.lang.Exception) {
            e.printStackTrace()
            logNotice(e.message!!)
        }
    }
}
