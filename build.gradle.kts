import com.github.gradle.node.npm.task.NpmTask
plugins {
    id("com.github.node-gradle.node") version "7.0.2"
    id("base")
}

tasks.register<NpmTask>("npmBuild") {
    npmCommand.set(listOf("run", "build"))
}
