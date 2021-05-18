package com.zbaymobile.Utils

import android.content.Context
import android.os.Build
import android.util.Log
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader


object Utils {

    fun getNativeLibraryDir(context: Context): String? {
        val appInfo = context.applicationInfo
        return appInfo.nativeLibraryDir
    }

    fun getArch(): String {
        var folder = Build.CPU_ABI
        val javaArch = System.getProperty("os.arch")
        if (javaArch != null && javaArch.contains("686")) {
            folder = "x86"
        }
        // return folder
        return "arm64-v8a"
    }

    fun logNotice(notice: String) {
        Log.d("NOTICE", notice)
    }

    fun logNotice(notice: String, e: Exception) {
        logNotice(notice)
        Log.e("NOTICE", "error occurred", e)
    }

    fun exec(dir: File, command: Array<String>, env: Map<String, String>?): Process {
        val pb = ProcessBuilder(*command)
        val _env: MutableMap<String, String> = pb.environment()
        env?.map {
            _env[it.key] = it.value
        }
        return pb
            .directory(dir)
            .start()
    }

    fun getOutput(process: Process): Int {
        val stdOut = BufferedReader(InputStreamReader(process.inputStream))
        val stdError = BufferedReader(InputStreamReader(process.errorStream))

        /* var error = ""
        while(stdError.readLine()?.also { error = it } != null) {
            logNotice(error)
        } */

        var output = ""
        while(stdOut.readLine()?.also { output = it } != null) {
            logNotice(output)
        }

        process.waitFor()

        if (process.exitValue() != 0) {
            throw Exception("Error: " + process.exitValue().toString())
        }

        return process.exitValue()
    }

    fun setFilePermissions(file: File) {
        file.setReadable(true)
        file.setExecutable(true)
        file.setWritable(false)
        file.setWritable(true, true)
    }
}