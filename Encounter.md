#### [Maven] Maven Common Commands

```shell
mvnc
mvncpst
mvncist
mvncdst
mvn help:effective-pom -Dverbose -Doutput=effective-pom.xml
mvndt -Dverbose -Dincludes='org.slf4j:slf4j-log4j12' -DoutputFile='mvndt.xml'
mvn dependency:purge-local-repository -DmanualInclude="org.jboss.resteasy:resteasy-jaxrs"
```

#### [Maven] Maven Version Manager

Set the Maven version with `mvn_version` in `mvnvm.properties` in your project directory:

```shell
echo "mvn_version=3.8.6" > mvnvm.properties
```

Alternatively, set properties in `${HOME}/.mvnvm.properties` to apply to all projects for your user.

```shell
echo "mvn_version=3.8.6" > ~/.mvnvm.properties
```

By default, use the latest version

Refer To:

[mjensen / mvnvm — Bitbucket](https://bitbucket.org/mjensen/mvnvm/src/master/)

[mvnvm — Homebrew Formulae](https://formulae.brew.sh/formula/mvnvm)

#### [Maven] What's the different between `-DskipTests` and -`Dmaven.test.skip` in Maven

In Maven, `-DskipTests` and `-Dmaven.test.skip` are two different properties used to skip tests, but they behave differently:

1. `-DskipTests`: This property skips the execution of tests but still compiles the test classes. It's useful when you want to compile your test classes to check for syntax errors but don't want to run them.

2. `-Dmaven.test.skip`: This property completely skips the testing phase, including the compilation of test classes. It's useful when you want to speed up your build process and you're sure that your tests are not needed at all.

In summary, if you want to compile your tests but not run them, use `-DskipTests`. If you want to skip compiling and running tests altogether, use `-Dmaven.test.skip`.

Refer To:

[Maven Surefire Plugin – Skipping Tests](https://maven.apache.org/surefire/maven-surefire-plugin/examples/skipping-tests.html)

#### [Maven] test-jar

`maven-4.0.0.xsd`

```xml-dtd
<xs:element minOccurs="0" name="type" type="xs:string" `default="jar">
  <xs:annotation>
    <xs:documentation source="version">4.0.0+</xs:documentation>
    <xs:documentation source="description">

      The type of dependency, that will be mapped to a file extension, an optional classifier, and a few other attributes.
      Some examples are &lt;code&gt;jar&lt;/code&gt;, &lt;code&gt;war&lt;/code&gt;, &lt;code&gt;ejb-client&lt;/code&gt;
      and &lt;code&gt;test-jar&lt;/code&gt;: see &lt;a href=&quot;../maven-core/artifact-handlers.html&quot;&gt;default
      artifact handlers&lt;/a&gt; for a list. New types can be defined by extensions, so this is not a complete list.

    </xs:documentation>
  </xs:annotation>
</xs:element>
```

There are four types dependency, which are `jar`, `war`, `ebb-client`, and `test-jar`.

If you set `test-jar` as the type as follow, when `mvn install`, maven will look for a jar named like `<artifactId>-<version>-tests.jar`

```xml
<dependency>
   <groupId>xxx</groupId>
   <artifactId>xxx</artifactId>
   <type>test-jar</type>
   <scope>test</scope>
   <version>xxx</version>
</dependency>
```

How to Build a `test-jar` Package

pom.xml

```xml
<!-- Jar plugin to package the tests into a separate jar -->
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-jar-plugin</artifactId>
   <version>3.1.0</version>
   <executions>
      <execution>
         <goals>
            <goal>test-jar</goal>
         </goals>
      </execution>
   </executions>
</plugin>
```
use `mvncp` or `mvnci`

NOTE If using `-Dmaven.test.skip` , it won't build a `test-jar` package. using `-DskipTests` is find.

##### Why and when should you use a **test-jar**?

1. **Sharing Test Code**: If you have utility classes, mock implementations, or other test-related code that you want to share across multiple projects, you can use a test-jar to distribute just the testing parts, without including the production code.
2. **Test Dependencies for Other Projects**: If you have a library project and another project depends on your library for testing purposes, you can package your test code into a test-jar and let the consuming project use it for their own unit tests. This is helpful in complex systems where one project’s tests might depend on another project’s test utilities.
3. **Reducing the Artifact Size**: By separating your main code and test code into different artifacts, you can keep the main artifact smaller and leaner. This means only the production code is included in the main artifact, and test code can be consumed separately.
4. **Avoiding Including Tests in the Final Artifact**: If you don’t want to include your test code in the final production artifact (like a WAR or JAR for deployment), using a test-jar is a way to keep tests separate from your production code, yet still make them available if needed for testing in other projects.

##### When Not to Use Test-JAR:

- **If you don’t need to share test code**: If your project is simple and you don’t have complex testing dependencies, there’s no need to create a separate test-jar.
- **If the test code is tightly coupled with the application code**: If the tests are tightly integrated into your project, creating a separate test-jar might introduce unnecessary complexity.

#### [Maven] Subdependency Version is Different

The version of a subdependency like `subDpdc` can be different from the main dependency like `mainDpdc` due to several reasons:

1. **Dependency Management**: If the project uses Maven's dependency management, the version of `mainDpdc` might be controlled in the `<dependencyManagement>` section of the parent POM. This allows a project to centrally manage the versions of its dependencies, including subdependencies.

2. **Transitive Dependencies**: `mainDpdc` might be a transitive dependency of another dependency in your project. Transitive dependencies are dependencies of your direct dependencies. Maven resolves these dependencies and their versions based on the dependency tree.

3. **Version Conflicts**: If `mainDpdc` is a dependency of multiple libraries in your project, Maven uses a "nearest definition" strategy. That means it uses the version of the closest dependency to your project in the tree of dependencies. So, even if `subDpdc` uses one version of `mainDpdc`, a different version might be used if another dependency that is closer in the tree requires it.

4. **Explicit Version Specification**: The version of `mainDpdc` might be explicitly set in the `pom.xml` file of `subDpdc` or another dependency.

Without more specific information about the `subDpdc` and `mainDpdc` projects and their usage in your project, it's hard to say exactly why the versions are different. You may want to check the `pom.xml` files of these projects or consult with the project maintainers for more information.

#### [Maven] Properties in POM

In a Maven `pom.xml` file:

```xml
<jvm.common.arguments>@${session.executionRootDirectory}/filename</jvm.common.arguments>
```

This line is defining a property named `jvm.common.arguments`. The value of this property is `@${session.executionRootDirectory}/filename`.

In Maven, properties are key-value pairs that can be used to customize the build process. They can be referenced elsewhere in the `pom.xml` file using the `${}` syntax.

In this case, the `${session.executionRootDirectory}` is a built-in Maven property that refers to the top-level directory of the current build session. So, the value of `jvm.common.arguments` will be the path to a file named `filename` in the root directory of the build session.

The `@` symbol before the file path indicates that this file contains JVM arguments. When Maven starts the JVM (for example, to run tests), it will read this file and pass its contents as command-line arguments to the JVM.

This is a way to externalize JVM arguments from the `pom.xml` file, which can be useful if you have a lot of arguments, or if you want to change the arguments without modifying the `pom.xml` file.

Refer To: [Maven – Settings Reference](https://maven.apache.org/settings.html)

#### [Maven] `<relativePath>`

By default,

```xml
<relativePath>..</relativePath>
```

[Maven – Introduction to the POM](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)

[Understanding Maven’s “relativePath” Tag for a Parent POM | Baeldung](https://www.baeldung.com/maven-relativepath)

Relateive Path Issues

```shell

​````shell
# unable to find valid certification path to requested target and 'parent.relativePath' points at wrong local POM
Non-resolvable parent POM for  <groupId>:<artifactId>:<version>: The following artifacts could not be resolved: org.springframework.boot:spring-boot-starter-parent:pom:3.3.1 (absent): org.springframework.boot:spring-boot-starter-parent:pom:3.3.1 failed to transfer from https://maven.aliyun.com/repository/public during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of aliyunmaven has elapsed or updates are forced. Original error: Could not transfer artifact org.springframework.boot:spring-boot-starter-parent:pom:3.3.1 from/to aliyunmaven (https://maven.aliyun.com/repository/public): PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target and 'parent.relativePath' points at wrong local POM
````

```shell
# unable to find valid certification path to requested target and 'parent.relativePath' points at no local POM
Non-resolvable parent POM for  <groupId>:<artifactId>:<version>: The following artifacts could not be resolved: org.springframework.boot:spring-boot-starter-parent:pom:3.3.1 (absent): org.springframework.boot:spring-boot-starter-parent:pom:3.3.1 failed to transfer from https://maven.aliyun.com/repository/public during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of aliyunmaven has elapsed or updates are forced. Original error: Could not transfer artifact org.springframework.boot:spring-boot-starter-parent:pom:3.3.1 from/to aliyunmaven (https://maven.aliyun.com/repository/public): PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target and 'parent.relativePath' points at no local POM
```

Correct or remove the `<relativePath>` in the POM file

```xml
<relativePath/>
```

Refer To:

[java - Unable to find valid certification path to requested target and 'parent.relativePath' points at wrong local POM - Stack Overflow](https://stackoverflow.com/questions/59598487/unable-to-find-valid-certification-path-to-requested-target-and-parent-relative)

#### [Maven] `maven.compiler.release`

The properties `maven.compiler.source`, `maven.compiler.target`, and `maven.compiler.release` are used to specify the Java version for your Maven project.

- `maven.compiler.source`: This property is used to specify the Java version of the source code. It tells the compiler that the code is written in this version of Java.

- `maven.compiler.target`: This property is used to specify the Java version of the bytecode that the compiler should generate. It tells the compiler to generate bytecode that is compatible with this version of Java.

- `maven.compiler.release`: This property is a shorthand for specifying both `maven.compiler.source` and `maven.compiler.target` at the same time. It was introduced in Java 9 and Maven Compiler Plugin 3.6.0.

Here is the relevant part of your `pom.xml` file:

```xml
<properties>
   <maven.compiler.source>17</maven.compiler.source>
   <maven.compiler.target>17</maven.compiler.target>
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

If you are using Java 9 or later and Maven Compiler Plugin 3.6.0 or later, you can simplify this by only specifying `maven.compiler.release`:

```xml
<properties>
   <maven.compiler.release>17</maven.compiler.release>
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>
```

#### [Maven] release version 17 not supported

```shell
mvn compile
```

```xml
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-compiler-plugin</artifactId>
   <version>3.13.0</version>
   <configuration>
      <source>17</source>
      <target>17</target>
   </configuration>
</plugin>
```

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.13.0:compile (default-compile) on project hello-world: Fatal error compiling: error: release version 17 not supported -> [Help 1]
```

There's nothing to do with the version of `maven-compiler-plugin`. It's related to the version of JDK. Check the version of JDK if it's JDK17.

```shell
java -version
```

#### [Maven] Command Arguments

Skip Test, even the tests compilation

```shell
-Dmaven.test.skip
```

Skip A Module

```shell
-pl '!module-name'
```

Assign A New Local Repository

```shell
-Dmaven.repo.local=/Users/xxx/.m2/foo
```

Batch Mode

```shell
-B
```

The `-B` option in the `mvn` command stands for "Batch Mode". This option is used to prevent Maven from displaying any unnecessary output during the build process. It is particularly useful when you are running Maven in an automated build or continuous integration system, where you want to minimize the amount of log output.

In batch mode, Maven will not attempt to interact with the user for input, display color-coded output, or do any other output that is not necessary to achieve the build. This can make the build process faster and the logs easier to read and understand.

#### [Maven] Run Spring Boot Project

```shell
# cd to the service root
# (Optional) assign Java arguments by file
export JDK_JAVA_OPTIONS='@/foo/file'

mvn spring-boot:run -Dmaven.test.skip

# Or
java @{pathto}/argFile -jar {module_dir}/{execurtion.jar}
java @/pathto/file -Xms4g -Xmn2g -Xmx8g -jar ./target/*.jar
```

NOTE: Can not add / at the end of the file path, otherwise:

```shell
Error: could not open `foo/file/'
```



```shell
java @{pathto}/{file} -jar {jar absolute path} -cp {lib.jar absolute path}
```

```shell
# if missing `-jar`
Error: Could not find or load main class ...
Caused by: java.lang.ClassNotFoundException: ...
```

```shell
# javax.servlet:sevlet-api version should be 4.0.1, but found 2.5. Exclude and assign the version
***************************
APPLICATION FAILED TO START
***************************

Description:

An attempt was made to call a method that does not exist. The attempt was made from the following location:

    org.apache.catalina.authenticator.AuthenticatorBase.startInternal(AuthenticatorBase.java:1201)

The following method did not exist:

    'java.lang.String javax.servlet.ServletContext.getVirtualServerName()'

The calling method's class, org.apache.catalina.authenticator.AuthenticatorBase, was loaded from the following location:

    jar:file:<jar absolute path>!/BOOT-INF/lib/tomcat-embed-core-9.0.83.jar!/org/apache/catalina/authenticator/AuthenticatorBase.class

The called method's class, javax.servlet.ServletContext, is available from the following locations:

    jar:file:<jar absolute path>!/BOOT-INF/lib/servlet-api-2.5.jar!/javax/servlet/ServletContext.class
    jar:file:<jar absolute path>!/BOOT-INF/lib/jboss-servlet-api_4.0_spec-2.0.0.Final.jar!/javax/servlet/ServletContext.class
    jar:file:<jar absolute path>!/BOOT-INF/lib/javax.servlet-api-4.0.1.jar!/javax/servlet/ServletContext.class
    jar:file:<jar absolute path>!/BOOT-INF/lib/tomcat-embed-core-9.0.83.jar!/javax/servlet/ServletContext.class

The called method's class hierarchy was loaded from the following locations:

    javax.servlet.ServletContext: jar:file:<jar absolute path>!/BOOT-INF/lib/servlet-api-2.5.jar!/


Action:

Correct the classpath of your application so that it contains compatible versions of the classes org.apache.catalina.authenticator.AuthenticatorBase and javax.servlet.ServletContext
```



#### [Maven] dependency tree

```shell
# Run this command in the root POM directory. The output files are in directories of each sub modules.
# Or in the service directory, which is the most valuable one.
mvn dependency:tree -Dincludes='<groupId>:<artifactId>:<type>:<version>' -DoutputFile='mvndt.xml'
mvn dependency:tree -Dincludes='<groupId>:<artifactId>:<type>:<version>' -Dverbose -DoutputFile='mvndt.xml'
mvndt -Dverbose -Dincludes=''

# List All SNAPSHOT Version
mvndt -Dverbose -Dincludes=':::*-SNAPSHOT'
mvndt -Dverbose -Dincludes='groupId:artifactId:*:version'
```

NOTE:

Must in the service directory

Must use full pacakage name

If use `*` , must use quote `'` or `"` . This is not metioned in the documentation, and its example will throw exc≠eption:

```shell
zsh: no matches found: -Dexcludes=org.apache.maven*,org.codehaus.plexus
```

Refer To:

[Apache Maven Dependency Plugin – dependency:tree](https://maven.apache.org/plugins/maven-dependency-plugin/tree-mojo.html)

[Apache Maven Dependency Plugin – Filtering the dependency tree](https://maven.apache.org/plugins/maven-dependency-plugin/examples/filtering-the-dependency-tree.html)

[maven 2 - How to get a dependency tree for an artifact? - Stack Overflow](https://stackoverflow.com/questions/3342908/how-to-get-a-dependency-tree-for-an-artifact)

Q&A

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-dependency-plugin:2.8:tree (default-cli) on project <module-name>: Execution default-cli of goal org.apache.maven.plugins:maven-dependency-plugin:2.8:tree failed: Cannot invoke "String.equals(Object)" because the return value of "org.apache.maven.model.Exclusion.getGroupId()" is null -> [Help 1]
```

Bug in old version of maven-dependency-plugin

[maven - mvn dependency:tree -Dverbose hangs and never finishes - Stack Overflow](https://stackoverflow.com/questions/70455462/mvn-dependencytree-dverbose-hangs-and-never-finishes)

```xml
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-dependency-plugin</artifactId>
   <version>3.3.0</version>
</plugin>
```

#### [Maven] Show which dependences can update

```shell
mvn versions:display-dependency-updates
```

#### [Maven] Show dependences version

```shell
mvn dependency:resolve -DincludeArtifactIds=<artifactId> -DincludeGroupIds=<groupId>
```

#### [Maven] dependency analyze

```shell
mvn dependency:analyze -Dmaven.test.skip
```

```shell
[WARNING] Used undeclared dependencies found:
[WARNING]    <groupId>:<artifactId>:<type>:<version>:[scope]
[WARNING]    ...
[WARNING] Unused declared dependencies found:
[WARNING]    <groupId>:<artifactId>:<type>:<version>:[scope]
[WARNING]    ...
```

#### [Maven] Dependency Scope

[Maven – Introduction to the Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html) | Dependency_Scope

[Maven Dependency Scopes | Baeldung](https://www.baeldung.com/maven-dependency-scopes)

#### [Maven] Project Lombok Should Use Provided Scope

[Maven | Project Lombok](https://projectlombok.org/setup/maven)

[java - Maven Scope for Lombok (Compile vs. Provided) - Stack Overflow](https://stackoverflow.com/questions/29385921/maven-scope-for-lombok-compile-vs-provided)

[Introduction to Project Lombok | Baeldung](https://www.baeldung.com/intro-to-project-lombok)

#### [Maven] Could not resolve dependencies for project

```shell
[ERROR] Failed to execute goal on project <module-name>: Could not resolve dependencies for project <groupId>:<artifactId>:jar:<version>: <groupId>:<artifactIdNotFound>:jar:<version> was not found in <remote-repository-url> during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of <server.id> has elapsed or updates are forced -> [Help 1]
[ERROR] 
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR] 
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/DependencyResolutionException
[ERROR] 
[ERROR] After correcting the problems, you can resume the build with the command
[ERROR]   mvn <args> -rf :<artifactIdNotFound>
```

remove or run:

```shell
mvn clean install -Dmaven.test.skip
```

#### [Maven] zip END header not found

```shell
[ERROR]   ZipException opening "<artifactId>-<version>.jar": zip END header not found

```

```shell
mvn dependency:purge-local-repository -DmanualInclude=' <groupId>:<artifactId>:<version>'
```

#### [Maven] Clean Local Repository

```shell
[ERROR] Failed to execute goal on project <project-name>: Could not resolve dependencies for project <project-group-id>:<project-artifact-id>:jar:<version>: <groupId>:<artifactId>:jar:latest.release was not found in <remote-release-repo> during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of <remote-repository-id> has elapsed or updates are forced -> [Help 1]
```

```shell
mvn dependency:purge-local-repository -DmanualInclude='<groupId>:<artifactId>'
```

#### [Maven] Hide Download Progress Indication when Buildiing

```shell
mvn -B
```

[logging - disable maven download progress indication - Stack Overflow](https://stackoverflow.com/questions/21638697/disable-maven-download-progress-indication)

#### [Maven] Deploy

```shell
mvn clean deploy -Dmaven.test.skip
```

After adding `maven-source-plugin`, when you run mvn deploy, Maven will automatically package and deploy the source JAR along with the main artifact to your configured repository.

#### [Maven] Check all SNAPSHOT version

[Maven check that all dependencies have been released - Stack Overflow](https://stackoverflow.com/questions/38113721/maven-check-that-all-dependencies-have-been-released)

```xml
      <plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-enforcer-plugin</artifactId>
   <version>1.4.1</version>
   <executions>
      <execution>
         <id>enforce-no-snapshots</id>
         <goals>
            <goal>enforce</goal>
         </goals>
         <configuration>
            <rules>
               <requireReleaseDeps>
                  <message>No Snapshots Allowed!</message>
               </requireReleaseDeps>
            </rules>
            <fail>true</fail>
         </configuration>
      </execution>
   </executions>
</plugin>
```

[Maven SNAPSHOT Check | Jenkins plugin](https://plugins.jenkins.io/maven-snapshot-check/)

#### [Maven] settings.xml

```shell
vi ~/.m2/settings.xml
```

| Field        | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| updatePolicy | can be "always", "daily" (default), "interval:XXX" (in minutes) or "never" (only if it doesn't exist locally). |
|              |                                                              |
|              |                                                              |

[Maven Settings – Settings](https://maven.apache.org/ref/3.9.9/maven-settings/settings.html)

[Maven – Settings Reference](https://maven.apache.org/settings.html)

#### [Maven] Remove/Disable HTTP Blocker

```shell
http://0.0.0.0/
```

[How to disable maven blocking external HTTP repositories? - Stack Overflow](https://stackoverflow.com/questions/67001968/how-to-disable-maven-blocking-external-http-repositories)

`${maven.home}` means Maven installation directory

NOTE Need to remove this configuration in settings.xml both in `${maven.home}/config` and `${user.home}/.m2`

After remove HTTP Blocker, maven will still print warning logs, but it won't block any process.

That's because Maven needs to scan all dependencies both the project really needs and just decleard in pom.xml, and will try to download it. So if there's not exist in repository any more, maven will print a warning log.

#### [Maven] class file has wrong version 61.0, should be 55.0

```shell
[ERROR] <java file absolute path>.java:[row,column] cannot access <full qualified class name>
[ERROR]   bad class file: <jar file abosolute path>.jar(<class file path from source root>.class)
[ERROR]     class file has wrong version 61.0, should be 55.0
[ERROR]     Please remove or make sure it appears in the correct subdirectory of the classpath.
```

```shell
[ERROR] class file has wrong version 61.0, should be 52.0
```

JDK 17 (version 61.0)

JDK 11 (version 55.0)

JDK 8 (version 52.0)

The project compilation version is JDK17, while the dependency library compilation version is JDK11.

Plan

1. Identify the Java version mismatch:
   - The error indicates that the class file version is 61.0, which corresponds to Java 17, but the project is using Java 11 (version 55.0).

2. Update the Java version in the project:
   - Ensure that the project is configured to use Java 17.

3. Update the `maven-compiler-plugin` configuration in the `pom.xml`:
   - Set the `source` and `target` versions to 17.

Steps

1. Update the Java version in the project settings:
   - Ensure that IntelliJ IDEA is configured to use Java 17 for the project.

2. Update the `maven-compiler-plugin` configuration in the `pom.xml`:
   - Modify the `pom.xml` to set the `source` and `target` versions to 17.

Code

Step 2: Update `maven-compiler-plugin` configuration in `pom.xml`

```xml
<build>
   <plugins>
      <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-compiler-plugin</artifactId>
         <version>3.8.1</version>
         <configuration>
            <source>17</source>
            <target>17</target>
         </configuration>
      </plugin>
   </plugins>
</build>
```

After updating the `pom.xml`, re-import the Maven project in IntelliJ IDEA and run the build again. This should resolve the class file version mismatch issue.

#### [Maven] Speed Up Maven Build

Doesn't work for me

```shell
mvn clean install -am -pl <module-name>
```

The `mvn -am` command is used with Maven to build a project and also make sure that all required modules are built. The -am flag stands for "also make," which means that Maven will build the specified project and any dependencies that are required but not yet built.

```shell
mvn clean install -T 2C
```

- *-T 1C* means Maven will use one thread per available core.
- *-T 4* would force Maven to use four threads.

```shell
mvn clean test -Dparallel=all -DperCoreThreadCount=true
```

Refer To:

[How to Speed Up Maven Build | Baeldung](https://www.baeldung.com/maven-fast-build)

#### [Maven] `<classifier>`

When a packing type of a module is `war`, add this configuration to build a `jar` for others depends. e.g.

```xml
<artifactId>...</artifactId>
<packaging>war</packaging>
```

```xml
<dependency>
   <groupId>...</groupId>
   <artifactId>...</artifactId>
   <version>${project.version}</version>
   <classifier>classes</classifier>
</dependency>
```

After building, there will be two packages. One is `ROOT.war`, the other is `ROOT-classes.jar`.

If `<packaging>` is `jar`, it won't generate `-classes.jar`.

If you really want to generate a `-classes.jar`, use

```xml
<plugin>
   <artifactId>maven-jar-plugin</artifactId>
   <configuration>
      <classifier>classes</classifier>
   </configuration>
</plugin>
```

Refer To:

[Apache Maven Deploy Plugin – Deploy an artifact with classifier](https://maven.apache.org/plugins/maven-deploy-plugin/examples/deploying-with-classifiers.html)

[A Guide to Maven Artifact Classifiers | Baeldung](https://www.baeldung.com/maven-artifact-classifiers)

[Classifiers in maven. The classifier, by definition… | by Random developer | Medium](https://medium.com/@random_developer/classifiers-in-maven-ec682b58bb45)

[Maven] Reload All Maven Project Failure in IDEA

```shell
<groupId>:<artifactId>:<type>:<version> failed to transfer from [https-remote-repository] during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of <remote-repository-id> has elapsed or updates are forced. Original error: Could not transfer artifact <groupId>:<artifactId>:<type>:<version>E from/to <remote-repository-id> ([https-remote-repository]): transfer failed for [dependency-remote-repository-full-path]
```

run the command in IDEA instead of Terminal

```shell
mvn clean
```

#### [Maven] Dependency missing

```shell
Unresolved dependency: '<groupId>:<artifactId>:<type>:<version>'
```

```shell
<groupId>:<artifactId>:<type>:<version> was not found in <remote-repository-url> during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of <repository-id> has elapsed or updates are forced
```

`<groupId>:<artifactId>:<type>:<version>` is not neccessary, and the repository doesn't have this artifact. But it blocks build in IntelliJ IDEA

move `<exclusion>` to `<dependencyManagement>`


// TODO how to resolve?

#### [Maven] Dependencies Cycle

```shell
[ERROR] Failed to execute goal on project <sub-module-a>: Could not resolve dependencies for project <groupId>:sub-module-a:jar:[newVersion]: The following artifacts could not be resolved: <groupId>:[sub-module-b]:jar:[newVersion], <groupId>:[sub-module-a]:jar:[newVersion]: <groupId>:[sub-module-b]:jar:[newVersion] was not found in <remote-repository-url> during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of <remote-repository-id> has elapsed or updates are forced -> [Help 1]
```

```shell
┌─────┐
|  sub-module-a
↑     ↓
|  sub-module-b
└─────┘
```

```shell
[ERROR] Failed to execute goal on project <artifactId>: Could not resolve dependencies for project <groupId>:<artifactId>:jar:<version>: <groupId>:<artifactId>:jar:<version> was not found in <remote-repository-url> during a previous attempt. This failure was cached in the local repository and resolution is not reattempted until the update interval of <remote-repository-id> has elapsed or updates are forced -> [Help 1]
```

Check current path and make sure it is the root POM path

#### [Maven] How to check version changed by bom

// TODO

#### [Maven] Maven Effective POM

List All Dependencies Configurations

List All Used Maven Plugins And Its Configurations

```shell
mvn help:effective-pom -Dverbose -Doutput=effective-pom.xml
mvn help:effective-pom -Doutput=effective-pom.xml
```

Refer To:
[Apache Maven Help Plugin – help:effective-pom](https://maven.apache.org/plugins/maven-help-plugin/effective-pom-mojo.html)

Weired Cases:



#### [Maven] Maven Plugin Manual

For maven plugins only, can not use for maven dependencies.

```shell
mvn help:describe -Dplugin= <groupId>:<artifactId>:<version> -Ddetail
```

#### [Maven] Bill of Materials (BOM) POMs

[Maven – Introduction to the Dependency Mechanism](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)

#### [Maven] How to resolve this problem if `test` scope libraries were included when Maven packaging

If test-scoped dependencies are being included in your final JAR when running `mvn package`, it's likely due to some configuration issue or specific behavior in your build process. Here's a step-by-step guide to troubleshoot and resolve this:

##### 1. **Check Your `pom.xml` for Misconfigured Scopes**

First, confirm that your dependencies are correctly scoped. Dependencies meant for testing should explicitly have the `test` scope. For example:

```xml
<dependency>
   <groupId>org.junit.jupiter</groupId>
   <artifactId>junit-jupiter-api</artifactId>
   <version>5.7.1</version>
   <scope>test</scope>
</dependency>
```

Ensure that no `test`-scoped dependencies have been inadvertently left out or incorrectly configured as `compile` or `runtime`.

##### 2. **Examine the Maven Output**

Run the following Maven command to inspect the dependencies and see if any `test`-scoped dependencies are being incorrectly included:

```bash
mvn dependency:tree
```

This will generate a tree of all your project's dependencies, showing which ones are included and their scopes. If `test` dependencies are appearing in the runtime classpath or are included in the package, it could be due to an issue with dependency scope inheritance or an incorrect plugin configuration.

##### 3. **Use the `maven-jar-plugin` Configuration**

The default behavior of the `maven-jar-plugin` should exclude `test` dependencies from the packaged JAR. However, you can explicitly configure the `maven-jar-plugin` to ensure that only compile/runtime dependencies are included in the JAR.

In your `pom.xml`, check or add the following configuration for the `maven-jar-plugin`:

```xml
<build>
   <plugins>
      <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-jar-plugin</artifactId>
         <version>3.2.0</version> <!-- Use an appropriate version -->
         <configuration>
            <excludeScope>test</excludeScope> <!-- Exclude test scope dependencies -->
         </configuration>
      </plugin>
   </plugins>
</build>
```

This ensures that the `maven-jar-plugin` will exclude dependencies with the `test` scope when creating the JAR.

##### 4. **Check for the Use of a Shade Plugin (if applicable)**

If you're using the `maven-shade-plugin` or any other plugin to create an "uber JAR" (fat JAR), make sure that you're excluding `test` dependencies properly. The `maven-shade-plugin` has an `excludeDependencies` configuration that can be used to prevent certain dependencies from being included.

Here’s how you can exclude test-scoped dependencies from the shaded JAR:

```xml
<build>
   <plugins>
      <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-shade-plugin</artifactId>
         <version>3.2.1</version> <!-- Use an appropriate version -->
         <executions>
            <execution>
               <phase>package</phase>
               <goals>
                  <goal>shade</goal>
               </goals>
               <configuration>
                  <filters>
                     <filter>
                        <artifact>*:*</artifact>
                        <excludes>
                           <exclude>*</exclude> <!-- Exclude all test dependencies -->
                        </excludes>
                     </filter>
                  </filters>
               </configuration>
            </execution>
         </executions>
      </plugin>
   </plugins>
</build>
```

You can also explicitly control the inclusion of dependencies with the `<dependencies>` element within the plugin's configuration if needed.

##### 5. **Double-Check for Transitive Dependencies**

Sometimes, test dependencies might be brought into your project transitively through other dependencies. You can explicitly exclude them in your `pom.xml` using the `<exclusions>` tag.

Example:

```xml
<dependency>
   <groupId>com.somegroup</groupId>
   <artifactId>some-library</artifactId>
   <version>1.0.0</version>
   <exclusions>
      <exclusion>
         <groupId>org.junit.jupiter</groupId>
         <artifactId>junit-jupiter-api</artifactId>
      </exclusion>
   </exclusions>
</dependency>
```

##### 6. **Run `mvn clean` Before Packaging**

Sometimes, old files or previous configurations may interfere with the packaging process. Make sure to clean your project first by running:

```bash
mvn clean package
```

This removes any previously compiled classes or JARs and ensures that you’re working with the latest configuration.

##### 7. **Check for a Custom Profile or Plugin Configurations**

In some cases, custom Maven profiles or additional plugins may modify the build process. If you have any custom profiles or configurations in your `pom.xml`, review them to ensure they aren’t unintentionally including test-scoped dependencies. Look for any profile that might adjust the packaging behavior or modify dependency scopes.

##### 8. **Use a Dependency Analyzer Tool**

If you continue to have issues, you can use tools like the [Maven Dependency Plugin's `analyze` goal](https://maven.apache.org/plugins/maven-dependency-plugin/analyze-mojo.html) to get insights into any unused or incorrectly scoped dependencies:

```bash
mvn dependency:analyze
```

##### Conclusion

To summarize, the key points to resolve this issue are:

- Ensure `test` dependencies are scoped correctly.
- Check for any misconfigured `maven-jar-plugin` or other plugins.
- Use `excludeScope` in `maven-jar-plugin` to ensure `test` dependencies are excluded.
- Use the `maven-shade-plugin` carefully if creating a fat JAR.
- Ensure transitive test dependencies are excluded with `<exclusions>`.

By following these steps, you should be able to prevent `test`-scoped libraries from being included in your packaged JAR. Let me know if you need more detailed assistance!

#### [Maven Plugin] Apache Maven Shade Plugin

[Apache Maven Shade Plugin – Introduction](https://maven.apache.org/plugins/maven-shade-plugin/)

In Maven, the `classifier` is an optional part of an artifact identifier that allows you to distinguish between different versions or variants of an artifact that are associated with the same `groupId` and `artifactId`.

##### What is a Classifier?

The `classifier` provides a way to differentiate between artifacts that are technically the same version but vary in content or type. The classifier is typically used to label an artifact with additional information about what it represents. This can include things like:

- A source code JAR (`sources`)
- A Javadoc JAR (`javadoc`)
- A native binary version of a library (e.g., `linux-x86_64` or `windows`)

###### Example:

Let's say you have a library `example-lib` with two different JARs: one for the compiled code and another for its sources. Both are from the same `groupId` and `artifactId` but differ in content. The source JAR might be classified as `sources`.

- `example-lib-1.0.jar` (compiled code)
- `example-lib-1.0-sources.jar` (source code for the library)

In this case:

- **`groupId`**: `com.example`
- **`artifactId`**: `example-lib`
- **`version`**: `1.0`
- **`classifier`**: `sources`

You could specify this artifact as follows in a `dependency` declaration:

```xml
<dependency>
   <groupId>com.example</groupId>
   <artifactId>example-lib</artifactId>
   <version>1.0</version>
   <classifier>sources</classifier>
</dependency>
```

##### Where is Classifier Used?

- **Dependencies**: If your project requires a particular variant of an artifact (like sources or Javadoc), you can specify the `classifier` in the dependency declaration.
- **Build Plugins**: Some Maven plugins (such as the `maven-shade-plugin` or `maven-dependency-plugin`) support specifying which classifiers of artifacts to include or exclude from a final artifact.

For example, if you wanted to include only the compiled JAR and exclude the source JARs or Javadoc JARs, you could specify patterns for the classifier in your plugin configuration.

##### Common Use Cases for Classifiers:

- **Sources**: `artifactId:version-sources.jar` — The source code for a library, usually used for development purposes.
- **Javadoc**: `artifactId:version-javadoc.jar` — The documentation for a library.
- **OS-specific versions**: You might have different versions of an artifact for different operating systems or environments, such as `artifactId:version-linux.jar` or `artifactId:version-windows.jar`.

##### Example in Dependency Management:

Here’s an example of how you might declare a dependency that includes a classifier:

```xml
<dependency>
   <groupId>org.apache.commons</groupId>
   <artifactId>commons-lang3</artifactId>
   <version>3.12.0</version>
   <classifier>sources</classifier>
</dependency>
```

In this case, you are specifying that you want the `commons-lang3` library version `3.12.0` but specifically its source code artifact (i.e., `commons-lang3-3.12.0-sources.jar`).

##### Summary:

- **Classifier** is an optional part of the artifact identifier used to distinguish between different variants of the same artifact.
- Common uses for classifiers include **source** JARs (`sources`), **Javadoc** JARs (`javadoc`), or platform-specific JARs (e.g., `linux-x86_64` or `windows`).
- It's used in Maven to fetch specific versions or variations of an artifact.

If you want more information or examples on how to use classifiers in specific Maven configurations, feel free to ask!

#### [Maven Plugin] Apache Maven JAR Plugin

[Apache Maven JAR Plugin – Introduction](https://maven.apache.org/plugins/maven-jar-plugin/)

```xml
<plugin>
   <artifactId>maven-jar-plugin</artifactId>
   <version>2.2</version>
   <executions>
      <execution>
         <goals>
            <goal>test-jar</goal>
         </goals>
      </execution>
   </executions>
</plugin>
```

#### [Maven Plugin] Build Helper Maven Plugin

[Build Helper Maven Plugin – Introduction](https://www.mojohaus.org/build-helper-maven-plugin/)

#### [Maven Plugin] Maven Source Plugin

The Maven Source Plugin is used to create a JAR file of the source files of the current project. Here is an example of how to use it in your `pom.xml`:

```xml
<build>
   <plugins>
      <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-source-plugin</artifactId>
         <version>3.2.1</version>
         <executions>
            <execution>
               <id>attach-sources</id>
               <goals>
                  <goal>jar</goal>
               </goals>
            </execution>
         </executions>
      </plugin>
   </plugins>
</build>
```

This configuration will automatically create a source JAR during the `package` phase of the Maven build lifecycle. The source JAR will be named in the format `<artifactId>-<version>-sources.jar`.

To manually create a source JAR, you can run the following command:

```bash
mvn source:jar
```

This will create a JAR file of the source files in the `target` directory.

To install a JAR file to the local repository, run the following command:

```shell
mvn source:jar install -Dmaven.test.skip
```

#### [Maven Plugin] How to Develop a Maven Plugin

Developing a Maven plugin involves several steps. Here's a step-by-step guide:

1. **Create a new Maven project**: This will be the project for your Maven plugin. You can create a new Maven project using the `mvn archetype:generate` command or through your IDE.

2. **Update the `pom.xml` file**: The `pom.xml` file should be updated to include the `maven-plugin` packaging type and the necessary dependencies for developing a Maven plugin.

3. **Create a Mojo**: A Mojo is a Maven plain Old Java Object. Each Mojo is an executable goal in Maven, and can be configured by specifying parameters in your `pom.xml` file.

4. **Configure the plugin in your `pom.xml` file**: Once your Mojo is ready, you can configure it in your `pom.xml` file.

Here's a basic example of a Maven plugin:

```xml
<!-- pom.xml -->
<project>
   <modelVersion>4.0.0</modelVersion>
   <groupId>com.example</groupId>
   <artifactId>my-maven-plugin</artifactId>
   <version>1.0-SNAPSHOT</version>
   <packaging>maven-plugin</packaging>

   <dependencies>
      <dependency>
         <groupId>org.apache.maven</groupId>
         <artifactId>maven-plugin-api</artifactId>
         <version>3.8.1</version>
      </dependency>
      <dependency>
         <groupId>org.apache.maven.plugin-tools</groupId>
         <artifactId>maven-plugin-annotations</artifactId>
         <version>3.5.2</version>
      </dependency>
   </dependencies>
</project>
```

```java
// src/main/java/com/example/MyMojo.java
package com.example;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugins.annotations.Mojo;

@Mojo(name = "sayhello")
public class MyMojo extends AbstractMojo {
   public void execute() throws MojoExecutionException {
      getLog().info("Hello, world.");
   }
}
```

In the above example, `sayhello` is the goal of the plugin. When you run `mvn com.example:my-maven-plugin:sayhello`, Maven will execute the `execute()` method in the `MyMojo` class, and you will see "Hello, world." in your console.

Refer To:

[Maven – Introduction to Maven Plugin Development](https://maven.apache.org/guides/introduction/introduction-to-plugins.html)

[How to Create a Maven Plugin | Baeldung](https://www.baeldung.com/maven-plugin)

[Maven – Introduction to Plugin Prefix Resolution](https://maven.apache.org/guides/introduction/introduction-to-plugin-prefix-mapping.html)

> make a short cut

#### [Maven Plugin] How to Control Maven Plugin Execution Order

plugin order

phase

maven antrun plugin

[build - Changing the order of maven plugins execution - Stack Overflow](https://stackoverflow.com/questions/8243912/changing-the-order-of-maven-plugins-execution)

[Maven plugin - execution order in same phase - Mkyong.com](https://mkyong.com/maven/maven-plugin-execution-order-in-same-phase/)

[Maven – Introduction to the Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

#### [Maven Plugin] Plugin not found in any plugin repository

```shell
[ERROR] Error resolving version for plugin '<groupId>:<artifactId>' from the repositories [local (<local-repository>), <remote-repository-id> (<remote-repository-url>), <pluginRepository-id> (<pluginRepository-url>), ...]: Plugin not found in any plugin repository -> [Help 1]
```

```shell
mvn clean install -Dmaven.test.skip
```

#### [Maven Plugin] No plugin descriptor found at META-INF/maven/plugin.xml

```shell
[ERROR] Failed to parse plugin descriptor for  <groupId>:<artifactId>:<version> (/Users/<username>/.m2/repository/.../xxx-maven-plugin-<version>.jar): No plugin descriptor found at META-INF/maven/plugin.xml -> [Help 1]
```

`pom.xml`, add `<packaging>`

```xml
<packaging>maven-plugin</packaging>
```

#### [Maven Plugin] Index 52264 out of bounds for length 107

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-plugin-plugin:3.2:descriptor (default-descriptor) on project <artifactId>: Execution default-descriptor of goal org.apache.maven.plugins:maven-plugin-plugin:3.2:descriptor failed: Index 52264 out of bounds for length 107 -> [Help 1]
```

[java - maven-plugin-plugin:3.2:descriptor failed: Index 22273 out of bounds for length 88 - Stack Overflow](https://stackoverflow.com/questions/60861485/maven-plugin-plugin3-2descriptor-failed-index-22273-out-of-bounds-for-length)

> For JDK11, upgrade to 3.3 or later
>
> For JDK17, upgrade to xx or later	// TODO find the version

#### [Maven Plugin] Unsupported class file major version 61

Use JDK17

#### [Maven Plugin] Maven Antrun Plugin

```shell
[ktlint] /pathto/Class.kt:[row]:[col]: Imports must be ordered in lexicographic order without any empty lines in-between with "java", "javax", "kotlin" and aliases in the end

[ERROR] Failed to execute goal org.apache.maven.plugins:maven-antrun-plugin:<version>:run (ktlint-format) on project catattrsvc: An Ant BuildException has occured: Java returned: 1
[ERROR] around Ant part ...<java fork="true" classname="com.pinterest.ktlint.Main" taskname="ktlint" failonerror="true" dir="/pathto/project-name" classpathref="maven.plugin.classpath">... @ 4:<col> in /pathto/project-name/target/antrun/build-ktlint.xml
```

```xml
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-antrun-plugin</artifactId>
   <version>3.1.0</version>
   <executions>
      <execution>
         <id>ktlint-format</id>
         <phase>verify</phase>
         <configuration>
            <target name="ktlint">
               <java taskname="ktlint" dir="${basedir}" fork="true" failonerror="true" classname="com.pinterest.ktlint.Main" classpathref="maven.plugin.classpath">
                  <jvmarg value="--add-opens=java.base/java.lang=ALL-UNNAMED" />
                  <arg value="-F" />
                  <arg value="src/**/*.kt" />
               </java>
            </target>
         </configuration>
         <goals>
            <goal>run</goal>
         </goals>
      </execution>
      <execution>
         <id>ktlint</id>
         <phase>verify</phase>
         <configuration>
            <target name="ktlint">
               <java taskname="ktlint" dir="${basedir}" fork="true" failonerror="true" classname="com.pinterest.ktlint.Main" classpathref="maven.plugin.classpath">
                  <arg value="src/**/*.kt" />
                  <arg value="--reporter=plain" />
                  <arg value="--reporter=checkstyle,output=${project.build.directory}/ktlint.xml" />
                  <jvmarg value="--add-opens" />
                  <jvmarg value="java.base/java.util=ALL-UNNAMED" />
                  <jvmarg value="--add-opens" />
                  <jvmarg value="java.base/java.lang=ALL-UNNAMED" />
               </java>
            </target>
         </configuration>
         <goals>
            <goal>run</goal>
         </goals>
      </execution>
   </executions>
   <dependencies>
      <dependency>
         <groupId>com.pinterest</groupId>
         <artifactId>ktlint</artifactId>
         <version>0.49.1</version>
      </dependency>
   </dependencies>
</plugin>
```

Refer To:

[Apache Maven AntRun Plugin – Introduction](https://maven.apache.org/plugins/maven-antrun-plugin/)

[apache/maven-antrun-plugin: Apache Maven AntRun Plugin](https://github.com/apache/maven-antrun-plugin)

[Maven – Introduction to the Build Lifecycle](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

~~[jeremymailen / ktlint Download](https://jitpack.io/p/jeremymailen/ktlint)~~ The example here is wrong, wrong order of execution and missing phase

#### [Maven Plugin] maven-checkstyle-plugin

```xml
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-checkstyle-plugin</artifactId>
   <configuration>
      <configLocation>checkstyle.xml</configLocation>
      <consoleOutput>true</consoleOutput>
      <failOnViolation>true</failOnViolation>
      <skip>false</skip>
   </configuration>
   <dependencies>
      <dependency>
         <groupId>com.puppycrawl.tools</groupId>
         <artifactId>checkstyle</artifactId>
         <version>8.41.1</version>
      </dependency>
   </dependencies>
   <executions>
      <execution>
         <phase>validate</phase>
         <goals>
            <goal>check</goal>
         </goals>
      </execution>
   </executions>
</plugin>
```

check imports order

#### [Maven Plugin] prettier-maven-plugin

```xml
<plugin>
   <groupId>com.hubspot.maven.plugins</groupId>
   <artifactId>prettier-maven-plugin</artifactId>
   <version>0.16</version>
   <configuration>
      <prettierJavaVersion>1.5.0</prettierJavaVersion>
   </configuration>
   <executions>
      <execution>
         <phase>validate</phase>
         <goals>
            <goal>write</goal>
         </goals>
      </execution>
   </executions>
</plugin>
```

reoder imports

#### [Maven Plugin] Find and Replace Maven Plugin

[Find and Replace Maven Plugin – Introduction](https://floverfelt.org/find-and-replace-maven-plugin/)

[floverfelt/find-and-replace-maven-plugin: Maven plugin for finding and replacing values in filenames, files, and folders.](https://github.com/floverfelt/find-and-replace-maven-plugin)

#### [Maven Plugin] migrate from cobertura-maven-plugin to jacoco-maven-plugin

```shell
[ERROR] Failed to execute goal org.codehaus.mojo:cobertura-maven-plugin:2.6:instrument (default) on project <artifactId>: Execution default of goal org.codehaus.mojo:cobertura-maven-plugin:2.6:instrument failed: Plugin org.codehaus.mojo:cobertura-maven-plugin:2.6 or one of its dependencies could not be resolved: Could not find artifact com.sun:tools:jar:0 at specified path pathto/JAVA_HOME/Contents/Home/../lib/tools.jar -> [Help 1]
```

The error indicates that the cobertura-maven-plugin is trying to find the tools.jar file, which is not present in JDK 9 and above, including JDK 17. Cobertura is not compatible with JDK 9+.

cobertura-maven-plugin

```xml
<plugin>
   <groupId>org.codehaus.mojo</groupId>
   <artifactId>cobertura-maven-plugin</artifactId>
   <version>${cobertura.maven.plugin.version}</version>
   <executions>
      <execution>
         <phase>test</phase>
         <goals>
            <goal>cobertura</goal>
         </goals>
      </execution>
   </executions>
   <configuration>
      <check/>
      <formats>
         <format>html</format>
         <format>xml</format>
      </formats>
      <instrumentation>
         <excludes>
            <exclude>pathto/*.class</exclude>
            <exclude>**/*Test*.class</exclude>
         </excludes>
      </instrumentation>
   </configuration>
</plugin>
```

jacoco-maven-plugin

```xml
<plugin>
   <groupId>org.jacoco</groupId>
   <artifactId>jacoco-maven-plugin</artifactId>
   <version>0.8.8</version>
   <executions>
      <execution>
         <id>prepare-agent</id>
         <goals>
            <goal>prepare-agent</goal>
         </goals>
         <phase>initialize</phase>
      </execution>
      <execution>
         <id>report</id>
         <goals>
            <goal>report</goal>
         </goals>
         <phase>test</phase>
      </execution>
   </executions>
   <configuration>
      <excludes>
         <exclude>pathto/*.class</exclude>
         <exclude>**/*Test*.class</exclude>
      </excludes>
   </configuration>
</plugin>
```



#### [JVM] JVM Version Manager

```shell
SDKMAN or jenv
```

[Step-by-Step Guide: Installing and Switching Java Versions on Mac OSX | by Harold Finch | Medium](https://medium.com/@haroldfinch01/step-by-step-guide-installing-and-switching-java-versions-on-mac-osx-f3896b9872f4)

[Java Version Management: The right way to manage Java versions | by Nipuna Upeksha | Javarevisited | Medium](https://medium.com/javarevisited/java-version-management-the-right-way-to-manage-java-versions-3c3554dc2512)

#### [JVM] `-Djava.locale.providers`

The `-Djava.locale.providers=COMPAT,SPI` is a Java system property that sets the order of locale providers for the Java Virtual Machine (JVM).

Locale providers are used to offer locale-sensitive services in Java. The `COMPAT` and `SPI` are two types of locale providers:

- `COMPAT`: This is the built-in locale provider in the JDK. It provides locale data that is compatible with previous versions of Java.

- `SPI`: This stands for Service Provider Interface. It allows for third-party or user-supplied locale services.

By setting `-Djava.locale.providers=COMPAT,SPI`, you're telling the JVM to first use the built-in locale provider for locale-sensitive data. If the built-in provider doesn't support the required locale, the JVM will then use any available locale services supplied via the Service Provider Interface.

You can set this property when starting your Java application from the command line like this:

```bash
java -Djava.locale.providers=COMPAT,SPI -jar your-application.jar
```

In the context of a Maven project, you can set this property in the `MAVEN_OPTS` environment variable or in the configuration for the Maven Surefire Plugin or the Maven Failsafe Plugin, which are used to run tests.

#### [JVM] `@` in JVM Options

The `@` symbol in JVM options is used to include options from a file. This is particularly useful when you have a large number of JVM options to set, and you want to manage them in a separate file rather than passing them all on the command line.

For example, if you have a file named `jvm.options` with the following content:

```shell
-Xms1024m
-Xmx2048m
```

You can include these options when starting your Java application like this:

```shell
java @jvm.options -jar myapp.jar

JVM_OPTIONS=$(cat jvm.options)
mvn spring-boot:run -Dspring-boot.run.jvmArguments="$JVM_OPTIONS" -Dstart-class=<Bootstrap-full-classname>
```

This will start the Java application with the JVM options specified in the `jvm.options` file.

#### [Java] `@Inject`

The selected code is a single line, `@Inject`, which is an annotation in Java. This annotation is part of the Java Dependency Injection specification (JSR-330), which is a standard for implementing dependency injection in Java.

```java
@Inject
public NonSpringClass(DependencyClassA dependencyA, DependencyClassB dependencyB) {
   this.dependencyB = dependencyB;
   this.dependencyA = dependencyA;
   NonSpringClass.instance = this;
}
```

In this context, `@Inject` is used to automatically inject an instance of `DependencyClassA` and `DependencyClassB` into the `NonSpringClass` class. The `DependencyClassA` and `DependencyClassB` are likely interfaces or classes that provide certain functionalities needed by `NonSpringClass`.

The `@Inject` annotation tells the dependency injection framework (like Spring or CDI) that it should initialize these fields when an instance of `NonSpringClass` is created. The framework will look for a bean of type `DependencyClassA` and `DependencyClassB` and assign them to the `dependencyA` and `dependencyB` fields respectively. This process is done at runtime, which means that the `NonSpringClass` class doesn't need to know where or how the `DependencyClassA` and `DependencyClassB` instances are created.

This approach is a key part of the Inversion of Control (IoC) design principle, which is widely used in modern Java frameworks. It allows for more modular, testable code by decoupling the creation of dependent objects from the classes that use them.

#### [Java] `NoClassDefFoundError` vs. `ClassNotFoundException`

`NoClassDefFoundError` and `ClassNotFoundException` are both related to Java's class loading mechanism, but they occur in different scenarios.

1. `NoClassDefFoundError`: This error is thrown when the Java Virtual Machine (JVM) or an instance of `ClassLoader` attempts to load the definition of a class, but the definition could not be found in the classpath. This typically happens when the class was present at compile time, but is missing at runtime. It's an `Error` which indicates that something went wrong during the execution of the program, and it's not meant to be caught by the application.

2. `ClassNotFoundException`: This exception is thrown when an application tries to load a class through its string name using methods like `Class.forName()` or `ClassLoader.loadClass()`, but the class with the specified name cannot be found. It's an `Exception` which indicates that the class was not found in the classpath at runtime. It's a checked exception, meaning it needs to be declared in a method or constructor's `throws` clause if it can be thrown by the execution of the method or constructor and propagate outside the method or constructor boundary.

In summary, `NoClassDefFoundError` is about the JVM not being able to find a class it was expecting to find due to a linkage error, while `ClassNotFoundException` is about the application code trying to load a class by its string name but not finding it.



The `NoClassDefFoundError` in Java is a subclass of `LinkageError` and it arises when a particular class is present at compile time, but it was missing at run time.

Here are some common reasons why you might be seeing this error:

1. The class isn't available in Java Classpath.
2. You might be running your program using `java` command and class was not found at runtime.
3. There could be a case where the class is present in the classpath, but it has incompatibilities with the Java runtime environment. This could be due to different versions of the class present at compile time and runtime.
4. If you're working with JAR files, then the class could be missing from the JAR.

To fix this error, you need to add the missing class into the classpath. The classpath can be set either via command-line or through an environment variable. If you're using an IDE like IntelliJ IDEA, you can set the classpath in the project structure dialog.

If you're running the program from the command line, you can use the `-cp` option with the `java` command to specify the classpath. For example:

```bash
java -cp .;your_jar.jar YourMainClass
```

In the above command, `.` means it will search in the current directory, `your_jar.jar` is the JAR file where your classes are present, and `YourMainClass` is the class containing the `main` method.

#### [Java] Print Stack Trace

```java
Arrays.stream(Thread.currentThread().getStackTrace()).forEach(System.out::println);
```

#### [Java] Thread Debug

[multithreading - how to find out who create a thread in java? - Stack Overflow](https://stackoverflow.com/questions/18999444/how-to-find-out-who-create-a-thread-in-java)

#### [Java] Remote Debug

```shell
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=\*:5005 @../argFile -jar ...
```

add `\` before `*`, after copy from IDEA

#### [Java] Enable Debug Output

```shell
java -Ddebug -jar 
```

#### [Java] Generate Debugging Information

[The javac Command](https://docs.oracle.com/en/java/javase/17/docs/specs/man/javac.html#option-parameters)

```shell
# both parameters and local variables
javac -g Main.java
javac -g:vars Main.java
# only parameters
javac -paramters Main.java
```

`.class` has parameter names

#### [Java] Reflection

differences between JDK8 and JDK17

`jdk.internal.reflect.DelegatingMethodAccessorImpl#invoke` different in `GeneratedMethodAccessor+num` , can't tell in source code

```java
sun.reflect.ReflectionFactory#inflationThreshold
sun.reflect.NativeMethodAccessorImpl#invoke
sun.reflect.NativeConstructorAccessorImpl#newInstance
```

```java
-Dsun.reflect.inflationThreshold=number
-Dsun.reflect.noInflation=true
```

Refer To:

[java - Why does autoboxing not use valueOf() when invoking via reflection? - Stack Overflow](https://stackoverflow.com/questions/54087689/why-does-autoboxing-not-use-valueof-when-invoking-via-reflection)

#### [Java] Local result is different from Other Environment, like in Pool or in remote node

Class load order: Spring Bean or `@PostConstruct` and Class Constructor or Class Static Block are exist in the same time.

JDK version or Maven version: If using reflection

#### [Java] Class path contains multiple SLF4J providers

```shell
SLF4J(W): Class path contains multiple SLF4J providers.
SLF4J(W): Found provider [org.slf4j.reload4j.Reload4jServiceProvider@1cf4f579]
SLF4J(W): Found provider [ch.qos.logback.classic.spi.LogbackServiceProvider@18769467]
SLF4J(W): See https://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J(E): Detected both log4j-over-slf4j.jar AND bound slf4j-log4j12.jar on the class path, preempting StackOverflowError. 
SLF4J(E): See also http://www.slf4j.org/codes.html#log4jDelegationLoop for more details.
Exception in thread "main" java.lang.reflect.InvocationTargetException
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.base/java.lang.reflect.Method.invoke(Method.java:568)
        at org.springframework.boot.loader.MainMethodRunner.run(MainMethodRunner.java:49)
        at org.springframework.boot.loader.Launcher.launch(Launcher.java:95)
        at org.springframework.boot.loader.Launcher.launch(Launcher.java:58)
        at org.springframework.boot.loader.JarLauncher.main(JarLauncher.java:65)
Caused by: java.lang.ExceptionInInitializerError
        at org.slf4j.reload4j.Reload4jServiceProvider.initialize(Reload4jServiceProvider.java:36)
        at org.slf4j.LoggerFactory.bind(LoggerFactory.java:199)
        at org.slf4j.LoggerFactory.performInitialization(LoggerFactory.java:186)
        at org.slf4j.LoggerFactory.getProvider(LoggerFactory.java:496)
        at org.slf4j.LoggerFactory.getILoggerFactory(LoggerFactory.java:482)
        at org.slf4j.LoggerFactory.getLogger(LoggerFactory.java:431)
        at org.apache.commons.logging.LogAdapter$Slf4jAdapter.createLocationAwareLog(LogAdapter.java:121)
        at org.apache.commons.logging.LogAdapter.createLog(LogAdapter.java:95)
        at org.apache.commons.logging.LogFactory.getLog(LogFactory.java:67)
        at org.apache.commons.logging.LogFactory.getLog(LogFactory.java:59)
        at org.springframework.boot.SpringApplication.<clinit>(SpringApplication.java:203)
        ... 8 more
Caused by: java.lang.IllegalStateException: Detected both log4j-over-slf4j.jar AND bound slf4j-log4j12.jar on the class path, preempting StackOverflowError. See also http://www.slf4j.org/codes.html#log4jDelegationLoop for more details.
        at org.slf4j.reload4j.Reload4jLoggerFactory.<clinit>(Reload4jLoggerFactory.java:55)
        ... 20 more
```

exclude org.slf4j:slf4j-reload4j

`mvn help:effective-pom -Dverbose -Doutput=effective-pom.xml` shows org.slf4j:slf4j-log4j12,
while `mvndt -Dverbose -Dincludes='org.slf4j:slf4j-log4j12'` doesn't, why? // TODO

#### [Maven] Weird Cases

```xml
<dependency>
   <groupId>org.apache.curator</groupId>
   <artifactId>curator-x-discovery</artifactId>
   <version>4.2.0</version>
</dependency>
```

org.apache.zookeeper:zookeeper:3.5.4-beta show in mvndt but not in effective-pom.xml, why? // TODO

#### [JavaEE] Jakarta EE 9

[Understanding Jakarta EE 9 | The Eclipse Foundation](https://www.eclipse.org/community/eclipse_newsletter/2020/november/1.php)

> it’s not backwards-compatible with Jakarta EE 8 or Java EE 8.

[Java EE vs J2EE vs Jakarta EE | Baeldung](https://www.baeldung.com/java-enterprise-evolution)

[Migrate to Jakarta EE 9 | OpenRewrite by Moderne](https://docs.openrewrite.org/recipes/java/migrate/jakarta/javaxmigrationtojakarta)

The change from `javax` to `jakarta` in Spring Boot 3 (and other frameworks) is primarily due to the **transition of Java EE (Enterprise Edition)** to **Jakarta EE**. This shift impacts a wide range of libraries and APIs that were previously part of Java EE and are now under the umbrella of the Eclipse Foundation as Jakarta EE.

##### Background:

- **Java EE** (Java Platform, Enterprise Edition) was originally developed by Sun Microsystems and later maintained by Oracle. Java EE included a set of APIs for building enterprise applications, such as servlets, JSP (Java Server Pages), EJB (Enterprise JavaBeans), and others. These APIs were packaged under the `javax` namespace (e.g., `javax.servlet`, `javax.persistence`).

- In 2017, Oracle decided to move Java EE to the **Eclipse Foundation**, which led to the formation of **Jakarta EE**. One of the major stipulations of this transition was that the **Java EE trademarks** and **namespace (`javax`)** could no longer be used by the Eclipse Foundation. Thus, **all Jakarta EE specifications** needed to be renamed from `javax` to `jakarta`.

- This change affects all implementations of Java EE, including Spring, which uses Java EE APIs in many of its modules (e.g., JPA, Servlets, JMS, etc.).

##### Key Reasons for the Change:

1. **Namespace Conflict:**  
   The primary reason for switching from `javax` to `jakarta` is a **naming conflict**. The **`javax`** namespace is trademarked by Oracle, and the Eclipse Foundation, which now manages Jakarta EE, was not allowed to use `javax` for its new platform. As a result, Jakarta EE adopted the `jakarta` namespace for all of its specifications (e.g., `jakarta.servlet`, `jakarta.persistence`, etc.).

2. **Independence and Modernization:**  
   The move to Jakarta EE under the Eclipse Foundation allows greater flexibility and independence. The foundation has more freedom to evolve the API and specifications without being tied to the constraints imposed by Oracle. This also allows Jakarta EE to modernize and adapt more quickly to current needs, including cloud-native, microservices, and containerized architectures.

3. **Compatibility with Spring Boot 3:**  
   Spring Boot 3 is based on Spring Framework 6, which aligns with Jakarta EE 9 (the version where this `javax` to `jakarta` shift occurred). As part of the upgrade to Jakarta EE 9, Spring Boot 3 migrated its dependencies from the `javax` namespace to the `jakarta` namespace to ensure compatibility with Jakarta EE 9 and later.

4. **Long-term Evolution:**  
   The transition is seen as a necessary step to allow Jakarta EE to evolve independently of the legacy Java EE models and technologies. Over time, the goal is for Jakarta EE to become a more modern, lightweight, and flexible set of specifications that will better meet the needs of current enterprise applications.

##### What Changed in Spring Boot 3?

1. **Namespace Changes:**
   In Spring Boot 3 (and Spring Framework 6), all Java EE-related classes and APIs have been updated to use the `jakarta` namespace instead of `javax`. For example:
   - `javax.servlet.*` → `jakarta.servlet.*`
   - `javax.persistence.*` → `jakarta.persistence.*`
   - `javax.validation.*` → `jakarta.validation.*`
   - `javax.enterprise.*` → `jakarta.enterprise.*`

2. **Dependencies Update:**
   - Spring Boot 3 uses **Jakarta EE 9** or later, meaning all dependencies related to Jakarta EE must be updated. For example:
      - Hibernate, which was previously under the `javax.persistence` namespace, is now under `jakarta.persistence`.
      - Servlet APIs, CDI (Contexts and Dependency Injection), and others that were previously under `javax` have been migrated to `jakarta`.

3. **Code Changes in Applications:**
   - If you were using Spring Boot 2.x with Java EE (javax) APIs and you upgrade to Spring Boot 3, you may need to refactor your application to change the imports from `javax.*` to `jakarta.*`.
   - This refactoring can also affect any application code that directly interacts with Java EE APIs (e.g., using JPA, CDI, or Servlet APIs).

4. **Backward Compatibility:**
   - Spring Boot 3 and Spring Framework 6 no longer support the old `javax` namespaces. This means that if your project still relies on Java EE 8 (which uses the `javax` namespace), it will not work out of the box with Spring Boot 3. You'll need to update both your dependencies and your code to the new `jakarta` namespace.

##### Example of the Change:
Here's how the change impacts your code:

##### Before (Spring Boot 2.x, Java EE):
```java
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User {
   @Id
   private Long id;
   private String name;
}
```

##### After (Spring Boot 3, Jakarta EE):
```java
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User {
   @Id
   private Long id;
   private String name;
}
```

As you can see, the only difference is the package name (`javax.persistence` → `jakarta.persistence`).

##### How to Migrate:

- **Update dependencies:** Make sure you are using Jakarta EE 9 (or later) compatible versions of your dependencies (e.g., Hibernate, Spring Data JPA, etc.).
- **Refactor imports:** Update your imports from `javax.*` to `jakarta.*` in your code.
- **Check for breaking changes:** Some APIs may have changed or been deprecated, so it's important to consult the migration guides of the libraries you use (e.g., Hibernate, Spring Data).

##### Conclusion:

The shift from `javax` to `jakarta` in Spring Boot 3 is a consequence of the transition from Java EE to Jakarta EE, which is now under the Eclipse Foundation. This change is necessary to align with the new namespace rules and the evolving Jakarta EE platform. It impacts developers because they need to update their imports and dependencies to use the new `jakarta` namespace. While this change is significant, it provides a path for the modernization and continued evolution of enterprise Java technologies.

#### [OpenSearch] ElasticSearch Migrates to OpenSearch

[GitHub - opensearch-project/spring-data-opensearch: The Spring Data OpenSearch project provides Spring Data compatible integration with the OpenSearch search engine.](https://github.com/opensearch-project/spring-data-opensearch)



[Introduction to Spring Data Elasticsearch | Baeldung](https://www.baeldung.com/spring-data-elasticsearch-tutorial)

[Language clients - OpenSearch Documentation](https://opensearch.org/docs/latest/clients/)

spring-data-elasticsearch migrates to spring-data-opensearch-starter

[opensearch-project/spring-data-opensearch](https://github.com/opensearch-project/spring-data-opensearch)

[Migration Guides :: Spring Data Elasticsearch](https://docs.spring.io/spring-data/elasticsearch/reference/migration-guides.html)

[[FEATURE] Reactive Client for OpenSearch · Issue #108 · opensearch-project/spring-data-opensearch](https://github.com/opensearch-project/spring-data-opensearch/issues/108)

[[FEATURE] Reactive version of the clients · Issue #23 · opensearch-project/spring-data-opensearch](https://github.com/opensearch-project/spring-data-opensearch/issues/23)

> Reactive client replaced with WebClient + AWS



#### [OpenSearch] OpenSearch 2.x with Apache HttpClient 4.x

[Include HttpClient 5.X for the rest client · Issue #9718 · opensearch-project/OpenSearch](https://github.com/opensearch-project/OpenSearch/issues/9718)

Spring Web 6 with Apache HttpClient 5.x

OpenSearch with Apache HttpClient 4.x

```kotlin
import org.springframework.data.elasticsearch.client.ClientConfiguration
import org.springframework.data.elasticsearch.client.reactive.ReactiveElasticsearchClient
import org.springframework.data.elasticsearch.client.reactive.ReactiveRestClients

fun createReactiveClient(esClientConfiguration: EsClientConfiguration): ReactiveElasticsearchClient =
   ReactiveRestClients.create(clientConfiguration(esClientConfiguration))

private fun clientConfiguration(esClientConfiguration: EsClientConfiguration): ClientConfiguration {
   val maybeSecureClientConfigurationBuilder = ClientConfiguration.builder()
      .connectedTo(esClientConfiguration.hostAndPort)

   maybeSecureClientConfigurationBuilder.withConnectTimeout(esClientConfiguration.connectTimeout)
      .withSocketTimeout(esClientConfiguration.socketTimeout)
      .withWebClientConfigurer { webClient ->
         val exchangeStrategies = ExchangeStrategies.builder()
            .codecs { configurer -> configurer.defaultCodecs().maxInMemorySize(-1) }.build()
         webClient.mutate().exchangeStrategies(exchangeStrategies).build()
      }
   return maybeSecureClientConfigurationBuilder.build()
}

override fun findProducts(epid: String): Flux<ProductEntity> {
   return monoSupplier { esRequestBuilder.matchEpidRequest(epid) }
      .doOnNext { logger.debug("Fetching product $epid from elastic search repository") }
      .flatMapMany { reactiveElasticsearchClient.search(it).transform { f -> esRetryableFilter.toRetryable(f) } }
      .map { it.sourceAsString }
      .flatMap { fromJsonToProduct(it) }
      .onErrorResume { t -> EsRepositoryException("Failed to find epid $epid from elastic search repository", t).toMono() }
}

```

```kotlin
import org.opensearch.client.opensearch.OpenSearchClient
import org.opensearch.data.client.orhlc.ClientConfiguration
import org.opensearch.data.client.orhlc.RestClients
import org.opensearch.data.client.osc.OpenSearchClients
import org.springframework.web.reactive.function.client.WebClient

fun createClient(esClientConfiguration: EsClientConfiguration): OpenSearchClient {
   val restClient = RestClients.create(clientConfiguration(esClientConfiguration)).lowLevelRest()
   val openSearchClient = OpenSearchClients.createImperative(restClient)
   return openSearchClient
}

private fun clientConfiguration(esClientConfiguration: EsClientConfiguration): ClientConfiguration {
   val maybeSecureClientConfigurationBuilder = ClientConfiguration.builder()
      .connectedTo(esClientConfiguration.hostAndPort)

   maybeSecureClientConfigurationBuilder.withConnectTimeout(esClientConfiguration.connectTimeout)
      .withSocketTimeout(esClientConfiguration.socketTimeout)
      .withClientConfigurer {
         ClientConfiguration.ClientConfigurationCallback { webClient: WebClient.Builder ->
            val exchangeStrategies = ExchangeStrategies.builder()
               .codecs { configurer -> configurer.defaultCodecs().maxInMemorySize(-1) }.build()
            webClient.exchangeStrategies(exchangeStrategies)
         }
      }
   return maybeSecureClientConfigurationBuilder.build()
}

override fun findProducts(epid: String): Flux<ProductEntity> {
   return monoSupplier { esRequestBuilder.matchEpidRequest(epid) }
      .doOnNext { logger.debug("Fetching product $epid from elastic search repository") }
      .flatMapMany { Flux.fromStream(reactiveElasticsearchClient.search(it,ProductEntity::class.java).hits().hits().stream()).transform { f -> esRetryableFilter.toRetryable(f) }
      }
      .map { it.toJsonString() }
      .flatMap { fromJsonToProduct(it) }
      .onErrorResume { t -> EsRepositoryException("Failed to find epid $epid from elastic search repository", t).toMono() }
}
```



#### [Apache HttpClient] Apache HttpClient 5.x Migration Guide

[Apache HttpComponents – Apache HttpClient 5.x migration guide](https://hc.apache.org/httpcomponents-client-5.4.x/migration-guide/index.html)

#### [Fasterxml Jackson] @JsonInclude

```java 
@JsonInclude(JsonInclude.Include.NON_NULL)
```

If `@JsonInclude` declared on a class, it can be overridden by inheritance. If `@JsonInclude` declared on a methods, it still works

```java
@JsonInclude(JsonInclude.Include.NON_EMPTY)
class Parent {
   String parent;
}
@JsonInclude(JsonInclude.Include.NON_NULL)
class Son extends Parent {
   String son;
}
// in class Son, parent will finially use `@JsonInclude(JsonInclude.Include.NON_NULL)`
```

#### [Fasterxml Jackson] Initailization Order

Stack

```
StdValueInstantiator.configureFromIntCreator
CreatorCollector.constructValueInstantiator
BasicDeserializerFactory
BeanDeserializerFactory

DeserializerCache._createDeserializer2

DefaultDeserializationContext$Impl._cache

ObjectMapper#_rootDeserializers
ObjectMapper._findRootDeserializer
ObjectMapper.readValue

---
POJOPropertiesCollector.collectAll()
```

#### [Jackson] codehaus vs. fasterxml

JacksonTestSuite

```java
import org.junit.jupiter.api.Test;

import java.util.List;

public class JacksonTestSuite {
   public final static String json = "{\"obj\":[{\"name\":\"hello\"}]}";
   protected final org.codehaus.jackson.map.ObjectMapper codehaus = new org.codehaus.jackson.map.ObjectMapper();
   protected final com.fasterxml.jackson.databind.ObjectMapper fasterxml = new com.fasterxml.jackson.databind.ObjectMapper();

   //    static class Obj {
   class Obj {
      private List<String> obj;
      //        private List<Obj> obj;
      private String name;

//        public List<Obj> getObj() {
//            return obj;
//        }
//
//        public void setObj(List<Obj> obj) {
//            this.obj = obj;
//        }
//
//        public String getName() {
//            return name;
//        }
//
//        public void setName(String name) {
//            this.name = name;
//        }
   }

   @Test
   public void test() throws IOException {
      Obj objc = codehaus.readValue(json, Obj.class);
      Obj objf = fasterxml.readValue(json, Obj.class);
      System.out.println();
   }
}
```

pom.xml

```xml
<dependency>
   <groupId>org.codehaus.jackson</groupId>
   <artifactId>jackson-mapper-asl</artifactId>
   <version>1.9.13</version>
</dependency>
<dependency>
<groupId>com.fasterxml.jackson.core</groupId>
<artifactId>jackson-databind</artifactId>
<version>2.17.2</version>
</dependency>
```



```shell
org.codehaus.jackson.map.JsonMappingException: No suitable constructor found for type [simple type, class JacksonTestSuite$Obj]: can not instantiate from JSON object (need to add/enable type information?)
 at [Source: java.io.StringReader@3b6d844d; line: 1, column: 2]

	at org.codehaus.jackson.map.JsonMappingException.from(JsonMappingException.java:163)
	at org.codehaus.jackson.map.deser.BeanDeserializer.deserializeFromObjectUsingNonDefault(BeanDeserializer.java:746)
	at org.codehaus.jackson.map.deser.BeanDeserializer.deserializeFromObject(BeanDeserializer.java:683)
	at org.codehaus.jackson.map.deser.BeanDeserializer.deserialize(BeanDeserializer.java:580)
	at org.codehaus.jackson.map.ObjectMapper._readMapAndClose(ObjectMapper.java:2732)
	at org.codehaus.jackson.map.ObjectMapper.readValue(ObjectMapper.java:1863)
```

```shell
com.fasterxml.jackson.databind.exc.InvalidDefinitionException: Cannot construct instance of `JacksonTestSuite$Obj`: non-static inner classes like this can only by instantiated using default, no-argument constructor
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 2]

	at com.fasterxml.jackson.databind.exc.InvalidDefinitionException.from(InvalidDefinitionException.java:67)
	at com.fasterxml.jackson.databind.DeserializationContext.reportBadDefinition(DeserializationContext.java:1887)
	at com.fasterxml.jackson.databind.DatabindContext.reportBadDefinition(DatabindContext.java:414)
	at com.fasterxml.jackson.databind.DeserializationContext.handleMissingInstantiator(DeserializationContext.java:1370)
	at com.fasterxml.jackson.databind.deser.BeanDeserializerBase.deserializeFromObjectUsingNonDefault(BeanDeserializerBase.java:1500)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserializeFromObject(BeanDeserializer.java:348)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:185)
	at com.fasterxml.jackson.databind.deser.DefaultDeserializationContext.readRootValue(DefaultDeserializationContext.java:342)
	at com.fasterxml.jackson.databind.ObjectMapper._readMapAndClose(ObjectMapper.java:4905)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3848)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3816)
```

Make the class static if it is a inner class

Add non-parameter constructor if there are other constructors with parameters



```shell
org.codehaus.jackson.map.exc.UnrecognizedPropertyException: Unrecognized field "obj" (Class JacksonTestSuite$Obj), not marked as ignorable
 at [Source: java.io.StringReader@3b6d844d; line: 1, column: 9] (through reference chain: .Obj["obj"])

	at org.codehaus.jackson.map.exc.UnrecognizedPropertyException.from(UnrecognizedPropertyException.java:53)
	at org.codehaus.jackson.map.deser.StdDeserializationContext.unknownFieldException(StdDeserializationContext.java:267)
	at org.codehaus.jackson.map.deser.std.StdDeserializer.reportUnknownProperty(StdDeserializer.java:673)
	at org.codehaus.jackson.map.deser.std.StdDeserializer.handleUnknownProperty(StdDeserializer.java:659)
	at org.codehaus.jackson.map.deser.BeanDeserializer.handleUnknownProperty(BeanDeserializer.java:1365)
	at org.codehaus.jackson.map.deser.BeanDeserializer._handleUnknown(BeanDeserializer.java:725)
	at org.codehaus.jackson.map.deser.BeanDeserializer.deserializeFromObject(BeanDeserializer.java:703)
	at org.codehaus.jackson.map.deser.BeanDeserializer.deserialize(BeanDeserializer.java:580)
	at org.codehaus.jackson.map.ObjectMapper._readMapAndClose(ObjectMapper.java:2732)
	at org.codehaus.jackson.map.ObjectMapper.readValue(ObjectMapper.java:1863)
```

```shell
com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException: Unrecognized field "obj" (class JacksonTestSuite$Obj), not marked as ignorable (0 known properties: ])
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: JacksonTestSuite$Obj["obj"])

	at com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException.from(UnrecognizedPropertyException.java:61)
	at com.fasterxml.jackson.databind.DeserializationContext.handleUnknownProperty(DeserializationContext.java:1153)
	at com.fasterxml.jackson.databind.deser.std.StdDeserializer.handleUnknownProperty(StdDeserializer.java:2241)
	at com.fasterxml.jackson.databind.deser.BeanDeserializerBase.handleUnknownProperty(BeanDeserializerBase.java:1793)
	at com.fasterxml.jackson.databind.deser.BeanDeserializerBase.handleUnknownVanilla(BeanDeserializerBase.java:1771)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.vanillaDeserialize(BeanDeserializer.java:316)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:177)
	at com.fasterxml.jackson.databind.deser.DefaultDeserializationContext.readRootValue(DefaultDeserializationContext.java:342)
	at com.fasterxml.jackson.databind.ObjectMapper._readMapAndClose(ObjectMapper.java:4905)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3848)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3816)
```

Add setter to the class



```shell
com.fasterxml.jackson.databind.exc.MismatchedInputException: Cannot deserialize value of type `java.lang.String` from Object value (token `JsonToken.START_OBJECT`)
 at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); line: 1, column: 9] (through reference chain: JacksonTestSuite$Obj["obj"]->java.util.ArrayList[0])

	at com.fasterxml.jackson.databind.exc.MismatchedInputException.from(MismatchedInputException.java:59)
	at com.fasterxml.jackson.databind.DeserializationContext.reportInputMismatch(DeserializationContext.java:1767)
	at com.fasterxml.jackson.databind.DeserializationContext.handleUnexpectedToken(DeserializationContext.java:1541)
	at com.fasterxml.jackson.databind.DeserializationContext.handleUnexpectedToken(DeserializationContext.java:1446)
	at com.fasterxml.jackson.databind.DeserializationContext.extractScalarFromObject(DeserializationContext.java:958)
	at com.fasterxml.jackson.databind.deser.std.StdDeserializer._parseString(StdDeserializer.java:1441)
	at com.fasterxml.jackson.databind.deser.std.StringCollectionDeserializer.deserialize(StringCollectionDeserializer.java:218)
	at com.fasterxml.jackson.databind.deser.std.StringCollectionDeserializer.deserialize(StringCollectionDeserializer.java:184)
	at com.fasterxml.jackson.databind.deser.std.StringCollectionDeserializer.deserialize(StringCollectionDeserializer.java:27)
	at com.fasterxml.jackson.databind.deser.impl.MethodProperty.deserializeAndSet(MethodProperty.java:129)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.vanillaDeserialize(BeanDeserializer.java:310)
	at com.fasterxml.jackson.databind.deser.BeanDeserializer.deserialize(BeanDeserializer.java:177)
	at com.fasterxml.jackson.databind.deser.DefaultDeserializationContext.readRootValue(DefaultDeserializationContext.java:342)
	at com.fasterxml.jackson.databind.ObjectMapper._readMapAndClose(ObjectMapper.java:4905)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3848)
	at com.fasterxml.jackson.databind.ObjectMapper.readValue(ObjectMapper.java:3816)
```

```java
Obj objc = codehaus.readValue(json, Obj.class);
String value = codehaus.writeValueAsString(objc);
System.out.println(value);

// output:
// {"obj":["{","name","hello","}"]}
// {"obj":[{"name":"hello"}]} // origin
```



Refer To:

[Jackson Tutorial | Baeldung](https://www.baeldung.com/jackson)

[Jackson - Unmarshall to Collection/Array | Baeldung](https://www.baeldung.com/jackson-collection-array)

#### [Spring Framework] 8080 was already in use

```shell

***************************
APPLICATION FAILED TO START
***************************

Description:

Web server failed to start. Port 8080 was already in use.

Action:

Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.

```

```shell
lsof -i :8080
kill [pid]
```

#### [Spring Framework] Spring Can Not Load `*.properties`

In a Spring Boot application, properties are typically loaded from an `application.properties` or `application.yml` file located in the `src/main/resources` directory. If Spring is unable to load properties, it could be due to several reasons:

1. The properties file is not located in the `src/main/resources` directory.
2. The properties file is not named `application.properties` or `application.yml`.
3. There's an issue with the file format. For a `.properties` file, each line should be a key-value pair separated by an equals sign (`=`), and comments should start with a hash (`#`). For a `.yml` file, properties should be specified in YAML format.

If you're trying to load properties from a different file or location, you can use the `@PropertySource` annotation in your configuration class. Here's an example:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application-Dev.properties")
public class AppConfig {
   // ...
}
```

Spring will load properties from the `application.properties` file in the classpath. If the file is in a different location, you can specify the full path to the file.

How to validate?

In Spring, you can validate if properties are loaded by injecting them into your classes using the `@Value` annotation. If the properties are not loaded correctly, Spring will throw a `BeanCreationException` during the startup.

Here's an example of how you can validate if a property is loaded:

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PropertyValidator {

   @Value("${properties.keys...}")
   private String key;

   public void validate() {
      if (key == null || key.isEmpty()) {
         throw new RuntimeException("Property 'properties.keys...' is not loaded correctly");
      }
      // Add more validation logic for other properties as needed
   }
}
```

The `validate` method checks if the property is loaded correctly and throws a `RuntimeException` if it's not.

You can call the `validate` method during the startup of your application to ensure that all properties are loaded correctly. If any property is not loaded, the application will fail to start, indicating that there's an issue with the properties loading.

#### [Spring Framework] `@Inject` vs. `@Autowire`

Both `@Inject` and `@Autowired` are used for dependency injection in Spring, but they come from different specifications and have some differences in behavior.

`@Autowired` is a Spring-specific annotation for dependency injection. It can be used on fields, constructors, and setter methods. By default, it requires the dependency to be present, and it will fail with an exception if the Spring container cannot find a bean to inject. However, you can make it optional by setting `@Autowired(required = false)`.

`@Inject` is part of the Java CDI (Contexts and Dependency Injection) standard, which is a part of JSR-330. It's not specific to Spring and can be used in any Java application that supports CDI. Like `@Autowired`, it can be used on fields, constructors, and setter methods. However, unlike `@Autowired`, it doesn't have a `required` attribute, so it always requires the dependency to be present.

In terms of functionality, both annotations do the same thing in a Spring application, and you can use either one depending on your preference and whether you want to stick to Spring-specific or standard Java annotations. However, if you're using Spring, `@Autowired` has a bit more functionality because it can be made optional and can also be used with the `@Qualifier` annotation to specify which of several beans of the same type to inject.

#### [Spring Framework] Best Practics of `@Autowired`

1. **Field Injection vs Constructor Injection:** It's generally recommended to use constructor-based dependency injection over field injection. Constructor injection can help to ensure that an object is fully initialized before it's used and also promotes immutability because fields can be marked as `final`.

```java
@Component
public class SomeClass {
   private final SomeDependency someDependency;

   @Autowired
   public SomeClass(SomeDependency someDependency) {
      this.someDependency = someDependency;
   }
}
```

2. **Avoiding `@Autowired` on Fields:** As mentioned above, it's better to use constructor injection. Autowiring fields directly can lead to harder-to-find bugs because the fields are set after the constructor has run and can be `null` until then.

3. **Use of `@Autowired` on Optional Dependencies:** If a dependency is not crucial for the operation of your class, you can use `@Autowired(required = false)` to tell Spring that it's okay if the dependency isn't found.

4. **Use of `@Autowired` on Collections:** If you have multiple beans of the same type, you can inject all of them by using `@Autowired` on a collection. Spring will provide all the beans of that type.

```java
@Autowired
private List<SomeDependency> allSomeDependencies;
```

5. **Use of `@Qualifier` with `@Autowired`:** If you have multiple beans of the same type and want to wire in a specific one, you can use the `@Qualifier` annotation along with `@Autowired` to specify which bean you want.

```java
@Autowired
@Qualifier("specificBeanName")
private SomeDependency someDependency;
```

6. **Avoiding `@Autowired` in Configuration Classes:** It's generally not a good idea to use `@Autowired` in `@Configuration` classes. Instead, use method injection.

```java
@Configuration
public class AppConfig {
   @Bean
   public SomeDependency someDependency(AnotherDependency anotherDependency) {
      return new SomeDependency(anotherDependency);
   }
}
```

7. **Use of `@Autowired` on Methods:** You can use `@Autowired` on methods to let Spring know that the method will be used to set dependencies. This can be useful when you need to do some additional setup after the dependencies are set.

```java
@Autowired
public void setSomeDependency(SomeDependency someDependency) {
   this.someDependency = someDependency;
   // Additional setup code here
}
```

Remember, these are general guidelines and there might be exceptions based on your specific use case.

#### [Spring Framework] Inject A Non-Spring-Managed Bean in Spring-Managed Class

First of all, it's the best practice to refactor the project to make sure classes managerd by Spring.

If there's a class can be modified, there're several ways to achieve this goal:

In Spring, there are several alternatives to using `@Component` for defining beans:

**@Configuration**: This is used for configuration classes. These classes can contain `@Bean` methods to define beans.

**@Bean**: This is used in `@Configuration` classes to define beans. The method annotated with `@Bean` is called to create the bean.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
   @Bean
   public MyBean myBean() {
      return new MyBean();
   }
}
```

In Spring, `@Configuration` and `@Bean` annotations are used for Java-based configuration. They provide an alternative to XML-based configuration.

`@Configuration` is a class-level annotation indicating that an object is a source of bean definitions. The classes annotated with `@Configuration` are processed by the Spring container to generate bean definitions and service requests for those beans at runtime.

`@Bean` is a method-level annotation used with `@Configuration` to create a spring bean. The method annotated with `@Bean` works as bean ID and it creates and returns the actual bean.

Here are some best practices:

1. **Use `@Configuration` for global configuration**: If you have some beans that need to be shared across multiple parts of the application, you can define them in a `@Configuration` class.

2. **Use `@Bean` for externalized creation logic**: If the creation of a bean requires some custom logic that can't be expressed with simple instantiation (like calling a constructor), you can use a `@Bean` method.

3. **Use `@Bean` for third-party classes**: If you need to manage a third-party class as a bean (like a non-Spring-managed class in dependency package), you can do so with a `@Bean` method.

4. **Avoid circular dependencies**: Circular dependencies can lead to unexpected behavior or even application failure. Always check your `@Configuration` classes to ensure that there are no circular dependencies between your beans.

Here's an example of how to use `@Configuration` and `@Bean`:

```java
@Configuration
public class AppConfig {

   @Bean
   public AClass aClass() {
      return new AClass();
   }

   @Bean
   public BClass bClass(AClass aClass) {
      return new BClass(aClass);
   }
}
```

In this example, `AppConfig` is a `@Configuration` class that defines two beans: `AClass` and `BClass`. The `bClass` bean is dependent on the `aClass` bean, and this dependency is injected through the `bClass` method's parameter.

[Super simple approach to accessing Spring beans from non-Spring managed classes and POJOs - Tech Knowledge Base - jaytaala.com Confluence](https://confluence.jaytaala.com/display/TKB/Super+simple+approach+to+accessing+Spring+beans+from+non-Spring+managed+classes+and+POJOs)

```java
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Deprecated
@Component
public class SpringContext implements ApplicationContextAware {

   private static ApplicationContext context;

   public static ApplicationContext getApplicationContext() {
      return context;
   }

   public static Object getBean(String beanName) {
      return context.getBean(beanName);
   }

   public static <T> T getBean(Class<T> clazz) {
      return context.getBean(clazz);
   }

   @Override
   public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
      setContext(context);
   }


   // Private method context setting (better practice for setting a static field in a bean instance
   private static synchronized void setContext(ApplicationContext context) {
      SpringContext.context = context;
   }
}
```



Both `@Configuration` with `@Bean` and using `SpringContext` to get a bean have their own use cases and it depends on the specific requirements of your application.

1. **Using `@Configuration` and `@Bean`**: This is the recommended way for defining and managing beans in Spring. It provides a centralized way of managing your beans and their dependencies. It's easier to test and debug because the Spring container manages the lifecycle of the beans.
2. **Using `SpringContext` to get a bean**: This is typically used when you need to access a Spring-managed bean in a non-Spring-managed class. However, it's generally not recommended because it can make your code harder to test and debug. It also couples your code to Spring, which can make it harder to change your framework later.

Best Practice

Add `@Component` to `NonSpringClass`, and then make sure the initialization order.

```java
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NonSpringClass {

   private static NonSpringClass INSTANCE;

   @Autowired
   private DependencyClassA dependencyA;

   @PostConstruct
   public void init() {
      INSTANCE = this;
   }

   public static NonSpringClass getInstance() {
      return INSTANCE;
   }

   public String call(String a, String b) {
      return dependencyA.call(a, b);
   }
}
```

In the past,

```java
new NonSpringClass().call("a", "b");
```

After refactor,

```java
NonSpringClass.getInstance().call("a", "b");
```

In cases where there are multiple construtors or a non-param constructor is required,

```java
@Component
@DependsOn(BeanB.BEAN_NAME)
public class BeanA {},
@Component(BeanB.BEAN_NAME)
public class BeanB {
   public static final String BEAN_NAME = "beanB";
}
```





#### [Spring Framework] Application Context Is `null`

This could be due to the `SpringContext` not being properly initialized with the `ApplicationContext`.

In Spring, the `ApplicationContext` is not fully initialized until after all `@PostConstruct` methods have been called. This means that if you're trying to use `SpringContext.getBean` in a `@PostConstruct` method, the `ApplicationContext` may not be fully initialized yet, leading to a `NullPointerException`.

To fix this issue, you can use `ApplicationContextAware` to set the `ApplicationContext` in `SpringContext`. Here's how you can do it:

```java
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class SpringContext implements ApplicationContextAware {

   private static ApplicationContext context;

   @Override
   public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
      context = applicationContext;
   }

   public static <T extends Object> T getBean(Class<T> beanClass) {
      return context.getBean(beanClass);
   }
}
```

In this code, `SpringContext` implements `ApplicationContextAware` which is a callback to set the `ApplicationContext`. The `setApplicationContext` method is called by Spring after the context is initialized, setting the context in `SpringContext`. Now, when you call `SpringContext.getBean`, it should not be `null`.

If you're still encountering issues, it might be due to the order of Spring's initialization process. The `ApplicationContext` might not be fully initialized when your `@PostConstruct` method is being called.

One way to solve this issue is to implement `InitializingBean` and override the `afterPropertiesSet` method. This method is guaranteed to be called when all properties have been set and the `ApplicationContext` is fully initialized.

Here's how you can modify your `SpringClass`:

```java
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

@Component
public class SpringClass implements InitializingBean {
   SpringClass() {
      System.out.println("SpringClass is initialized");
   }

   @Override
   public void afterPropertiesSet() throws Exception {
      String echo = SpringContext.getBean(NonSpringClass.class).echo("Hello, Spring!");
      System.out.println(echo);
      System.out.println("SpringClass is initialized");
   }
}
```

In this code, `SpringClass` implements `InitializingBean` and the `afterPropertiesSet` method is called after all properties have been set and the `ApplicationContext` is fully initialized. This should ensure that `SpringContext.getBean(NonSpringClass.class)` does not return `null`.

#### [Spring Framework] Orders of Bean Initialization

~~Default Order: Class name alphabet. (System default order)~~

~~Package name and `@Qualifier` have no effect.~~

~~Classes configured in `@DependsOn` maintain the default order.~~

How to Check Orders of Bean Initialization

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

@Component
public class BeanInitializationLogger implements BeanPostProcessor {

   @Override
   public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
      System.out.println("// TODO debug Before Initialization of bean " + beanName);  // TODO debug
      return bean;
   }

   @Override
   public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
      System.out.println("// TODO debug After Initialization of bean " + beanName);   // TODO debug
      return bean;
   }
}
```

Refer To:

[@Order in Spring | Baeldung](https://www.baeldung.com/spring-order)

[Controlling Bean Creation Order with @DependsOn | Baeldung](https://www.baeldung.com/spring-depends-on)

[java - Spring: Make sure a particular bean gets initialized first - Stack Overflow](https://stackoverflow.com/questions/7868335/spring-make-sure-a-particular-bean-gets-initialized-first)

#### [Spring Framework] The Lifecycle of A Spring Bean

Here's the order of invocation in a single bean:
Bean instantiation
Dependency injection
@PostConstruct annotated method
afterPropertiesSet() method (implements InitializingBean), after `BeanFactory` has set all bean properties
Any custom init-method definitions



Constructor Injection

Setter Injection



Refer To:

[Customizing the Nature of a Bean :: Spring Framework](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html#beans-factory-lifecycle-default-init-destroy-methods)

#### [Spring Framework] `@ComponentScan`

Include

```java
@ComponentScan(
        basePackages = "base.package.name",
        useDefaultFilters = false,
        includeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = IncludedBean.class)
)
```

exclude

```java
@ComponentScan(
        basePackages = "base.package.name",
        useDefaultFilters = false,
        excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = ExcludedBean.class)
)
```

regex

```java
@ComponentScan(
        excludeFilters = {
                @ComponentScan.Filter(type = FilterType.REGEX, pattern ="default\\.base\\.package\\.name.+"),
        }
)
```

It's full sentence match because it uses `matches` instead of `find` in code.



`@ComponentScan` is `@Repeatable`, but note that it will overwrite the default one when defined in  `@SpringBootApplication`.

#### [Spring Framework] Debug

To diagnose the issue, you can enable debug logging for Spring Boot. This will provide a detailed condition evaluation report, which can help identify the root cause of the problem.

To enable debug logging, you can do one of the following:

1. **Add `--debug` to the command line when running your application:**

   ```sh
   ./mvnw spring-boot:run --debug
   ```

   or

   ```sh
   java -jar your-application.jar --debug
   ```

2. **Set the `debug` property to `true` in your `application.properties` file:**

   ```properties
   debug=true
   ```

3. **Set the `debug` property to `true` in your `application.yml` file:**

   ```yaml
   debug: true
   ```

After enabling debug logging, re-run your application and check the logs for detailed information about the condition evaluation report. This should help you identify the specific issue causing the `ApplicationContext` startup error.



```shell
... Loading source class 
... 
============================
CONDITIONS EVALUATION REPORT
============================


Positive matches:
-----------------
...

Negative matches:
-----------------
...

Exclusions:
-----------
...

Unconditional classes:
----------------------
...

... Application failed to start due to an exception

```

It doesn't seem to help the problems of bean intialization failure

Refer To:

[Spring Framework Reference Documentation](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/index.html)

#### [Spring Framework] Merge Multiple Application Context

First of all, separate components to make sure no components

```java
@ComponentScan(
        basepackages={...}
useDefaultFilters = false,
includeFilters = {
@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {ClassBelongsToAnnotationAC.class, ...})
        },
excludeFilters = {
@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
        ClassBelongsToClassPathXmlAC.class, ...})
        }
        )
```

```xml
<context:component-scan base-package="...">
   <context:exclude-filter type="assignable" expression="full qualified class name of ClassBelongsToAnnotationAC"/>
</context:component-scan>
```



General Application Context:

* AnnotationConfigApplicationContext
* ClassPathXmlApplicationContext



merge ClassPathXmlApplicationContext into AnnotationConfigApplicationContext

```java
@Configuration
@ImportResource("classpath:/pathto/....xml") // import file
// @Import({A.class, ...}) // import class
```



merge AnnotationConfigApplicationContext into ClassPathXmlApplicationContext

```java
// This class should be included in AnnotationConfigApplicationContext and excluded in ClassPathXmlApplicationContext
@Component
public class NewClassPathXmlACClass implements ApplicationContextAware {
   private ApplicationContext applicationContext;

   @Override
   public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
      this.applicationContext = applicationContext;
   }

   public void init() {
      ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(new String[]{"....xml"}, applicationContext);
   }
}
```

#### [Spring Framework] `@Profile `

```java
@Profile("development")
@Profile({"development", "production"})
@Profile("!development")
```

The profile string may contain a simple profile name (for example, `production`) or a profile expression. A profile expression allows for more complicated profile logic to be expressed (for example, `production & us-east`). The following operators are supported in profile expressions:

- `!`: A logical `NOT` of the profile
- `&`: A logical `AND` of the profiles
- `|`: A logical `OR` of the profiles

Refer To:

[Environment Abstraction :: Spring Framework](https://docs.spring.io/spring-framework/reference/core/beans/environment.html)

#### [Spring Framework] Dependency Cycle

```shell
***************************
APPLICATION FAILED TO START
***************************

Description:

The dependencies of some of the beans in the application context form a cycle:

   <Abean name> (field <Bbean as a field in Abean> <Abean full qualified class name>.<field of Bbean>)
      ↓
   <Bbean name> (field private <Cbean as a field in Bbean> <Bbean full qualified class name>.<field of Cbean>)
      ↓
   <Cbean name> // use setter injection so there's no more tip
      ↓
   <Dbean name>
┌─────┐
|  <Ebean name> (field <Fbean as a field in Ebean> <Ebean full qualified class name>.<field of Fbean>)
↑     ↓
|  <Fbean name>
└─────┘


Action:

Relying upon circular references is discouraged and they are prohibited by default. Update your application to remove the dependency cycle between beans. As a last resort, it may be possible to break the cycle automatically by setting spring.main.allow-circular-references to true.
```

```shell
┌─────┐
|  <Abean name> defined in URL [jar:file:/pathto/library.jar!/pathto/Abean.class]
↑     ↓
|  <Bbean name>
↑     ↓
|  <Cbean name> (field private <Dbean as a field in Cbean> <Cbean full qualified class name>.<field of Dbean>)
↑     ↓
|  <Dbean name>
└─────┘
```

Temprorary Solution:

```properties
# application.properties
spring.main.allow-circular-references=true
```

Final Solution:

Remove the dependency cycle between Ebean and Fbean.

If `spring.main.allow-circular-references=true` exists, and beans are from library, build libraries with `-parameter` and upgrade `maven-compiler-plugin` to `3.6.2`
Check new-added Spring bean, reorder with `@DependsOn` or constructor injection

#### [Spring Framework] Mulitple Path Mapping

```
@Path("/{path:aaa/aa/a|bbb/bb/b")
```

#### [Spring Framework] `<constructor-arg name=.../>`

Spring Framework 6 or later: must be compiled with the `-parameters` flag enabled

```xml
<plugin>
   <artifactId>maven-compiler-plugin</artifactId>
   <version>3.6.2</version>
   <configuration>
      <parameters>true</parameters>
   </configuration>
</plugin>
```

Spring Framework 5 or above: must be compiled with the debug flag enabled

```xml
<plugin>
   <artifactId>maven-compiler-plugin</artifactId>
   <version>3.6.1</version>
   <configuration>
      <debug>true</debug>
   </configuration>
</plugin>
```

```shell
java -g
```

Refer To:

[Core Technologies](https://docs.spring.io/spring-framework/docs/5.2.25.RELEASE/spring-framework-reference/core.html#beans-constructor-injection)

[Dependency Injection :: Spring Framework](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)

[Warning printed after migrating to Spring Boot 3.0 & Spring Integration 6.0 - Stack Overflow](https://stackoverflow.com/questions/74600681/warning-printed-after-migrating-to-spring-boot-3-0-spring-integration-6-0)

#### [Spring Framework] How to import Spring Boot in dependency management

Use Spring Managed Versions But Not Import Any Dependencies

```xml
<dependencyManagement>
   <dependencies>
      <!-- Import the Spring Boot BOM for consistent version management -->
      <dependency>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-dependencies</artifactId>
         <version>2.7.0</version> <!-- Replace with your desired Spring Boot version -->
         <scope>import</scope>
         <type>pom</type>
      </dependency>
   </dependencies>
</dependencyManagement>
        ...
<build>
<plugins>
   <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <version>3.3.4</version>
      <executions>
         <execution>
            <goals>
               <goal>repackage</goal>
            </goals>
         </execution>
      </executions>
      <configuration>
         <mainClass>...</mainClass>
      </configuration>
   </plugin>
   <plugin>
      <artifactId>maven-compiler-plugin</artifactId>
      <version>3.13.0</version>
      <configuration>
         <debug>true</debug>
      </configuration>
   </plugin>
   <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-jar-plugin</artifactId>
      <version>3.4.2</version>
      <configuration>
         <archive>
            <manifest>
               <mainClass>...</mainClass>
            </manifest>
         </archive>
      </configuration>
   </plugin>
</plugins>
</build>
```



Import Spring Managed Dependencies and Use Its Versions and Configurations

```xml
<parent>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-parent</artifactId>
   <version>3.3.4</version>
   <relativePath/> <!-- lookup parent from repository -->
</parent>
```

#### [Spring Boot] o.a.tomcat.util.scan.StandardJarScanner  : Failed to scan

```shell
2024-08-02T09:22:30.032+08:00  WARN 53137 --- [           main] o.a.tomcat.util.scan.StandardJarScanner  : Failed to scan [file:<missing jar absolute path>] from classloader hierarchy

java.nio.file.NoSuchFileException: <missing jar absolute path>
...
2024-08-02T09:35:41.382+08:00  INFO 53494 --- [           main] org.apache.jasper.servlet.TldScanner     : At least one JAR was scanned for TLDs yet contained no TLDs. Enable debug logging for this logger for a complete list of JARs that were scanned but no TLDs were found in them. Skipping unneeded JARs during scanning can improve startup time and JSP compilation time.
```

Configurations in Spring Boot:

```properties
# application.properties
server.tomcat.additional-tld-skip-patterns=*.jar
```

Refer To:

[Disable scanManifest of Jar Scan in tomcat embed in spring boot - Stack Overflow](https://stackoverflow.com/questions/43370840/disable-scanmanifest-of-jar-scan-in-tomcat-embed-in-spring-boot)

#### [Spring Boot] Get Mapping Information at Runtime

In Spring Boot, you can use the `RequestMappingHandlerMapping` bean to get the mapping information at runtime. This bean holds all the request mappings.

Here is a method that you can add to your class to print out the mapping path for all methods in the class:

```java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import javax.annotation.PostConstruct;
import java.util.Map;

// ...

@Autowired
private RequestMappingHandlerMapping requestMappingHandlerMapping;

@PostConstruct
public void printMappingInfo() {
   Map<RequestMappingInfo, HandlerMethod> handlerMethods = this.requestMappingHandlerMapping.getHandlerMethods();

   for (Map.Entry<RequestMappingInfo, HandlerMethod> item : handlerMethods.entrySet()) {
      RequestMappingInfo mapping = item.getKey();
      HandlerMethod method = item.getValue();

      if (method.getBeanType().equals(PhoneRiskProfileResource.class)) {
         System.out.println(method.getBeanType().getName() + " - " + mapping.getPatternsCondition());
      }
   }
}
```

This method will be called after the Spring context is initialized, and it will print out the mapping path for all methods in the resource class.

Please note that this is a debugging tool and should not be used in production code.

#### [Spring Boot] Search whether there's a stater

[Is there any source to search for spring boot starter dependencies? - Stack Overflow](https://stackoverflow.com/questions/55606253/is-there-any-source-to-search-for-spring-boot-starter-dependencies)

#### [Spring Boot] `@Component`  Class Can't be Scanned

That may be the package of `@SpringBootApplication` class differ from one of `@Component` class.

If so, add `@ComponentScan` to `@Configuration` class whose package is the same as `@SpringBootApplication` class

The `@ComponentScan` annotation is typically used in the main class of the application. This is because the main class is the entry point of the application, and it's where Spring Boot starts scanning for beans, configurations, and other components.

```java
@SpringBootApplication
@ComponentScan({"this.package.name", "another.package.to.scan"})
public class Bootstrap {

   public static void main(String[] args) {
      SpringApplication.run(Bootstrap.class, args);
   }
}
```

`@ComponentScan` in `@SpringBootApplication` class vs. `basePackages` of `@SpringBootApplication`

Both `@ComponentScan` and the `basePackages` attribute of `@SpringBootApplication` can be used to specify the packages to scan for Spring components. However, they are typically used in different scenarios.

1. `@ComponentScan`: This annotation is explicitly used to configure the base packages for component scanning. It's useful when you want to customize the packages to scan and when the packages are not sub-packages of the package where the main class resides.

```java
@ComponentScan({"this.package.name", "another.package.to.scan"})
```

2. `basePackages` in `@SpringBootApplication`: This attribute is part of the `@SpringBootApplication` annotation, which is a convenience annotation that combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. If your main application class is not in the root package, you can use the `basePackages` attribute to specify the packages to scan.

```java
@SpringBootApplication(basePackages = {"this.package.name", "another.package.to.scan"})
```

Refer To:

[Getting Started | Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa)

[Spring Component Scanning | Baeldung](https://www.baeldung.com/spring-component-scanning)

`@ComponentScan` in `@SpringBootApplication` vs. `@ComponentScan` in `@Configuration`

The `@ComponentScan` annotation is used with both `@SpringBootApplication` and `@Configuration` annotations, but they serve slightly different purposes depending on where they are used.

1. `@ComponentScan` in `@SpringBootApplication`: The `@SpringBootApplication` annotation is a convenience annotation that adds all of the following:

   - `@Configuration`: Tags the class as a source of bean definitions for the application context.
   - `@EnableAutoConfiguration`: Tells Spring Boot to start adding beans based on classpath settings, other beans, and various property settings.
   - `@ComponentScan`: Tells Spring to look for other components, configurations, and services in the current package, allowing it to find controllers, services, and repositories.

   So, when you use `@ComponentScan` with `@SpringBootApplication`, it will scan the package where the application is located and its sub-packages for Spring components.

2. `@ComponentScan` in `@Configuration`: When you use `@ComponentScan` in a `@Configuration` class, it tells Spring to scan the specified package for Spring components. This is useful when your components are located in a different package than your Spring Boot application class.

You can have `@ComponentScan` in your `ApplicationConfiguration` class with a specific package "foo". This means Spring will scan the "foo" package for components. However, you also have `@ComponentScan` in your `SpringBootDemoApplication` class (through `@SpringBootApplication`), which will scan the package where `SpringBootDemoApplication` is located and its sub-packages.

Best Practice

Add `@ComponentScan` in the `@Configuration`, don't overwrite `@ComponentScan` of `@SpringBootApplication`.

Otherwise, be supposed to add pacakge name of `@SpringBootApplication` class at the end of array.

NOTE Multiple `@ComponentScan` will append

```java
@ComponentScan("packageA")
@ComponentScan("packageB")
@ComponentScan("packageC")
// equals to 
@ComponentScan({"packageA", "packageB", "packageC"})
```



#### [Spring Boot] Unable to find a single main class from the following candidates

[Spring Boot: Configuring a Main Class | Baeldung](https://www.baeldung.com/spring-boot-main-class)

[spring - SpringBoot: Unable to find a single main class from the following candidates - Stack Overflow](https://stackoverflow.com/questions/42840576/springboot-unable-to-find-a-single-main-class-from-the-following-candidates)

```xml
<properties>
   <start-class>com.may.Application</start-class>
</properties>
```

```xml
<build>
   <plugins>
      <plugin>
         <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-maven-plugin</artifactId>
         <configuration>
            <mainClass>com.may.Application</mainClass>
         </configuration>
      </plugin>
   </plugins>
</build>
```

#### [Spring Boot] Component Scan Error Message

```shell
fix: add component scan
```

```shell
Field eventProducer in AClass required a bean of type 'BClass' that could not be found.
```

```shell
java.lang.ExceptionInInitializerError: null
```

add `@ComponentScan` in `@Configuartion`

NOTE The order of package name will effect the results.

#### [Spring Boot] Dependencies Version Issues

```shell
2024-07-16 10:31:22.254 ERROR 86760 --- [           main] o.s.boot.SpringApplication               : Application run failed

java.lang.ExceptionInInitializerError: null
	at java.base/java.lang.Class.forName0(Native Method)
	at java.base/java.lang.Class.forName(Class.java:375)
...
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:325)
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:198)
	at org.springframework.context.support.AbstractApplicationContext.invokeBeanFactoryPostProcessors(AbstractApplicationContext.java:756)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:572)
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:147)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:732)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:409)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:308)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1300)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1289)
	at <@SpringBootApplication class>
...
Caused by: java.lang.NullPointerException: Cannot invoke "org.springframework.context.ApplicationContext.getBean(java.lang.Class)" because "<class implements ApplicationContextAware.field of ApplicationContext>" is null
	at ...
```

// TODO how to fix it?

```shell
4-07-16 11:08:32.525 ERROR 87286 --- [           main] o.s.boot.SpringApplication               : Application run failed

java.lang.IllegalStateException: Error processing condition on <@Configuration class.@Bean method>
	at org.springframework.boot.autoconfigure.condition.SpringBootCondition.matches(SpringBootCondition.java:60)
	at org.springframework.context.annotation.ConditionEvaluator.shouldSkip(ConditionEvaluator.java:108)
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.loadBeanDefinitionsForBeanMethod(ConfigurationClassBeanDefinitionReader.java:193)
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.loadBeanDefinitionsForConfigurationClass(ConfigurationClassBeanDefinitionReader.java:153)
	at org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader.loadBeanDefinitions(ConfigurationClassBeanDefinitionReader.java:129)
	at org.springframework.context.annotation.ConfigurationClassPostProcessor.processConfigBeanDefinitions(ConfigurationClassPostProcessor.java:343)
	at org.springframework.context.annotation.ConfigurationClassPostProcessor.postProcessBeanDefinitionRegistry(ConfigurationClassPostProcessor.java:247)
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanDefinitionRegistryPostProcessors(PostProcessorRegistrationDelegate.java:311)
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:112)
	at org.springframework.context.support.AbstractApplicationContext.invokeBeanFactoryPostProcessors(AbstractApplicationContext.java:756)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:572)
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:147)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:732)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:409)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:308)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1300)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1289)
	at <@SpringBootApplication class>
Caused by: java.lang.IllegalStateException: Failed to introspect Class [class in file located at META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports] from ClassLoader [jdk.internal.loader.ClassLoaders$AppClassLoader@7344699f]
	at org.springframework.util.ReflectionUtils.getDeclaredMethods(ReflectionUtils.java:485)
	at org.springframework.util.ReflectionUtils.doWithMethods(ReflectionUtils.java:361)
	at org.springframework.util.ReflectionUtils.getUniqueDeclaredMethods(ReflectionUtils.java:418)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.lambda$getTypeForFactoryMethod$2(AbstractAutowireCapableBeanFactory.java:765)
	at java.base/java.util.concurrent.ConcurrentHashMap.computeIfAbsent(ConcurrentHashMap.java:1740)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.getTypeForFactoryMethod(AbstractAutowireCapableBeanFactory.java:764)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.determineTargetType(AbstractAutowireCapableBeanFactory.java:703)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.predictBeanType(AbstractAutowireCapableBeanFactory.java:674)
	at org.springframework.beans.factory.support.AbstractBeanFactory.isFactoryBean(AbstractBeanFactory.java:1684)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.doGetBeanNamesForType(DefaultListableBeanFactory.java:570)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.getBeanNamesForType(DefaultListableBeanFactory.java:542)
	at org.springframework.boot.autoconfigure.condition.OnBeanCondition.collectBeanNamesForType(OnBeanCondition.java:246)
	at org.springframework.boot.autoconfigure.condition.OnBeanCondition.getBeanNamesForType(OnBeanCondition.java:239)
	at org.springframework.boot.autoconfigure.condition.OnBeanCondition.getBeanNamesForType(OnBeanCondition.java:229)
	at org.springframework.boot.autoconfigure.condition.OnBeanCondition.getMatchingBeans(OnBeanCondition.java:182)
	at org.springframework.boot.autoconfigure.condition.OnBeanCondition.getMatchOutcome(OnBeanCondition.java:157)
	at org.springframework.boot.autoconfigure.condition.SpringBootCondition.matches(SpringBootCondition.java:47)
	... 17 common frames omitted
Caused by: java.lang.NoClassDefFoundError: <incompatible class>
	at java.base/java.lang.ClassLoader.defineClass1(Native Method)
	at java.base/java.lang.ClassLoader.defineClass(ClassLoader.java:1012)
	at java.base/java.security.SecureClassLoader.defineClass(SecureClassLoader.java:150)
	at java.base/jdk.internal.loader.BuiltinClassLoader.defineClass(BuiltinClassLoader.java:862)
	at java.base/jdk.internal.loader.BuiltinClassLoader.findClassOnClassPathOrNull(BuiltinClassLoader.java:760)
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClassOrNull(BuiltinClassLoader.java:681)
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:639)
	at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:188)
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:520)
	at java.base/java.lang.Class.getDeclaredMethods0(Native Method)
	at java.base/java.lang.Class.privateGetDeclaredMethods(Class.java:3402)
	at java.base/java.lang.Class.getDeclaredMethods(Class.java:2504)
	at org.springframework.util.ReflectionUtils.getDeclaredMethods(ReflectionUtils.java:467)
	... 33 common frames omitted
Caused by: java.lang.ClassNotFoundException: <incompatible class>
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:641)
	at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:188)
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:520)
	... 46 common frames omitted
```

Modify incompatible class or somewhere import it.

```shell
***************************
APPLICATION FAILED TO START
***************************

Description:

Field <field of BClass in AClass> in <AClass> required a bean of type '<BClass>' that could not be found.

The injection point has the following annotations:
	- @javax.inject.Inject()


Action:

Consider defining a bean of type '<BClass>' in your configuration.
```

Injection failure, fix BClass



```shell
2024-07-16 16:41:16.365 ERROR 94666 --- [           main] o.s.boot.SpringApplication               : Application run failed

org.springframework.beans.factory.BeanCreationException: Error creating bean with name '<bean-id>' defined in URL [jar:file:<jar file absolute path>!/<bean-class path>.class]: Instantiation of bean failed; nested exception is org.springframework.beans.BeanInstantiationException: Failed to instantiate [<bean full qualified class name>]: Constructor threw exception; nested exception is java.lang.RuntimeException: Bean interface <class implements ApplicationContextAware> not available in ApplicationContext
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:1334)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1232)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:582)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:542)
	at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:335)
	at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:234)
	at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:333)
	at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:208)
	at org.springframework.beans.factory.support.DefaultListableBeanFactory.preInstantiateSingletons(DefaultListableBeanFactory.java:955)
	at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:929)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:591)
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:147)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:732)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:409)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:308)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1300)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1289)
	at <@SpringBootApplication class>
Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [<bean full qualified class name>]: Constructor threw exception; nested exception is java.lang.RuntimeException: Bean interface <class implements ApplicationContextAware> not available in ApplicationContext
	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:226)
	at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:87)
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateBean(AbstractAutowireCapableBeanFactory.java:1326)
	... 17 common frames omitted
Caused by: java.lang.RuntimeException: Bean interface <class implements ApplicationContextAware> not available in ApplicationContext
	at ...
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
	at java.base/jdk.internal.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:77)
	at java.base/jdk.internal.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
	at java.base/java.lang.reflect.Constructor.newInstanceWithCaller(Constructor.java:499)
	at java.base/java.lang.reflect.Constructor.newInstance(Constructor.java:480)
	at org.springframework.beans.BeanUtils.instantiateClass(BeanUtils.java:213)
	... 19 common frames omitted
```

may be need to add @Component in the bean



```shell
***************************
APPLICATION FAILED TO START
***************************

Description:

The bean '<bena name or @Bean method name>', defined in class path resource [<@Configuration AClass within the @Bean method>], could not be registered. A bean with that name has already been defined in class path resource [<another @Configuration BClass decleared this @Bean method>] and overriding is disabled.

Action:

Consider renaming one of the beans or enabling overriding by setting spring.main.allow-bean-definition-overriding=true
```

Temprorary Solution:

```properties
# application.properties
spring.main.allow-bean-definition-overriding=true
```

Final Solution:

delete this `@Bean` in these `@Configuration` and keep only one.

If AClass is the same as BClass, there may be a applicaiton context `.xml` file, which is imported more than two times. Check recent changes of code and Search key words:

```
@ImportResource("classpath:/pathto/....xml")
<import resource="classpath:/pathto/....xml"/>
```

NOTE Only search the bean name may not help.



```shell
***************************
APPLICATION FAILED TO START
***************************

Description:

The bean '<bena name or @Bean method name>', defined in BeanDefinition defined in file [class absolute path], could not be registered. A bean with that name has already been defined in file [the same class absolute path] and overriding is disabled.

Action:

Consider renaming one of the beans or enabling overriding by setting spring.main.allow-bean-definition-overriding=true
```

Check configuratinos in `.xml` file. Must be duplicate configurations or load a `@Configuration` class which has the same configurations.

Refer to: [spring boot - A bean with that name has already been defined in class path resource [path] and overriding is disabled - Stack Overflow](https://stackoverflow.com/questions/63658346/a-bean-with-that-name-has-already-been-defined-in-class-path-resource-path-and)



```shell
java.lang.IllegalStateException: Unable to load cache item
	at org.springframework.cglib.core.internal.LoadingCache.createEntry(LoadingCache.java:79)
	at org.springframework.cglib.core.internal.LoadingCache.get(LoadingCache.java:34)
	at org.springframework.cglib.core.AbstractClassGenerator$ClassLoaderData.get(AbstractClassGenerator.java:134)
	at org.springframework.cglib.core.AbstractClassGenerator.create(AbstractClassGenerator.java:319)
	at org.springframework.cglib.proxy.Enhancer.createHelper(Enhancer.java:572)
	at org.springframework.cglib.proxy.Enhancer.createClass(Enhancer.java:419)
	at org.springframework.context.annotation.ConfigurationClassEnhancer.createClass(ConfigurationClassEnhancer.java:137)
	at org.springframework.context.annotation.ConfigurationClassEnhancer.enhance(ConfigurationClassEnhancer.java:109)
	at org.springframework.context.annotation.ConfigurationClassPostProcessor.enhanceConfigurationClasses(ConfigurationClassPostProcessor.java:447)
	at org.springframework.context.annotation.ConfigurationClassPostProcessor.postProcessBeanFactory(ConfigurationClassPostProcessor.java:268)
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:325)
	at org.springframework.context.support.PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(PostProcessorRegistrationDelegate.java:147)
	at org.springframework.context.support.AbstractApplicationContext.invokeBeanFactoryPostProcessors(AbstractApplicationContext.java:756)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:572)
	at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:147)
	at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:732)
	at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:409)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:308)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1300)
	at org.springframework.boot.SpringApplication.run(SpringApplication.java:1289)
	at <@SpringBootApplication class>
Caused by: java.lang.ExceptionInInitializerError: null
	at ...<key class>
	at java.base/java.lang.Class.forName0(Native Method)
	at java.base/java.lang.Class.forName(Class.java:467)
	at org.springframework.cglib.core.ReflectUtils.defineClass(ReflectUtils.java:604)
	at org.springframework.cglib.core.AbstractClassGenerator.generate(AbstractClassGenerator.java:363)
	at org.springframework.cglib.proxy.Enhancer.generate(Enhancer.java:585)
	at org.springframework.cglib.core.AbstractClassGenerator$ClassLoaderData$3.apply(AbstractClassGenerator.java:110)
	at org.springframework.cglib.core.AbstractClassGenerator$ClassLoaderData$3.apply(AbstractClassGenerator.java:108)
	at org.springframework.cglib.core.internal.LoadingCache$2.call(LoadingCache.java:54)
	at java.base/java.util.concurrent.FutureTask.run(FutureTask.java:264)
	at org.springframework.cglib.core.internal.LoadingCache.createEntry(LoadingCache.java:61)
	... 20 common frames omitted
Caused by: java.lang.RuntimeException: ...<caused message>
  at ...<classes>
	... 35 common frames omitted
```

key class initializes wrong



```shell
***************************
APPLICATION FAILED TO START
***************************

Description:

Parameter 0 of constructor in <AClass> required a bean of type '<BClass>' that could not be found.


Action:

Consider defining a bean of type '<BClass>' in your configuration.
```

add  `@Component` in BClass



// TODO Draft of Bean Initialization

```
Spring Boot Application run
Spring Application run
org.springframework.boot.SpringApplication#run(java.lang.String...) prepareContext
Spring Application refresh
BeanFactoryPostProcessors
BeanDefinitionRegistryPostProcessors
ConfigurationClassBeanDefinitionReader.loadBeanDefinitions
ConfigurationClassBeanDefinitionReader.loadBeanDefinitionsFromImportedResources
XmlBeanDefinitionReader.loadBeanDefinitions
XmlBeanDefinitionReader.registerBeanDefinitions
```



```
BeanDefinitionReaderUtils
definitionHolder: Bean Class
registry: 
org.springframework.context.annotation.AnnotationConfigApplicationContext - @SpringBootApplication
org.springframework.beans.factory.support.DefaultListableBeanFactory - @Componnent, @Configuration, ...

org.springframework.context.annotation.ConfigurationClassPostProcessor#postProcessBeanDefinitionRegistry
org.springframework.context.annotation.ConfigurationClassParser#doProcessConfigurationClass - sourceClass
org.springframework.context.annotation.ComponentScanAnnotationParser#parse - declaringClass

org.springframework.context.annotation.ConfigurationClassUtils#checkConfigurationClassCandidate


beanDefinitionMap
beanDefinitionNames

org.springframework.context.annotation.ConfigurationClass#getImportedResources

org.springframework.context.annotation.ConfigurationClassBeanDefinitionReader#loadBeanDefinitionsFromImportedResources
```



```
org.springframework.boot.SpringApplication#run(java.lang.Class<?>, java.lang.String...)
org.springframework.context.support.AbstractApplicationContext#refresh
org.springframework.context.support.AbstractApplicationContext#obtainFreshBeanFactory
org.springframework.context.support.AbstractApplicationContext#invokeBeanFactoryPostProcessors
org.springframework.beans.factory.support.AbstractBeanFactory#getMergedBeanDefinition(java.lang.String, org.springframework.beans.factory.config.BeanDefinition, org.springframework.beans.factory.config.BeanDefinition)

org.springframework.beans.factory.xml.DefaultBeanDefinitionDocumentReader#importBeanDefinitionResource
org.springframework.beans.factory.xml.XmlBeanDefinitionReader#registerBeanDefinitions
```

#### [Spring Boot] Change Tomcat Server Ports

```shell
# application.properties
server.port=8090
```

#### [Spring Boot] Auto-configuration

Refer To:

[A Custom Auto-Configuration with Spring Boot | Baeldung](https://www.baeldung.com/spring-boot-custom-auto-configuration)

[Auto-configuration :: Spring Boot](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)

[Creating Your Own Auto-configuration :: Spring Boot](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html)

[16. Auto-configuration](https://docs.spring.io/spring-boot/docs/2.0.x/reference/html/using-boot-auto-configuration.html)

#### [Spring Boot] Multiple Batch Jobs in Spring Batch 5 and Spring Boot 3

Assign a job name to run

application.properties

```shell
spring.batch.job.name=<jobName>
```

Or add it to program arguments (CLI arguments)

```shell
--spring.batch.job.name=<to specify one job name>
```

Or Disable

application.properties

```properties
spring.batch.job.enabled=false
```

Or add to JVM arguments

```shell
mvn clean test -Dspring.batch.job.enabled=false
```

```shell
java -jar ./target/*.jar --spring.batch.job.enabled=false
```

Refer To:

[Using spring.batch.job.names with Spring Boot 3 and Spring Batch 5 - Stack Overflow](https://stackoverflow.com/questions/76253416/using-spring-batch-job-names-with-spring-boot-3-and-spring-batch-5)

[Spring Boot 3.0 Migration Guide · spring-projects/spring-boot Wiki · GitHub](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.0-Migration-Guide#multiple-batch-jobs)

> Running multiple batch jobs is no longer supported. If the auto-configuration detects a single job is, it will be executed on startup. If multiple jobs are found in the context, a job name to execute on startup must be supplied by the user using the `spring.batch.job.name` property.

[Batch Applications :: Spring Boot](https://docs.spring.io/spring-boot/how-to/batch.html#howto.batch.running-jobs-on-startup)

> To disable running a `Job` found in the application context, set the `spring.batch.job.enabled` to `false`.

#### [Spring Boot] Hot Reloaded in Dev

```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-devtools</artifactId>
   <optional>true</optional>
   <version>2.7.18</version>
</dependency>
```

```properties
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

Refer To:

[Developer Tools :: Spring Boot](https://docs.spring.io/spring-boot/reference/using/devtools.html)

#### [Spring Boot Test]

In Spring Boot, if you want to mock a dependency in your tests, you can use `@MockBean` annotation instead of `@InjectMock`. The `@MockBean` annotation is provided by Spring Boot Test. It adds a Mockito mock of the bean into the application context. This mock will replace any existing bean of the same type in the application context.

Here is an example of how to use `@MockBean`:

```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class SomeServiceTest {

   @MockBean
   private SomeDependency someDependency;

   @Autowired
   private SomeService someService;

   @Test
   public void testSomeServiceMethod() {
      when(someDependency.someMethod()).thenReturn("mocked value");

      String result = someService.someServiceMethod();

      // assert the result
      assertEquals("expected value", result);
   }
}
```

In this example, `SomeService` is the class under test and `SomeDependency` is a dependency of `SomeService`. The `@MockBean` annotation is used to create a Mockito mock for `SomeDependency`. The `@Autowired` annotation is used to inject the `SomeService` bean from the application context. The `someServiceMethod` is then tested, with the behavior of `SomeDependency` being controlled by the Mockito mock.

#### [Spring Batch] Spring Batch 5.0 Migration Guide

[Spring Batch 5.0 Migration Guide · spring-projects/spring-batch Wiki](https://github.com/spring-projects/spring-batch/wiki/Spring-Batch-5.0-Migration-Guide)

#### [Spring Batch] Debug

[Documentation | Spring Cloud Data Flow](https://dataflow.spring.io/docs/batch-developer-guides/troubleshooting/debugging-task-apps/)

#### [Spring Batch] Spring Batch Issues

Doc: [Spring Batch](https://spring.io/projects/spring-batch)

Dependency updates

Spring Batch 4.3.x -- Spring Framework 5.x -- Spring Boot 2.x

Refer to: [What’s New in Spring Batch 4.3](https://docs.spring.io/spring-batch/docs/4.3.10/reference/html/whatsnew.html#whatsNew)

Spring Batch 5.x.x  Spring Framework 6.x -- Spring Boot 3.x

Refer to: [What’s New in Spring Batch 5.0](https://docs.spring.io/spring-batch/docs/5.0.6/reference/html/whatsnew.html#whatsNew)

[What’s New in Spring Batch 5.1 :: Spring Batch](https://docs.spring.io/spring-batch/reference/whatsnew.html)

```shell
Caused by: java.sql.BatchUpdateException: data exception: string data, right truncation ; size limit: 2500 table: BATCH_JOB_EXECUTION_PARAMS column: PARAMETER_VALUE
```

```shell
org.springframework.dao.DataIntegrityViolationException: PreparedStatementCallback; SQL [INSERT into BATCH_JOB_EXECUTION_PARAMS(JOB_EXECUTION_ID, KEY_NAME, TYPE_CD, STRING_VAL, DATE_VAL, LONG_VAL, DOUBLE_VAL, IDENTIFYING) values (?, ?, ?, ?, ?, ?, ?, ?)]; data exception: string data, right truncation;  table: BATCH_JOB_EXECUTION_PARAMS column: STRING_VAL; nested exception is java.sql.SQLDataException: data exception: string data, right truncation;  table: BATCH_JOB_EXECUTION_PARAMS column: STRING_VAL
... 
Caused by: java.sql.SQLDataException: data exception: string data, right truncation;  table: BATCH_JOB_EXECUTION_PARAMS column: STRING_VAL
..
```

```shell
Caused by: java.sql.SQLSyntaxErrorException: user lacks privilege or object not found: BATCH_JOB_EXECUTION in statement [INSERT into BATCH_JOB_EXECUTION(JOB_EXECUTION_ID, JOB_INSTANCE_ID, START_TIME, END_TIME, STATUS, EXIT_CODE, EXIT_MESSAGE, VERSION, CREATE_TIME, LAST_UPDATED, JOB_CONFIGURATION_LOCATION) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)]
	at org.hsqldb.jdbc.JDBCUtil.sqlException(Unknown Source)
	at org.hsqldb.jdbc.JDBCUtil.sqlException(Unknown Source)
	at org.hsqldb.jdbc.JDBCPreparedStatement.<init>(Unknown Source)
	at org.hsqldb.jdbc.JDBCConnection.prepareStatement(Unknown Source)
	at com.zaxxer.hikari.pool.ProxyConnection.prepareStatement(ProxyConnection.java:337)
	at com.zaxxer.hikari.pool.HikariProxyConnection.prepareStatement(HikariProxyConnection.java)
	at org.springframework.jdbc.core.JdbcTemplate$SimplePreparedStatementCreator.createPreparedStatement(JdbcTemplate.java:1681)
	at org.springframework.jdbc.core.JdbcTemplate.execute(JdbcTemplate.java:648)
	... 52 common frames omitted
```

```shell
... 
Caused by: com.google.gson.JsonSyntaxException: Failed parsing '1483257661000' as Date; at path $.<key1.key2...>
... 
Caused by: java.text.ParseException: Failed to parse date ["1483257661000"]: Invalid time zone indicator '6'
	at com.google.gson.internal.bind.util.ISO8601Utils.parse(ISO8601Utils.java:279)
	at com.google.gson.internal.bind.DateTypeAdapter.deserializeToDate(DateTypeAdapter.java:88)
	... 40 common frames omitted
...
```

```shell
org.springframework.jdbc.BadSqlGrammarException: PreparedStatementCallback; bad SQL grammar [SELECT JOB_INSTANCE_ID, JOB_NAME from BATCH_JOB_INSTANCE where JOB_NAME = ? and JOB_KEY = ?]; nested exception is java.sql.SQLSyntaxErrorException: user lacks privilege or object not found: BATCH_JOB_INSTANCE in statement [SELECT JOB_INSTANCE_ID, JOB_NAME fro BATCH_JOB_INSTANCE where JOB_NAME = ? and JOB_KEY = ?]
```

Problems like this have similar solutions.

1. Find the schema sql file, like schema-hsqldb.sql, schema-mysql.sql and so on. Find the key word, like hsqldb in the exception stack traces.
2. (Optional) Check the different between spring-batch-cores versions.
3. Copy the whole scripts file to the project sql file, modify if necessary, and add configurations to overwrite default.

```properties
# application.properties
spring.batch.jdbc.schema=classpath:fix-schema-hsqldb.sql
```

```sql
# fix-schema-hsqldb.sql in src/main/resources
CREATE TABLE BATCH_JOB_INSTANCE  (
                                    JOB_INSTANCE_ID BIGINT IDENTITY NOT NULL PRIMARY KEY ,
                                    VERSION BIGINT ,
                                    JOB_NAME VARCHAR(100) NOT NULL,
                                    JOB_KEY VARCHAR(32) NOT NULL,
                                    constraint JOB_INST_UN unique (JOB_NAME, JOB_KEY)
) ;

... 

ALTER TABLE BATCH_JOB_EXECUTION_PARAMS MODIFY STRING_VAL VARCHAR2(2500 char);

```

#### [Spring Batch] XML Configuration to Annotation Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:batch="http://www.springframework.org/schema/batch"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/batch
        https://www.springframework.org/schema/batch/spring-batch.xsd">

   <!-- bean definitions here -->

   <bean id="StepBean" class="foo.StepBean" scope="step"/>
   <batch:step .../>
</beans>
```

Or

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:batch="http://www.springframework.org/schema/batch"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/batch
        https://www.springframework.org/schema/batch/spring-batch.xsd">

   <!-- bean definitions here -->

   <bean id="StepBean" class="foo.StepBean" scope="step"/>
   <bean class="org.springframework.batch.core.scope.StepScope" />
</beans>
```

Or

```java
@Component
@StepScope
public class StepBean {
  ...
}
```

Or

```java
@Configuration
@EnableBatchProcessing
public class AnnotationBatchConfiguration {
  ...
}
@Component
@StepScope
public class StepBean {
  ...
}
```

Or (5.0 or later)

```java
@Configuration
public class AnnotationBatchConfiguration extends DefaultBatchConfiguration {
  ...
}
@Component
@StepScope
public class StepBean {
  ...
}
```



Similiar to `@JobScope`

Refer To:

[Configuring a Step](https://docs.spring.io/spring-batch/docs/4.3.10/reference/html/step.html#step-scope)

> Using a scope of `Step` is required in order to use late binding, because the bean cannot actually be instantiated until the `Step` starts, to allow the attributes to be found. Because it is not part of the Spring container by default, the scope must be added explicitly, by using the `batch` namespace or by including a bean definition explicitly for the `StepScope`, or by using the `@EnableBatchProcessing` annotation. Use only one of those methods.

#### [Spring Batch] Configre timeout of Hikari

```shell
2024-08-01T09:44:33.083+08:00 ERROR 36391 --- [cTaskExecutor-1] o.s.batch.core.step.AbstractStep         : Encountered an error saving batch meta data for step <stepId> in job <jobId>. This job is now in an unknown state and should not be restarted.

org.springframework.transaction.CannotCreateTransactionException: Could not open JDBC Connection for transaction
...
Caused by: java.sql.SQLException: HikariDataSource HikariDataSource (HikariPool-1) has been closed.
```

```properties
spring.datasource.hikari.connectionTimeout=30000 
spring.datasource.hikari.idleTimeout=600000 
spring.datasource.hikari.maxLifetime=1800000 
```

Refer to: [Configuring a Hikari Connection Pool with Spring Boot | Baeldung](https://www.baeldung.com/spring-boot-hikari)

#### [Spring Security] Spring Security without the WebSecurityConfigurerAdapter

remove all `WebSecurityConfigurerAdapter` in the project and its libraries.

Refer To:

[Spring Security without the WebSecurityConfigurerAdapter](https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter)

[Caused by: java.lang.IllegalStateException: Found WebSecurityConfigurerAdapter as well as SecurityFilterChain. Please select just one](https://stackoverflow.com/questions/73462693/caused-by-java-lang-illegalstateexception-found-websecurityconfigureradapter-a)

#### [SpringDoc] SpringFox vs. SpringDoc

[Migrating from SpringFox](https://springdoc.org/migrating-from-springfox.html)

#### [Swagger] Swagger Codegen

#### [CheckStyle]

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:3.3.0:check (default) on project scartaddonsvc: Failed during checkstyle configuration: SuppressionCommentFilter is not allowed as a child in Checker -> [Help 1]
```

put `SuppressionCommentFilter` in `TreeWalker`

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:3.3.0:check (default) on project scartaddonsvc: Failed during checkstyle configuration: cannot initialize module TreeWalker - cannot initialize module FileContentsHolder - Unable to instantiate 'FileContentsHolder' class, it is also not possible to instantiate it as .FileContentsHolder, FileContentsHolderCheck, .FileContentsHolderCheck. Please recheck that class name is specified as canonical name or read how to configure short name usage https://checkstyle.org/config.html#Packages. Please also recheck that provided ClassLoader to Checker is configured correctly. -> [Help 1]
```

remove them

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:3.3.0:check (default) on project epncbload: Failed during checkstyle configuration: cannot initialize module TreeWalker - TreeWalker is not allowed as a parent of LineLength Please review 'Parent Module' section for this Check in web documentation if Check is standard. -> [Help 1]
```

move `LineLength` under `Checker`

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:3.3.0:check (default) on project epncbload: Failed during checkstyle configuration: cannot initialize module TreeWalker - cannot initialize module JavadocMethod - Property 'scope' does not exist, please check the documentation -> [Help 1]
```

[checkstyle – Release Notes](https://checkstyle.sourceforge.io/releasenotes.html)

[Not allowed as a parent of LineLength · Issue #458 · jshiell/checkstyle-idea](https://github.com/jshiell/checkstyle-idea/issues/458)

#### [GitHub] API

Query GitHub Repository Information

```shell
curl --request GET \
  --url https://{github_host}/api/v3/repos/{org}/{repo} \
  --header 'Accept: Accept: application/vnd.github+json' \
  --header 'Authorization: Bearer {token}' \
  --header 'X-GitHub-Api-Version: 2022-11-28' \
```

Open Multiple Page at once

```javascript
run = artifactIds => {
   for (let i = 0; i < artifactIds.length; i++) {
      window.open("https://github.com/search?l=Maven+POM&q=%3CartifactId%3E"+artifactIds[i]+"%3C%2FartifactId%3E&type=code")
   }
}
run(["artifact1","artifact2","artifact3"])
```

```javascript
let urls = []
urls.push()
let i = 0
let interval = setInterval(() => {
   if (i < urls.length) {
      window.open(urls[i])
      i++;
   } else {
      i = 0
      clearInterval(interval)
   }
}, 500);
```

Note: Chrome may block multiple windows.



The GitHub Search API allows you to search for repositories, issues, pull requests, users, and more within GitHub. It provides powerful querying capabilities to help you find data across the entire GitHub platform.

##### Base URL:

```
https://api.github.com/search/
```

##### Search Endpoints

Here are the common search endpoints:

1. **Search Repositories**
   Search repositories based on a query.

   ```
   GET /search/repositories?q={query}
   ```

   Example query:

   ```
   GET https://api.github.com/search/repositories?q=python+stars:>1000
   ```

   This would search for repositories related to Python with more than 1,000 stars.

2. **Search Issues**
   Search for issues (bugs, feature requests, etc.) based on a query.

   ```
   GET /search/issues?q={query}
   ```

   Example query:

   ```
   GET https://api.github.com/search/issues?q=is:open+is:issue+label:bug
   ```

3. **Search Users**
   Search for GitHub users based on a query.

   ```
   GET /search/users?q={query}
   ```

   Example query:

   ```
   GET https://api.github.com/search/users?q=location:Berlin
   ```

4. **Search Code**
   Search for code within repositories based on a query.

   ```
   GET /search/code?q={query}
   ```

   Example query:

   ```
   GET https://api.github.com/search/code?q=def+hello+in:file+language:python
   ```

5. **Search Pull Requests**
   Search for pull requests based on a query.

   ```
   GET /search/issues?q={query}+type:pr
   ```

   Example query:

   ```
   GET https://api.github.com/search/issues?q=is:pr+is:open+author:octocat
   ```

##### Query Parameters

- **q**: The search query (required).
- **sort**: The sorting criterion for the results. Valid options are `stars`, `forks`, `updated`, etc. Default is `best match`.
- **order**: The sort order. Can be `desc` (default) or `asc`.
- **per_page**: The number of results per page (max 100). Default is 30.
- **page**: The page number to return (starting at 1).

##### Example: Search Repositories with Filters

If you wanted to search for repositories with the term "machine learning", that have more than 500 stars, and are written in Python, you could use the following API call:

```bash
GET https://api.github.com/search/repositories?q=machine+learning+stars:>500+language:python
```

##### Authentication

For most public queries, no authentication is required. However, for higher rate limits and access to private data (like searching private repositories), you need to authenticate using a personal access token (PAT).

##### Rate Limits

The GitHub Search API has different rate limits:

- **Unauthenticated requests**: 10 requests per second.
- **Authenticated requests**: 30 requests per second.

For detailed rate limit information, you can check the response headers, where `X-RateLimit-Limit` and `X-RateLimit-Remaining` will show how many requests you can make.

##### Example Response (Repositories Search)

Here’s a sample JSON response from a search query for repositories:

```json
{
   "total_count": 1534,
   "incomplete_results": false,
   "items": [
      {
         "id": 123456,
         "node_id": "MDEwOlJlcG9zaXRvcnkxMjM0NTY=",
         "name": "awesome-machine-learning",
         "full_name": "username/awesome-machine-learning",
         "private": false,
         "owner": {
            "login": "username",
            "id": 12345,
            "avatar_url": "https://avatars.githubusercontent.com/u/12345?v=4",
            "url": "https://api.github.com/users/username"
         },
         "html_url": "https://github.com/username/awesome-machine-learning",
         "description": "A curated list of machine learning projects",
         "stargazers_count": 1500,
         "language": "Python",
         "forks_count": 500,
         "open_issues_count": 10,
         "created_at": "2020-03-01T12:34:56Z",
         "updated_at": "2024-05-12T16:20:22Z"
      }
   ]
}
```

In this example, the response contains a list of repositories (`items`), with details like the name, description, number of stars, language, and more.

##### Full Documentation

For more details, you can always refer to the [GitHub Search API documentation](https://docs.github.com/en/rest/search).

#### [GitHub] Authorizing OAuth apps

Homepage URL: the website homepage. unknwon purpose, it's fine if wrong.

Authorization callback URL: http://<frontend_host>/<callback>

Good practics must include `example.com/path` in the URL.
Query params are welcome.

```shell
CALLBACK: http://example.com/path

GOOD: http://example.com/path
GOOD: http://example.com/path/subdir/other
GOOD: http://oauth.example.com/path
GOOD: http://oauth.example.com/path/subdir/other
BAD:  http://example.com/bar
BAD:  http://example.com/
BAD:  http://example.com:8080/path
BAD:  http://oauth.example.com:8080/path
BAD:  http://example.org
```

```shell
Frontend->>GitHub: [1] Navigate to GitHub authorize Page (with client_id)
GitHub->>Frontend: [2] Re-navigate to callback URL, with code
Frontend->>Backend: [3] Send the code to the backend
Backend->>GitHub: [4] Exchange the access_token with code and client_secret
GitHub->>Backend: [5] Return access_token
Backend->>GitHub: [6] Query user information with access_token
Backend->>Frontend: [7] return JWT or login results
```

[Authorizing OAuth apps - GitHub Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps) 

```shell
Be careful!

The redirect_uri is not associated with this application.

The application might be misconfigured or could be trying to redirect you to a website you weren't expecting.
```
if returns above page while nagativing to `login/oauth/authorize`, check `redirect_uri` and `Authorization callback URL`.

It's totally bad practics to not assign `redirect_uri`.


#### [GitHub] Find a GitHub repository for a Java library based on its `groupId` and `artifactId`

To find a GitHub repository for a Java library based on its `groupId` and `artifactId`, follow these steps:

##### 1. **Search on Maven Central**
- The first place to check is [Maven Central](https://search.maven.org/), which is a repository for Java libraries.
- You can search using the `groupId` and `artifactId` of the library to find the latest versions and other details.

**Steps:**
1. Go to [Maven Central search page](https://search.maven.org/).
2. In the search bar, type the `groupId` and `artifactId` (e.g., `org.apache.commons commons-lang3`).
3. Find the relevant version of the library.
4. In the details of the artifact, look for links like "Homepage" or "URL", which might point to the project's official site or GitHub repository.

##### 2. **Check the Library's `pom.xml` (if available)**
If you have the `pom.xml` for the library (for example, if it’s in your own project or you’re exploring a library locally), you can check the `scm` section or the `url` tag in the `pom.xml`, which may contain a link to the project's repository.

Example:
   ```xml
   <scm>
   <url>https://github.com/username/repository</url>
   <connection>scm:git:git://github.com/username/repository.git</connection>
</scm>
   ```

##### 3. **Google Search**
Sometimes the most straightforward approach is simply searching for the library's name along with keywords like "GitHub" or "repository". For example, search for:

   ```
   groupId artifactId GitHub repository
   ```

This often leads you directly to the GitHub repository, especially if it is a popular library.

##### 4. **Search on GitHub Directly**
If you know the name of the library (from `artifactId`), you can search for it directly on GitHub:

**Steps:**
1. Go to [GitHub](https://github.com/).
2. In the search bar, type the name of the library or `groupId:artifactId` (e.g., `org.apache.commons:commons-lang3`).
3. Browse through the repositories listed in the search results.

##### 5. **Check Popular Libraries**
Many well-known libraries are hosted on GitHub under specific organizations. For example:
- Libraries from **Apache** are often found under `https://github.com/apache/`.
- Libraries from **Google** are often found under `https://github.com/google/`.
- Libraries from **Spring** are typically under `https://github.com/spring-projects/`.

You can try visiting the corresponding GitHub organization or user page and search for the specific library by its name.

---

In summary:
- **Maven Central** is a reliable place to start.
- **GitHub** can be searched directly for the repository name.
- **pom.xml** may directly point to the GitHub repo via SCM tags.
- Google search often helps you find the GitHub link quickly.

Would you like me to walk you through a specific example?

#### [GitHub] Add single comment vs. Start a review

> **If you click on add single comment, the comment will be made immediately.** **If you click on start a review, you'll have the chance to write more comments before sending them at once**. To end the review, you need to click on the review changes button and select submit review.

[How to review and edit a pull request | by Zell Liew - Medium](https://medium.com/@zellwk/how-to-review-and-edit-a-pull-request-bd3a938d1d77)

#### [GitHub] Comparing commits

[Comparing commits - GitHub Docs](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/viewing-and-comparing-commits/comparing-commits)

> For example, this URL uses the shortened SHA codes to compare commits `f75c570` and `3391dcc`: `https://github.com/github-linguist/linguist/compare/f75c570..3391dcc`.

#### [JUnit] Mock a Static Void Method with Mockito

With a static block, there's no way to achieve it.

With a static method called after class initailization, read the reference for details.

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.mockStatic;

@ExtendWith(MockitoExtension.class)
public class MyTest {
   @BeforeEach
   public void setup() {
   }

   @Test
   public void testStaticVoidMth() {
      try (MockedStatic<StaticVoidClass> mock = mockStatic(StaticVoidClass.class)) {

      }
      StaticVoidClass.staticVoidMth();
      System.out.println(StaticVoidClass.getName());
   }
}

class StaticVoidClass {
   private static String name = "non";

   static {
      staticVoidMth();
   }

   public static void staticVoidMth() {
      name = "called";
      System.out.println("Static void method");
   }

   public static String getName() {
      return name;
   }

   public static void setName(String name) {
      StaticVoidClass.name = name;
   }
}
```

```xml
<dependency>
   <groupId>org.junit.jupiter</groupId>
   <artifactId>junit-jupiter-engine</artifactId>
   <version>5.8.2</version>
   <scope>test</scope>
</dependency>
<dependency>
<groupId>org.mockito</groupId>
<artifactId>mockito-core</artifactId>
<version>5.11.0</version>
<scope>test</scope>
</dependency>
<dependency>
<groupId>org.mockito</groupId>
<artifactId>mockito-junit-jupiter</artifactId>
<version>5.11.0</version>
<scope>test</scope>
</dependency>
```

Refer To:

https://www.baeldung.com/mockito-mock-static-methods

https://stackoverflow.com/questions/64717683/mockito-donothing-with-mockito-mockstatic

#### [TestNG] Get Started

[TestNG Documentation](https://testng.org/)

[Introduction to TestNG | Baeldung](https://www.baeldung.com/testng)

[TestNG Tutorial - GeeksforGeeks](https://www.geeksforgeeks.org/testng-tutorial/)

[TestNG Tutorial](https://www.tutorialspoint.com/testng/index.htm)

[Setting Up TestNG in Eclipse](https://howtodoinjava.com/testng/testng-tutorial-with-eclipse/)

#### [Jersey] Jersey Migration Guide

Jersey Migration Guide - from 1.x to 2.x

[Chapter 31. Migration Guide](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/migration.html#mig-client-api)

#### [Jersey] `@FormParam`

```xml
<dependency>
   <groupId>com.sun.jersey</groupId>
   <artifactId>jersey-server</artifactId>
   <version>1.8</version>
</dependency>
```

```java
com.sun.jersey.server.impl.uri.rules.HttpMethodRule#accept
com.sun.jersey.server.impl.model.method.dispatch.FormDispatchProvider#processForm
com.sun.jersey.spi.container.ContainerRequest#getEntity(java.lang.Class<T>, java.lang.reflect.Type, java.lang.annotation.Annotation[])
@Produces({"application/x-www-form-urlencoded", "*/*"})
@Consumes({"application/x-www-form-urlencoded", "*/*"})
public final class FormProvider extends BaseFormProvider<Form> {
   com.sun.jersey.core.impl.provider.entity.FormProvider#readFrom
}
com.sun.jersey.core.impl.provider.entity.BaseFormProvider#readFrom
```

In this implement, the jersey server will use the corresponding Provider to parse the parameters according to the parameter annotations.

```xml
<dependency>
   <groupId>org.glassfish.jersey.core</groupId>
   <artifactId>jersey-server</artifactId>
   <version>2.35</version>
</dependency>
```

```java
org.glassfish.jersey.server.model.ResourceMethodInvoker#apply
org.glassfish.jersey.server.internal.inject.FormParamValueParamProvider.FormParamValueProvider#apply
org.glassfish.jersey.server.internal.inject.FormParamValueParamProvider.FormParamValueProvider#getForm
org.glassfish.jersey.server.internal.inject.FormParamValueParamProvider.FormParamValueProvider#ensureValidRequest
```

> [@FormParam](https://jakartaee.github.io/rest/apidocs/2.1.6/javax/ws/rs/FormParam.html) is slightly special because it extracts information from a request representation that is of the MIME media type `"application/x-www-form-urlencoded"` and conforms to the encoding specified by HTML forms, as described here. This parameter is very useful for extracting information that is POSTed by HTML forms, for example the following extracts the form parameter named "name" from the POSTed form data:

Refer To:

[Jersey 2.45 User Guide](https://eclipse-ee4j.github.io/jersey.github.io/documentation/latest/user-guide.html)

#### [Jersey] Performance Analysis

[Jersey 3.0.0-M1 User Guide](https://repo.maven.apache.org/maven2/org/glassfish/jersey/jersey-documentation/3.0.0-M1/jersey-documentation-3.0.0-M1-user-guide.pdf)

> 23.2.4. Format of the HTTP response headers
>
> PRE-MATCH, REQ-FILTER, RESP-FILTER, RI, WI, MBR, MBW

[Performance issue caused by the WeakReference in AbstractJaxbProvider · Issue #5843 · eclipse-ee4j/jersey](https://github.com/eclipse-ee4j/jersey/issues/5843)

> ~~WeakReference~~
>
> MBR 90MS, MBW 9MS

#### [Prometheus]

[Spring Boot, Micrometer, Prometheus and Grafana - how to add custom metrics to your application | by Aleksander Kołata | Medium](https://medium.com/@aleksanderkolata/spring-boot-micrometer-prometheus-and-grafana-how-to-add-custom-metrics-to-your-application-712c6f895f6b)

[Micrometer Prometheus :: Micrometer](https://docs.micrometer.io/micrometer/reference/implementations/prometheus.html)

[Guide to Prometheus Java Client | Baeldung](https://www.baeldung.com/java-prometheus-client)

#### [Tomcat] Start and Remote Debug

Download Apache Tomcat from [Apache Tomcat® - Welcome!](https://tomcat.apache.org/)

Extract to whereever you want

```shell
vi /pathto/tomcat_home/config/server.xml
# change port to 8090 or other port you want

mv /pathto/service/target/ROOT.war /pathto/tomcat_home/webapps

export JPDA_ADDRESS=5005
/pathto/tomcat_home/bin/catalina.sh jpda start
/pathto/tomcat_home/bin/catalina.sh stop

lsof -i:5005 -i:8080
lsof -i:8080 -i:5009 | awk '{print $2}' | sort | uniq -c # not work
```

#### [Tomcat] server.xml

```xml
<Server port="${port.shutdown}" shutdown="SHUTDOWN">
```

#### [Kotlin] Kotlin: [Internal Error] java.lang.NoSuchFieldError: FILE_HASHING_STRATEGY

```shell
Kotlin: [Internal Error] java.lang.NoSuchFieldError: FILE_HASHING_STRATEGY
	at org.jetbrains.kotlin.jps.targets.KotlinJvmModuleBuildTarget.updateChunkMappings(KotlinJvmModuleBuildTarget.kt:362)
	at org.jetbrains.kotlin.jps.build.KotlinBuilder.doBuild(KotlinBuilder.kt:463)
	at org.jetbrains.kotlin.jps.build.KotlinBuilder.build(KotlinBuilder.kt:299)
	at org.jetbrains.jps.incremental.IncProjectBuilder.runModuleLevelBuilders(IncProjectBuilder.java:1609)
	at org.jetbrains.jps.incremental.IncProjectBuilder.runBuildersForChunk(IncProjectBuilder.java:1238)
	at org.jetbrains.jps.incremental.IncProjectBuilder.buildTargetsChunk(IncProjectBuilder.java:1389)
	at org.jetbrains.jps.incremental.IncProjectBuilder.buildChunkIfAffected(IncProjectBuilder.java:1203)
	at org.jetbrains.jps.incremental.IncProjectBuilder.buildChunks(IncProjectBuilder.java:971)
	at org.jetbrains.jps.incremental.IncProjectBuilder.runBuild(IncProjectBuilder.java:527)
	at org.jetbrains.jps.incremental.IncProjectBuilder.build(IncProjectBuilder.java:236)
	at org.jetbrains.jps.cmdline.BuildRunner.runBuild(BuildRunner.java:135)
	at org.jetbrains.jps.cmdline.BuildSession.runBuild(BuildSession.java:387)
	at org.jetbrains.jps.cmdline.BuildSession.run(BuildSession.java:212)
	at org.jetbrains.jps.cmdline.BuildMain$MyMessageHandler.lambda$channelRead0$0(BuildMain.java:211)
	at java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)
	at java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)
	at java.base/java.lang.Thread.run(Thread.java:829)
```

change compiler version to 1.9.6 in IDEA settings

#### [Kotlin] Lambda

Refer To:

[Higher-order functions and lambdas | Kotlin Documentation](https://kotlinlang.org/docs/lambdas.html#higher-order-functions)

[Lambda Expressions in Kotlin | Baeldung on Kotlin](https://www.baeldung.com/kotlin/lambda-expressions)

[Kotlin Lambda Expressions and Anonymous Functions | Huawei Developers](https://medium.com/huawei-developers/kotlin-lambda-expressions-kotlin-anonymous-functions-example-tutorial-88a4b622f8b9)

#### [Kotlin] Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type

```shell
[ERROR] /pathto/Class.kt:[r,c] Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type <Class>?
[ERROR] /pathto/Class.kt:[r,c] Type mismatch: inferred type is Boolean? but Boolean was expected
```

Seems from Kotlin 1.7, the compiler will check the non-null defincation, but can't found the documentation.

Refer To:

[Maven | Kotlin Documentation](https://kotlinlang.org/docs/maven.html#attributes-specific-to-jvm)

[Crash Course on the Kotlin Compiler | K1 + K2 Frontends, Backends | by Amanda Hinchman | Google Developer Experts | Medium](https://medium.com/google-developer-experts/crash-course-on-the-kotlin-compiler-k1-k2-frontends-backends-fe2238790bd8)

[Let's Talk about Kotlin K2. Kotlin is now 13 years old! Yeah, a… | by Kartik Arora | ProAndroidDev](https://proandroiddev.com/lets-talk-about-kotlin-k2-3e1c6f10d74)

[Error: Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type ReadableArray? · Issue #276 · Nozbe/WatermelonDB](https://github.com/Nozbe/WatermelonDB/issues/276)

#### [Hibernate] Hibernate 6 Migrattion Guide

[Documentation - 6.0 - Hibernate ORM](https://hibernate.org/orm/documentation/6.0/)

[java - Save UUID as String in Database with JPA/Hibernate - Stack Overflow](https://stackoverflow.com/questions/76212506/save-uuid-as-string-in-database-with-jpa-hibernate)



#### [Protobuf] Protocol Buffers

```shell
Caused by: java.lang.UnsupportedOperationException: This is supposed to be overridden by subclasses.
	at com.google.protobuf.GeneratedMessage.getUnknownFields(GeneratedMessage.java:225)
```

If it occurs in the app code, replace with JSON

If it occured in the library code, resolve the library conflict of `com.google.protobuf:protobuf-java`




Protocol Buffers (Protobuf) is a method developed by Google for serializing structured data, similar to XML or JSON. It is useful in developing programs to communicate with each other over a wire or for storing data. The method involves defining how you want your data to be structured once, using special syntax in a `.proto` file. This definition is then used to automatically generate source code in various languages, which can be used to easily write and read the structured data to and from a variety of data streams and using a variety of languages.

**Key Features:**
- **Efficient**: Protobuf is designed to be more compact and efficient than XML or JSON.
- **Cross-Language**: It supports generated code in multiple languages, allowing for easy data exchange between systems written in different languages.
- **Strongly-Typed**: The data structure is defined upfront in the `.proto` file, making the data exchange strongly-typed and less error-prone.
- **Backward Compatibility**: It supports backward and forward compatibility, allowing old data to be read by new code and new data to be downgraded for old code.

**Basic Workflow:**
1. **Define**: You define the structure of your data using Protobuf's language in a `.proto` file.
2. **Generate**: Use the Protobuf compiler (`protoc`) to generate data access classes in your preferred language from your `.proto` file.
3. **Use**: Use the generated classes in your application to serialize, deserialize, and manipulate your Protobuf data.

**Example `.proto` File:**
```protobuf
syntax = "proto3";

message Person {
   string name = 1;
   int32 id = 2;
   string email = 3;
}
```
This defines a simple message containing a name, an ID, and an email, each tagged with a unique number. These numbers are used in the binary encoding.

**Usage:**
- Serialization and deserialization of data to send over the network or to store in files.
- Data interchange format for microservices or between different components of a system.
- Efficient storage format for structured data.

Protocol Buffers (Protobuf) is a powerful serialization framework used by many applications for efficient communication. However, like any technology, it has its own set of limitations and challenges:

1. **Learning Curve**: Protobuf has its own syntax and requires learning how to define data structures in `.proto` files, which can be a barrier for new developers.

2. **Binary Format**: While the binary format is efficient for machines, it's not human-readable like JSON or XML, making debugging and manual inspection more difficult.

3. **Limited Support for Some Languages**: While Protobuf supports many programming languages, the level of support, documentation, and community resources can vary. Some languages may have less mature or less performant implementations.

4. **Versioning Constraints**: Although Protobuf is designed to be forward and backward compatible, managing schema evolution requires careful planning. Removing or changing the meaning of fields can lead to compatibility issues.

5. **Tooling and Integration**: Integrating Protobuf into existing systems may require additional tooling or build steps (e.g., generating code from `.proto` files), which can complicate build systems and continuous integration pipelines.

6. **Lack of Native Support for Some Data Types**: Protobuf does not natively support some specific data types found in certain programming languages, which may require custom wrappers or additional handling.

7. **Overhead for Small Projects**: For small projects or simple APIs, the overhead of defining schemas in `.proto` files and generating code might not be justified compared to using simpler serialization methods like JSON.

8. **Dynamic Data Handling**: Protobuf is less suited for scenarios where the structure of the data is not known until runtime. Dynamic or loosely structured data is more easily handled by formats like JSON.

Despite these challenges, Protobuf's efficiency, cross-language support, and robustness make it a popular choice for many applications, particularly in microservices architectures and systems where performance and scalability are critical.

[Frontend] Frontend Architecture
Vue.js
UI Library Perferences: Vue Based, Free, Fully Accessible, Dark Mode, Form Helpers
* Vuetify - large
* PrimeVue
* Vuestic UI - bugs while restore page in dark mode

#### [English] Tenses of Paraphrase

[He said, she said: Reported speech and backshift of tenses - Explorations in English Language Learning](https://englishexplorations.check.uni-hamburg.de/he-said-she-said-reported-speech-and-backshift-of-tenses/)

#### [English] What are CC and BCC Meaning

[The Meaning of CC and BCC in Emails | Britannica Dictionary](https://www.britannica.com/dictionary/eb/qa/The-Meaning-of-CC-and-BCC-in-Emails)

> CC: carbon copy
>
> BCC: blind carbon copy

#### [English] Grammar Check

[Free Grammar Checker - QuillBot AI](https://quillbot.com/grammar-check)

#### [English] alright vs. all right

["Alright" vs. "All Right" - Dictionary.com](https://www.dictionary.com/e/alright-vs-all-right/)

> all right is formal use.

#### [English] whether

[Whether - English Grammar Today - Cambridge Dictionary](https://dictionary.cambridge.org/us/grammar/british-grammar/whether)

[Whether or Not: Meaning and Correct Usage](https://prowritingaid.com/whether-or-not)

#### [English] Please feel welcome

[please feel welcome/welcomed | WordReference Forums](https://forum.wordreference.com/threads/please-feel-welcome-welcomed.361621/)

[BE WELCOME TO | English meaning - Cambridge Dictionary](https://dictionary.cambridge.org/dictionary/english/be-welcome-to)

#### [English] Either ... or ..., or both ...

and/or

inclusive-OR

Refer To:

#### [English] ETA (Estimated Time of Arrival)

ETA for the event

**ETA** (Estimated Time of Arrival) is used to indicate the expected time at which something or someone will arrive at a particular destination. It’s commonly used in travel, logistics, shipping, and even for things like meetings or projects.

Here are some examples of how to use **ETA**:

##### 1. **Travel or Transportation**
- **Example 1:**  
  *“Our flight’s ETA is 3:15 PM, so we should land in New York around that time.”*  
  *In this case, ETA refers to the expected time the flight will arrive at its destination.*

- **Example 2:**  
  *“The delivery truck’s ETA is 2:00 PM. It should be here shortly.”*  
  *This means the expected time the delivery truck will arrive at a particular address.*

- **Example 3:**  
  *“ETA to the office is 30 minutes, assuming no traffic delays.”*  
  *This is used when estimating the time it will take for someone to reach their office.*

##### 2. **Projects or Tasks**
- **Example 4:**  
  *“The ETA for the software update is tomorrow by noon.”*  
  *This indicates when the update is expected to be completed and available.*

- **Example 5:**  
  *“We’re still waiting for the parts, but the ETA for completion of the repair is Thursday at 5 PM.”*  
  *This is used to communicate the expected completion time of a task or job.*

##### 3. **Communication/Meetings**
- **Example 6:**  
  *“I’m on my way, ETA is about 10 minutes!”*  
  *This tells the person you’re meeting when you expect to arrive.*

- **Example 7:**  
  *“The ETA for John to join the meeting is 3:30 PM.”*  
  *This is used when you’re indicating when a participant is expected to arrive at a scheduled meeting.*

##### 4. **Shipping and Logistics**
- **Example 8:**  
  *“The package's ETA is 7 PM, so you should receive it by then.”*  
  *This is used when tracking the arrival time of a package or shipment.*

- **Example 9:**  
  *“The ETA for the cargo ship is 10 AM on Friday.”*  
  *This means that the cargo ship is expected to dock at that time.*

##### 5. **General Use**
- **Example 10:**  
  *“What’s your ETA for the project delivery?”*  
  *This asks for the estimated time when a project or task will be finished.*

As you can see, **ETA** is versatile and used in many different contexts. It's helpful when you want to communicate expected times in relation to arrivals or completions.

[conjunctions - "Either A, or B, or both" - English Language & Usage Stack Exchange](https://english.stackexchange.com/questions/128101/either-a-or-b-or-both)

#### [English] were removed vs have been removed

Situation: There is a basket with just apples inside. Only oranges should be in the basket.

Which sounds more natural to native speakers?

\1. Apples should have been removed from the basket but instead, oranges are removed. Wrong
\2. Apples should have been removed from the basket but instead, oranges were removed. Correct
\3. Apples should have been removed from the basket but instead, oranges have been removed. Correct

[were removed vs have been removed | WordReference Forums](https://forum.wordreference.com/threads/were-removed-vs-have-been-removed.4071262/)

#### [English] rather than vs. rather ... than ...

The phrases **"rather than"** and **"rather ... than ..."** are both used to compare two choices or alternatives, but there's a slight difference in how they're used in sentences:

1. **"Rather than"**

- **Usage**: It's used when comparing two things or actions, often in a more concise way. It connects two elements directly.

  **Examples**:

   - She prefers tea **rather than** coffee.
   - He decided to walk **rather than** drive.
   - They chose to invest in new technology **rather than** expanding their office.

2. **"Rather ... than ..."**

- **Usage**: This structure is used for more emphasis or to make a stronger contrast between two things. It often involves more than one word on either side of "rather" and "than."

  **Examples**:

   - She would **rather** have tea **than** coffee.
   - He would **rather** walk **than** drive.
   - They would **rather** invest in new technology **than** expanding their office.

Key Differences:

- **"Rather than"** is a more compact way of showing preference, often used when the comparison is simple.
- **"Rather ... than ..."** is used to express preference with more emphasis, often in a more conversational tone.

In practice, both are interchangeable in many situations, but **"rather ... than ..."** tends to be used when you want to place a bit more emphasis on the comparison.

#### [English] intercept vs. interrupt

[intercept | meaning of interrupt in Longman Dictionary of Contemporary English | LDOCE](https://www.ldoceonline.com/dictionary/intercept)

[interrupt | meaning of interrupt in Longman Dictionary of Contemporary English | LDOCE](https://www.ldoceonline.com/dictionary/interrupt)

[🆚What is the difference between "interrupt" and "intercept" ? "interrupt" vs "intercept" ? | HiNative](https://hinative.com/questions/1866899#google_vignette)

> I see interrupt as usually more people based, for example, you can interrupt a conversation, a speech, a person's date, someone watching television. I see Intercept as more physical based, for example, you can intercept the ball in football, intercept an incoming missile, the government can intercept your message. Etc



#### [English] Sentence Examples

It is frequently in its least important and lowliest manifestations that the keenest pleasure is to be derived.

I am bound to say, occasionally to embellish, that you have given prominence not so much to the many cause celebres and sensational trials in which I have figured, but rather to those incidents which have given room for those faculties of deduction and logical synthesis which I have made my special province.

There seems to be a danger, if we could define it.

It would have been better if they had been omitted.

No doubt that story contained many scientific theories which she had had to omit from her tale, being unable to comprehend them.

He's taking us from the airport to what is locally down as the Darth Vader Hotel.
= He's taking us from the airport to the local Darth Vader Hotel.

John came in, his arm dripping blood.

Lasso.js will automatically bundle up transitive dependencies by building and walking a dependency graph. (mark down: warking a dependency graph)

#### [React] Keeping list items in order with key

```shell
Warning: Each child in a list should have a unique “key” prop.
```

[Rendering Lists – React](https://react.dev/learn/rendering-lists) 

> [!NOTE]
> Keys tell React which array item each component corresponds to, so that it can match them up later. This becomes important if your array items can move (e.g. due to sorting), get inserted, or get deleted. A well-chosen key helps React infer what exactly has happened, and make the correct updates to the DOM tree.

####  [JavaScript] Stream Operation of HTML Elements

```javascript
Array.form(document.querySelectorAll("form .classname #id")).map(e=>{console.log(e)})
```

```javascript
// return an object in lambda expression
.map(e=>({
   e.common,
   ...e.elements,
}))
```

####  [JavaScript] Batch Call URLs

```javascript
let urls = [
   ["https://.../ui/api/v1/ui/v2/nativeBrowser/releases-local/com/xxx/rm/tns/DecisionDAL", "1.10.1"],
   ["https://.../ui/api/v1/ui/v2/nativeBrowser/releases-local/com/xxx/rm/tns/ElvisPolicyClassificationServiceClient", "1.1.1"],
]
//1.10.1
//["1.0.1-jakarta","1.0.1-NO_SNAPSHOT_IN_PROD-jakarta","1.1.0-jakarta","1.1.1-xio-3.x-jakarta-temp-RELEASE"]
```

```javascript
let results=new Array(urls.length);
results.fill([]);

compareVersions = (version, baseVersion) => {
   let bNums = baseVersion.split("-")[0].split(".");
   let nums = version.split("-")[0].split(".");
   for (let i = 0; i < bNums.length; i++) {
      let n = parseInt(nums[i])
      let b = parseInt(bNums[i])
      if ( n == b || isNaN(n) || isNaN(b)) continue;
      return n > b
   }
   return true;
}
getReleases = (url, baseVersion, index) => fetch(url)
        .then(response => response.json())
        .then(data => {
           let result = data.data.filter(v=>v.name.includes("jakarta") && compareVersions(v.name, baseVersion)).map(v=>v.name)
           results[index] = result;
        })
        .catch(error => {
        });

async function fetchAllUrls(urls) {
   try {
      let fetchPromises = urls.map((url, index) => {
         getReleases(url[0], url[1], index);
      });
   } catch (error) {
      console.error('Fetch error:', error);
   }
}

fetchAllUrls(urls)
```

```javascript
console.log(JSON.stringify(results))
```

```javascript
// add headers
cookies='...'
fetch(url, {
   method: 'GET',
   headers: new Headers({
      'Content-Type': 'application/json',
      'Cookie': cookies
   })
})
```

```
(?<=\d\.\d{1,3}\.\d{1,3})\D.+(?=\")
```

Refer To:

[Using the Fetch API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

[Response - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Response)

[JavaScript] Batch Click Buttons

```javascript
let buttons = document.querySelectorAll(".ant-table-row-expand-icon-collapsed")
let currentIndex = 0
let interval = setInterval(() => {
   if (currentIndex < buttons.length) {
      buttons[currentIndex].click();
      currentIndex++;
   } else{
      currentIndex = 0
      clearInterval(interval)
   }
}, 500);
```

#### [JavaScript] Download as .csv File

```javascript
import dayjs, { Dayjs } from 'dayjs';
  const handleExportCSV = () => {
    const csvContent = [
      [export_columns],
      ...data.map(record => [
        ...record.columns
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filename-prefix-${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    message.success('CSV file downloaded successfully');
  };
```

### [JavaScript] Disallow Autoplay in iframe

add query parameter: `autoplay=0`

```javascript
<iframe src="//player.bilibili.com/player.html?autoplay=0&isOutside=true&aid=114969815289156&bvid=BV1jRtuzyEyf&cid=31480287111&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
```

<iframe src="//player.bilibili.com/player.html?autoplay=0&isOutside=true&aid=114969815289156&bvid=BV1jRtuzyEyf&cid=31480287111&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>

#### [IntelliJ IDEA] How to avoid rearrange import

There is no way to achieve this goal as of today, May 28, 2024.

#### [IntelliJ IDEA] Mark as a Maven Project

[Add Maven support to an existing project | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/convert-a-regular-project-into-a-maven-project.html)

#### [IntelliJ IDEA] Stop Execution of Process in Terminal

It's a bug. Refer to: [Terminal stop execution of process with shortcut CTRL + C not working : IJPL-108742](https://youtrack.jetbrains.com/issue/IJPL-108742/Terminal-stop-execution-of-process-with-shortcut-CTRL-C-not-working)

#### [IntelliJ IDEA] Analyze Dependency in IDEA

[Dependency Analyzer - JetBrains Guide](https://www.jetbrains.com/guide/java/tutorials/analyzing-dependencies/dependency-analyzer/)

[Maven dependencies | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/work-with-maven-dependencies.html#generate_maven_dependency)

[How to detect Java dependency version conflict using IDEA Maven Helper - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/how-to-detect-java-dependency-version-conflict-using-idea-maven/ba-p/3915091)

#### [InteilliJ IDEA] Can Not Use Squash Commit After Pushing

```shell
git switch -c new_branch
```

drop all the commitments

cherry-pick all delete commitments and squash as you want

force push to master

#### [InteilliJ IDEA] Maven Comiple Failure: Class Not Found

There is a local dependency package, which is installed in local repository. But error occured while running `Reload All Maven Projects` and `mvn clean compile` in Terminal in IDEA.

```shell
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.5.1:compile (default-compile) on project ...: Compilation failure: Compilation failure: 
[ERROR] ... cannot access ...
[ERROR]   class file for ... not found
[ERROR] ... cannot find symbol
[ERROR]   symbol:   variable ...
[ERROR]   location: class ...
```

Check whether  `<localrepository>` in  `settings.xml` and local repository in Settings | Build, Execution, Deployment | Build Tools | Maven are the same.

#### [IntelliJ IDEA] How to Use Tomcat in Community Edition

[java - Tomcat in Intellij Idea Community Edition - Stack Overflow](https://stackoverflow.com/questions/22047860/tomcat-in-intellij-idea-community-edition)

[] Bearer Token

A Bearer Token is an access token that is used to authenticate and authorize a user, application, or a service to a server, an API, or a resource. It is called a Bearer Token because it doesn't require any proof of ownership, meaning whoever "bears" the token can use it to access the associated resources.

Bearer Tokens are often used in the context of OAuth 2.0 or HTTP authentication, where they are transmitted as part of the header of an HTTP request. Here's an example of what this might look like:

```
GET /resource HTTP/1.1
Host: server.example.com
Authorization: Bearer mF_9.B5f-4.1JqM
```

In this example, `mF_9.B5f-4.1JqM` is the Bearer Token. The server would then validate this token and, if it's valid, would process the request.

It's important to note that because Bearer Tokens don't require any proof of ownership, they must be protected to prevent unauthorized access. This is typically done by transmitting them over HTTPS to ensure the tokens are encrypted during transit.

The "Bearer" keyword before the actual token is a convention used in HTTP Authorization header scheme to indicate that the authentication type is a bearer token. This is part of the OAuth 2.0 specification.

In the context of HTTP, the Authorization header field value contains credentials to authenticate a user agent with a server. The "Bearer" scheme is one such credential type. The word "Bearer" is followed by a single space (mandatory) and then the actual token string.

This is how it looks in an HTTP request:

```
Authorization: Bearer <token>
```

The "Bearer" keyword informs the server that the client is sending a bearer token. This helps the server correctly interpret the credentials and authenticate the request. It's important to note that the server must support the "Bearer" scheme for this to work.

What are some best practices for handling bearer tokens securely?

Bearer tokens are a type of access token that is used to authenticate and authorize a user, application, or a service to a server, an API, or a resource. Because bearer tokens don't require any proof of ownership, they must be protected to prevent unauthorized access. Here are some best practices for handling bearer tokens securely:

1. **Use HTTPS**: Always transmit bearer tokens over a secure channel. Using HTTPS ensures that the tokens are encrypted during transit and protects them from being intercepted by attackers.

2. **Store Securely**: If you need to store bearer tokens, do so securely. Avoid storing tokens in plain text. Use secure storage mechanisms provided by the operating system or third-party libraries.

3. **Limit Token Lifespan**: Implement token expiration. Short-lived tokens are less likely to be useful to an attacker if they are intercepted. When a token expires, the user will need to re-authenticate to get a new token.

4. **Use Token Revocation**: Implement a mechanism to revoke tokens if you suspect they have been compromised. This could be a manual process or an automatic one based on certain conditions.

5. **Implement Token Scopes**: Use token scopes to limit what a bearer token can do. For example, you might have a token that can only read data but not update or delete it.

6. **Validate Tokens**: On the server-side, always validate the tokens. Check that the token is correctly formatted, has not expired, and that the signature is correct.

7. **Avoid Sharing Tokens**: Tokens should not be shared between users or between different applications. Each user or application should authenticate independently and receive its own token.

8. **Protect from CSRF Attacks**: If you're using bearer tokens in a web application, ensure you're protected against cross-site request forgery (CSRF) attacks. One common technique is to use the "same-site" attribute for cookies that store bearer tokens.

Remember, security is a complex field and these are just general guidelines. The exact measures you need to take will depend on your specific use case and environment.

#### [IintelliJ IDEA] Ignore Local Generated File

Add global ignore configuration

```shell
git config --global core.excludesfile ~/.gitignore_global
touch ~/.gitignore_global
vim ~/.gitignore_global
```

edit and save `.gitignore_global`

```
**/.foo
```

Also, add excludsion in IDEA to avoid search

```
Settings | Editor | File Types | Ignored Files and Folders
```

add `.foo`

Note: It's not recommanded to add ignore these files in `.gitignore`, because it has nothing to do with business.

There's a complicate senerio,

```
Project_Root
|- logs/
	|- a.log
	|- b
|- Moudule
	|- logs/
		|- c.log
		|- d
	|- src/main/java
		|- package_name/logs/package_name
			|- Java.class
```

It seems no way to achieve:

[Git - gitignore Documentation](https://git-scm.com/docs/gitignore)

> An optional prefix "`!`" which negates the pattern; any matching file excluded by a previous pattern will become included again. It is not possible to re-include a file if a parent directory of that file is excluded. Git doesn’t list excluded directories for performance reasons, so any patterns on contained files have no effect, no matter where they are defined. Put a backslash ("`\`") in front of the first "`!`" for patterns that begin with a literal "`!`", for example, "`\!important!.txt`".

However, this configurations may help:

```
**/foo
!**/java/**/foo
```

#### [IntelliJ IDEA] Git Log Window Is Empty

[Git Log window is empty – IDEs Support (IntelliJ Platform) | JetBrains](https://intellij-support.jetbrains.com/hc/en-us/community/posts/5755387223186-Git-Log-window-is-empty)

> If only git log is empty (the graph and the commits) then it means (usually) the indexing got corrupted as some point and the solution is to Invalidate cache → Clear VCS indexes → Invalidate and restart

[Version control log tab suddenly empty, although all git commands still work in intellij : IJPL-91888](https://youtrack.jetbrains.com/issue/IJPL-91888/Version-control-log-tab-suddenly-empty-although-all-git-commands-still-work-in-intellij)

#### [IntelliJ IDEA] Drop Frame

[Drop Frame is missing in IntelliJ IDEA - Stack Overflow](https://stackoverflow.com/questions/73904720/drop-frame-is-missing-in-intellij-idea)

> The `Drop Frame` was renamed to `Reset Frame` and now is located to the left of the frame name in Frames view (curved arrow icon on the screenshot)

#### [IntelliJ IDEA] Disable Sticky Line

Dont' show first line in Editor Window

Settings | Editor | General | Appearance

- [ ] Show sticky line while scrolling: 5 max lines

#### [IntelliJ IDEA] Reader Mode

Settings | Editor | Reader Mode

Show in Reader mode:

- [x] Rendered documentation comments
- [x] Error and warning highlighting inspection widget
- [ ] Font ligatures
- [ ] Increased line height[atebay.md](../../../../Documents/atebay.md)
- [x] Code vision hints for usages, inheritors, and related problems

#### [IntelliJ IDEA] Keep jumping to error file[atebay.md](../../../../Documents/atebay.md)

Settings | Build, Execution, Deployment | Compiler

- [ ] Automatically show first error in editor

NOTE If you've set reload after any changes, you'd better uncheck this setting as well.

#### [IntelliJ IDEA] Advanced Settings

Settings | Advanced Settings | Debuger: Maximum number of recent expression: 999

Settings | Advanced Settings | IDE: Maximum number of recent project: 999

Settings | Advanced Settings | Terminal: Terminal scrollback buffer sizet: 9999

#### [IntelliJ IDEA] Window Layout

Window | Layouts | `<name of your layout>` | Apply

Refer To:

[How do I save defaults for all new projects? – IDEs Support (IntelliJ Platform) | JetBrains](https://intellij-support.jetbrains.com/hc/en-us/community/posts/12985640452882-How-do-I-save-defaults-for-all-new-projects)

[Layouts | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/tool-window-layouts.html)

#### [IntelliJ IDEA] GPG key file not found

Commit after Force Quit IDEA and Reopen

Restart system

#### [IntelliJ IDEA] is not available while IDEA is updating indexes

Update indexes has no response

Force Quit IDEA and Restart

Open the project which causes this problem

Clear Invalidate Caches and Restart

Don't open other projects or do any operations until update finish.

Refer To:

[maven - Intelli J IDEA takes forever to update indices - Stack Overflow](https://stackoverflow.com/questions/15991561/intelli-j-idea-takes-forever-to-update-indices)

#### [IntelliJ IDEA] Custom Inspections

Inspection name: Demo

- [x] Cleanup inspection

Description: Show in Settings | Editor | Inspections | my-inspection

Problem tool tip (use macro #ref to insert highlighted code): Show as tip in Editor

Suppress ID: NoIdea

There're lots of templates in Templates when you add a new inspection.



Refer To:

[Create custom inspections | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/creating-custom-inspections.html)

[Search templates, modifiers, and script constraints | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/structural-search-and-replace.html)

[Search templates, modifiers, and script constraints | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/search-templates.html)

[Inspections | IntelliJ Platform Plugin SDK](https://plugins.jetbrains.com/docs/intellij/inspections.html)

[add rules · alibaba/p3c@b948c7e](https://github.com/alibaba/p3c/commit/b948c7e62b36c2630b113366a5d44a916504e37d) Alibaba Java Code Inspections Plugin

#### [IntelliJ IDEA] Safe delete﻿

[Safe delete | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/safe-delete.html)

#### [IntelliJ IDEA] `@$PROJECT_DIR$` and `$MODULE_WORKING_DIR$`

In IntelliJ IDEA, both `@$PROJECT_DIR$` and `$MODULE_WORKING_DIR$` are macros used to represent specific directory paths, making configurations more portable across different environments or machines. Here's how they are typically used:

- `@$PROJECT_DIR$` refers to the root directory of your current project. This macro is useful when you need to specify a path relative to the entire project, such as when configuring project-wide settings or paths that are used across multiple modules.

- `$MODULE_WORKING_DIR$` refers to the working directory of the currently active module. This is particularly useful when you have a multi-module project and need to run or debug modules separately, ensuring that file paths are resolved correctly relative to the module being worked on.

These macros can be used in various configurations within IntelliJ IDEA, such as in run/debug configurations to specify working directories or script paths, making your project setup more flexible and easier to share with others.

#### [IntelliJ IDEA] Live Template `init`

```java
@PostConstruct
public void init() {
   $END$
}
```

Options:

- [x] Reformat according to style
- [x] shorten FQ names

Applicable in Java: declearation.

#### [IntelliJ IDEA] Could not find main class

[java - Error: Could not find or load main class in intelliJ IDE - Stack Overflow](https://stackoverflow.com/questions/10654120/error-could-not-find-or-load-main-class-in-intellij-ide)

It may not about configurations of project in IDEA, it may be about code. Try to rollback the changes and continue.

#### [IntelliJ IDEA] Accessing invalid virtual file

```shell
Accessing invalid virtual file: file:///pathto/foo; original:2314233; found:2314278; File.exists()=true
```

- [x] Clear file system cache and Local History

Refer to: [intellij accessing invalid virtual file - Stack Overflow](https://stackoverflow.com/questions/71380674/intellij-accessing-invalid-virtual-file)

#### [IntelliJ IDEA] Git

Settings | Version Control | Git | Commit

- [x] Add the 'cherry-picked from <hash>' suffix when picking commits pushed to protected branches

Settings | Version Control | Git | Push

Protected branches: (empty)

Settings | Version Control | Git | Update

Update method: Rebase

#### [IntelliJ IDEA] HotSwap

<kbd> Cmd + Shift + F9 </kbd> 

Refer To:

[Alter the program's execution flow | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/altering-the-program-s-execution-flow.html#-22g6kz_67)

#### [IntelliJ IDEA] Clean Test History

Default history size: 10

Store path: `$ProjectFileDir$/.idea/workspace.xml`

#### [IntelliJ IDEA] `.iml` File Not Created in Project Root

External Libraries missing `org.springframework`

It doesn't matter that the `.iml` file isn't created.

Check these places, if there're missing modules:

Settings | Build, Execution, Deployment | Compiler | Java Compiler | Pre-module bytecode version

Project Settings (<kbd> Cmd + ; </kbd>) | Modules

[iml file not created in project root – IDEs Support (IntelliJ Platform) | JetBrains](https://intellij-support.jetbrains.com/hc/en-us/community/posts/4424133928594-iml-file-not-created-in-project-root)

#### [InteilliJ IDEA Keymap]

Plugins | Maven | Analyze Dependencies… <kbd> Cmd + M </kbd>
And remove Main Menu | Window | Minimize

#### [Git] Get Started

Git Get Started

[Git - Book](https://git-scm.com/book/en/v2)

* [Git - Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things)

```shell
---
# Get Started
# https://git-scm.com/docs/git-init
git init

# https://git-scm.com/docs/git-statuss
git status
git status -sb
git status -uall

# https://git-scm.com/docs/git-add
git add <pathspec>
git add -all

# https://git-scm.com/docs/git-reset
git reset
git reset HEAD --
# drop the latest commit
git reset HEAD~
git reset --hard

# https://git-scm.com/docs/git-restore
git restore --staged <pathspec>

# https://git-scm.com/docs/git-commit
git commit -m <msg>

---
git commit . --amend
gcann! --reset-author
git commit --all --date=now --no-edit --amend --reset-author

---
# https://git-scm.com/docs/git-log
glog
glg
glg -i --grep='msg'
---
# https://git-scm.com/docs/git-diff
gd
gdca
gdcw
gds
---
# https://git-scm.com/docs/git-push
git push origin from:to -f

---
# https://git-scm.com/docs/git-log
git log --oneline

# https://git-scm.com/docs/git-checkout
git checkout <commit>

# https://git-scm.com/docs/git-switch
git switch -c new

# https://git-scm.com/docs/git-branch
git branch -v
git branch -r

# https://git-scm.com/docs/git-cherry-pick
git cherry-pick <commit>

git branch -D <branchname>

---
# restore files
## staged
## unstaged
grhh
git reset --hard

# force-checkout origin/master
grhh origin/master

## untracked
# https://git-scm.com/docs/git-clean
git clean -f

---
# restore commit after dropping
git reflog
# find the commit
git branch -f main <commit>
gb -f main <commit>

---
# copy a new branch in remtoe
git checkout -b <branchname> origin/<branchname>
git push origin <branchname>:<newbranch>

---
git rebase -i <previous-commit>
change the order of commits
pick or squash, in general
edit commit messages

# only edit message
git rebase -i <previous-commit>
edit <commit>
:wq
git commmit --amend '-S'
edit message...
git rebase --continue
# Or grbc

---
# branch trace new commit link
---A---B(branchname)
   \---C (HEAD)
   
---A---B(dropped)
   \---C (branchname)
   
git checkout <branchname>
git reset --hard <commmit>

---
# https://git-scm.com/docs/git-pull
git fetch --all
git pull
git pull --rebase
gfa
gp
gp --rebase


# merge remote/A to local/B
# https://git-scm.com/docs/git-merge
git fetch --all
git checkout <branchnameB>
git merge origin <branchnameA>

---
# resolve conflicts
git rebase origin/<branchname>
git status
<<<<<<< HEAD
=======
>>>>>>> <hash> (Migrating from ...)
git add <file>
git status
git rebase --continue

---
# split a commit
irt
grbi <commit>^
edit <commit-msg>
w
grh HEAD^
... some change
ga <fileA>
gcmsg <commit-msg>
... x N add and commit
grbc
disirt
# push without Git hooks
git push --no-verify
gp --no-verify

---

# reorder commits
grbi HEAD~3
# copy and delete current line
dd
# paste the line below the cursor, can't paste above the cursor
p
# save if modification and exit
:x
---

git commit --amend '-S'

---

# update commit date
## --date=now
grbi --root

gcann!

# or
git commit --verbose --all --date=now --no-edit --amend

grbc
---

---

# who committed this changed
git blame <file> | grep '<content>'

# push an empty branch. refer to https://stackoverflow.com/questions/34100048/create-empty-branch-on-github
git switch --orphan <new branch>
git commit --allow-empty -m "feat: initial commit on orphan branch"
git push -u origin <new branch>

---
# https://git-scm.com/docs/git-stash
git stash
git stash push
gsta -m <message>
# store at refs/stash@{0}
gstl
gsts 0
gstp 0
gsta 0
gstd 0
git stash create
# <commit>
git stash store <commit>

```

#### [Git] `git commit --amend -S`

The command `git commit --amend -S` is used to amend the most recent commit and sign it with a GPG key. The `-S` flag ensures that the commit is signed.

Here is a brief explanation of the command:

- `git commit --amend`: This command allows you to modify the most recent commit. It opens the commit message in your default text editor, allowing you to change the commit message or add new changes to the commit.
- `-S`: This flag signs the commit with your GPG key, ensuring that the commit is verified and attributed to you.

To use this command, you need to have GPG set up and configured with Git. If you haven't done this yet, you can follow these steps:

1. Generate a GPG key if you don't have one:
   ```shell
   gpg --full-generate-key
   ```

2. List your GPG keys to find the key ID:
   ```shell
   gpg --list-secret-keys --keyid-format LONG
   ```

3. Configure Git to use your GPG key:
   ```shell
   git config --global user.signingkey YOUR_KEY_ID
   ```

4. Ensure that Git signs your commits by default:
   ```shell
   git config --global commit.gpgSign true
   ```

After setting up GPG, you can use the `git commit --amend -S` command to amend and sign your commits.

#### [Git] gpg key remove

```shell
gpg --list-secret-keys --keyid-format=long
gpg --delete-secret-keys <key-id>

Delete this key from the keyring? (y/N) y
This is a secret key! - really delete? (y/N) y
```

#### [Git] (NotRecommanded) irt - interactive-rebase-tool

[MitMaro/git-interactive-rebase-tool: Native cross-platform full feature terminal-based sequence editor for git interactive rebase.](https://github.com/MitMaro/git-interactive-rebase-tool)

if you don't use homebrew to install, you will face problems like these:

```shell
hint: Waiting for your editor to close the file... error: cannot run interactive-rebase-tool: No such file or directory
error: unable to start editor 'interactive-rebase-tool'
```

```shell
hint: Waiting for your editor to close the file... fatal: cannot exec 'interactive-rebase-tool': Permission denied
error: unable to start editor 'interactive-rebase-tool'
```

```shell
hint: Waiting for your editor to close the file... error: interactive-rebase-tool died of signal 9
error: There was a problem with the editor 'interactive-rebase-tool'.
```

```shell
git config --global sequence.editor interactive-rebase-tool
```

| Key         | Mode        | Description                                |
| ----------- | ----------- | ------------------------------------------ |
| `q`         | Normal/Diff | Abort interactive rebase                   |
| `Q`         | Normal/Diff | Immediately abort interactive rebase       |
| `w`         | Normal/Diff | Write interactive rebase file              |
| `W`         | Normal/Diff | Immediately write interactive rebase file  |
| `j`         | Normal/Diff | Move selected commit(s) down               |
| `k`         | Normal/Diff | Move selected commit(s) up                 |
| `b`         | Normal      | Toggle break action                        |
| `p`         | Normal/Diff | Set selected commit(s) to be picked        |
| `r`         | Normal/Diff | Set selected commit(s) to be reworded      |
| `e`         | Normal/Diff | Set selected commit(s) to be edited        |
| `s`         | Normal/Diff | Set selected commit(s) to be squashed      |
| `f`         | Normal/Diff | Set selected commit(s) to be fixed-up      |
| `d`         | Normal      | Set selected commit(s) to be dropped       |
| `d`         | Diff        | Show full commit diff                      |
| `E`         | Normal      | Edit the command of an editable action     |
| `v`         | Normal/Diff | Enter and exit visual mode (for selection) |
| `I`         | Normal      | Insert a new line                          |
| `Delete`    | Normal/Diff | Remove selected lines                      |
| `!`         | Normal/Diff | Open todo file in external editor          |
| `Control+z` | Normal/Diff | Undo the previous change                   |
| `Control+y` | Normal/Diff | Redo the previously undone change          |
| `c`         | Normal/Diff | Show commit information                    |

#### [Git] Git Add

[Git - git-add Documentation](https://git-scm.com/docs/git-add)

[Git Guides - git add](https://github.com/git-guides/git-add)

> Using `git reset` to undo `git add`
>
> ```shell
> git add -A
> # undo add
> git reset
> git reset HEAD --
> git restore --staged <pathspec>
> ```

#### [Git] Git Log

Show Message Only

```shell
git log --oneline
```

[version control - How to output git log with the first line only? - Stack Overflow](https://stackoverflow.com/questions/4479225/how-to-output-git-log-with-the-first-line-only)

Show Change Files

```shell
git log <commit_id> --name-only
```

[How to have 'git log' show filenames like 'svn log -v' - Stack Overflow](https://stackoverflow.com/questions/1230084/how-to-have-git-log-show-filenames-like-svn-log-v)

#### [Git] Count Code Line

```shell
git log --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```

```shell
git log --pretty=tformat: --numstat | grep -v 'test' | grep -v '.xml' | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }'
```

#### [Git] Show A Commit Changes

```shell
git show <commit>
git diff <commit>~ <commit> 
```

[version control - How can I see the changes in a Git commit? - Stack Overflow](https://stackoverflow.com/questions/17563726/how-can-i-see-the-changes-in-a-git-commit)

#### [Git] Password authentication is not available for Git operations.

```shell
remote: Password authentication is not available for Git operations.
remote: You must use a personal access token or SSH key.
remote: See ...(some help page)
fatal: unable to access 'https://<github-domain-url>/<organization>/<repository>.git/': The requested URL returned error: 403
```

Can not use HTTPS to access, change to SSH.

```shell
git remote -v
git remote set-url <origin> <url>
git remote -v
```

Refer to: [Managing remote repositories - GitHub Docs](https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories)

#### [Git] Restore A File

```shell
git checkout HEAD -- my-file.txt

# Since Git 2.23 (August 2019) you can use restore
git restore pathTo/MyFile

# restore current changes
git restore .
git reset --hard HEAD~1
git checkout .

# restore deleted files
git reset HEAD -- .
```

[git - Hard reset of a single file - Stack Overflow](https://stackoverflow.com/questions/7147270/hard-reset-of-a-single-file)



To restore all changes in your Git repository to their last committed state, effectively undoing all modifications, unstaged, and staged changes, you can use the following commands:

To restore all changes in a Git repository, you can use different commands based on the state of your changes (staged, unstaged, or committed). Here's how to handle each scenario:

1. **Check Out the Current Branch**: This will discard changes to tracked files.
```bash
git checkout .
```

1. **Unstaged Changes**: To discard changes in your working directory that haven't been staged:
```bash
git checkout -- .
```

2. **Clean Untracked Files**: This will remove all untracked files and directories.
```bash
git clean -fd
```

Here's a step-by-step explanation:

2. **Staged Changes (but not committed)**: To unstage all changes and then discard them:
```bash
git reset HEAD -- .
git checkout -- .
```

- `git checkout .` resets the state of all tracked files to their last committed version, discarding any changes you've made to them since then.
3. **Committed Changes**: To undo the last commit and keep the changes in the working directory:
```bash
git reset HEAD~1
```
- `git clean -fd` removes all files and directories in your working directory that are not under version control, cleaning your repository from any new files and directories that were added since the last commit.

To completely remove the last commit and all changes associated with it:
```bash
git reset --hard HEAD~1
```

**Note**: These commands will permanently delete your uncommitted changes and untracked files/directories. Ensure you really want to discard these changes before running them.

4. **Stashed Changes**: If you have stashed changes and want to restore them:

```bash
git stash pop
```
Or, if you know the specific stash you want to apply:

```bash
git stash apply
```

#### [Git] Git stash

```shell
git stash -u
git stash pop

# stash some files
git stash -p
```

```shell
y - stage this hunk
n - do not stage this hunk
q - quit; do not stage this hunk or any of the remaining ones
a - stage this hunk and all later hunks in the file
d - do not stage this hunk or any of the later hunks in the file
g - select a hunk to go to
/ - search for a hunk matching the given regex
j - leave this hunk undecided, see next undecided hunk
J - leave this hunk undecided, see next hunk
k - leave this hunk undecided, see previous undecided hunk
K - leave this hunk undecided, see previous hunk
s - split the current hunk into smaller hunks
e - manually edit the current hunk
p - print the current hunk
? - print help
```



[Git - git-stash Documentation](https://git-scm.com/docs/git-stash)

#### [Git] Git API in Java

```java
package me.hunter.git;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FalseFileFilter;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.revwalk.RevCommit;

public class GitTestSuite {

    public static final String RESOURCES_DIR = "src/main/resources/";
    public static final String COMMIT_MESSAGE = "Update application properties files";

    public static void main(String[] args) throws IOException, GitAPIException {
        new GitTestSuite().run();
    }


    public static void run() throws GitAPIException {
        String userDir = System.getProperty("user.dir");
        File repoDir = new File(userDir);
        Git git = null;
        try {
            git = Git.open(repoDir);

            // Stash current changes
            git.stashCreate().setIncludeUntracked(true).call();

            boolean mkdirs = new File(userDir + "/" + RESOURCES_DIR).mkdirs();
            // Create application*.properties
//            boolean newFile = new File(userDir + "/" + RESOURCES_DIR + "application.properties").createNewFile();
//            newFile &= new File(userDir + "/" + RESOURCES_DIR + "application-Dev.properties").createNewFile();
//            if (newFile) {
//                System.out.println("Created application properties files");
//            } else {
//                System.out.println("Failed to create application properties files");
//            }
            // List application*.properties files in src/main/resources
            File resourcesDir = new File(userDir + "/" + RESOURCES_DIR);
            Collection<File> propertiesFiles = FileUtils.listFiles(
                    resourcesDir,
                    new WildcardFileFilter("application*.properties"),
                    FalseFileFilter.INSTANCE
            );

            if (!propertiesFiles.isEmpty()) {
                // Add each file to the staging area
                for (File file : propertiesFiles) {
                    String relativePath = RESOURCES_DIR + file.getName();
                    git.add().addFilepattern(relativePath).call();
                }

                // Commit changes with a message
                git.commit().setMessage(COMMIT_MESSAGE).call();
            }
        } catch (IOException | GitAPIException e) {
            e.printStackTrace();
        } finally {
            if (git != null) {
                try {
                    // Apply stashed changes
                    git.stashApply().call();
                    git.stashDrop().call(); // There may be conflicts
                } finally {
                    git.close();
                }
            }
        }
    }
}

```

Refer To:

[A Guide to JGit | Baeldung](https://www.baeldung.com/jgit)

[Git - JGit](https://git-scm.com/book/uz/v2/Appendix-B%3A-Embedding-Git-in-your-Applications-JGit)

[GitHub API for Java –](https://github-api.kohsuke.org/)

#### [Git] Global Git Hook

```shell
mkdir -p ~/.git/hooks
git config --global core.hooksPath ~/.git/hooks
chmod +x ~/.git/hooks/*
```

To set up a global Git hook, you need to create a hook script that Git will execute whenever a specific action (like a commit, push, etc.) is triggered, and configure it globally so that it applies to all of your repositories.

Here’s how to set up a **global Git hook**:

##### 1. **Create a Directory for Global Hooks**

First, you need to create a directory where your global Git hooks will reside. You can place this directory anywhere on your system, but a common location is in your home directory.

```bash
mkdir -p ~/.git_hooks
```

##### 2. **Configure Git to Use the Global Hooks Directory**

After creating the directory, tell Git to use it for all hooks globally. Run the following command to configure Git to look in this directory:

```bash
git config --global core.hooksPath ~/.git_hooks
```

This will make Git look for hooks in the `~/.git_hooks` directory instead of the default `.git/hooks` directory in each repository.

##### 3. **Create Your Hook Script**

Now, create a hook script inside your `~/.git_hooks` directory. Git hooks are typically shell scripts, but you can write them in any language as long as the script is executable.

For example, if you want to set up a **pre-commit** hook to run some checks before every commit, you could create a script called `pre-commit` inside the `~/.git_hooks` directory:

```bash
touch ~/.git_hooks/pre-commit
```

Then, add some logic to this file, like checking for code style violations or running tests:

```bash
#!/bin/bash
echo "Running pre-commit checks..."
# Add your checks here, e.g., linting or tests
```

##### 4. **Make the Hook Script Executable**

Git requires that hook scripts be executable. After creating your script, make it executable by running:

```bash
chmod +x ~/.git_hooks/pre-commit
```

##### 5. **Test the Global Hook**

Now that your global Git hook is set up, you can test it. Try to commit changes in any of your repositories, and your hook should run automatically. For example, if you created a `pre-commit` hook, it will run each time you try to commit.

```bash
git commit -m "Test commit"
```

If everything is set up correctly, the hook will be executed before the commit happens.

##### 6. **Adding More Hooks**

You can add more hooks by creating additional files in the `~/.git_hooks` directory. Here are some common hooks you might set up:

- `pre-commit`: Runs before a commit is made.
- `pre-push`: Runs before changes are pushed to a remote repository.
- `commit-msg`: Runs when a commit message is written.
- `post-merge`: Runs after a successful merge.

Just create the appropriate file in the `~/.git_hooks` directory and make it executable.

##### Example of Global `pre-push` Hook:

If you want to add a `pre-push` hook to ensure that tests are run before every push, you could create a file called `pre-push`:

```bash
touch ~/.git_hooks/pre-push
```

Then, add your custom logic (e.g., running tests before pushing):

```bash
#!/bin/bash
echo "Running tests before pushing..."
# Insert commands to run tests, e.g., `npm test` or `pytest`
```

Make the file executable:

```bash
chmod +x ~/.git_hooks/pre-push
```

##### 7. **Use Existing Hook Scripts**

If you use a tool like [Husky](https://github.com/typicode/husky) or other Git hook managers, you can set it up to manage global hooks more easily. However, the manual method described above works perfectly for simple use cases.

------

By setting up global hooks like this, you can ensure that the same checks or actions are applied across all your Git repositories without needing to configure them individually.

#### [Linux/Unix/MacOS] `.zshrc`

```shell
# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time Oh My Zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git mvn)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch $(uname -m)"

# Set personal aliases, overriding those provided by Oh My Zsh libs,
# plugins, and themes. Aliases can be placed here, though Oh My Zsh
# users are encouraged to define aliases within a top-level file in
# the $ZSH_CUSTOM folder, with .zsh extension. Examples:
# - $ZSH_CUSTOM/aliases.zsh
# - $ZSH_CUSTOM/macos.zsh
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"


# ===
alias rm='trash'
# quick open projects with IDEA
# support TAB completion
ide() {
  open -na 'IntelliJ IDEA CE.app' --args "$@"
}
# === override
alias mvncdst='mvn clean deploy -Dmaven.test.skip'
alias mvncist='mvn clean install -Dmaven.test.skip'
alias mvncisto='mvn clean install -Dmaven.test.skip --offline'
alias mvncvst='mvn clean verify -Dmaven.test.skip'
# === add
alias mvncc='mvn clean compile'
alias mvnccst='mvn clean compile -Dmaven.test.skip'
alias mvncpst='mvn clean package -Dmaven.test.skip'
alias mvncspst='mvn clean source:jar package -Dmaven.test.skip'
alias mvncsist='mvn clean source:jar install -Dmaven.test.skip'
# alias mvndp='mvn dependency:purge-local-repository -DmanualInclude=<groupId>:<artifactId>'
# === git-interacitve-rebase tool
alias irt='git config --global sequence.editor interactive-rebase-tool'
alias disirt='git config --global --unset sequence.editor'
# ===
# Setting NodeJS Extra CA Path
export NODE_EXTRA_CA_CERTS="/Library/Application Support/Netskope/STAgent/download/nscacert_combined.pem"
alias ll='ls -l'
export MAAS_SECRET_ENCRYPT_KEY=kBIfLQi@cRt#NkCb
export JAVA_OPTS="-Xms2g -Xmx8g -Xss4m"
alias java8='export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.391.4/zulu-8.jdk/Contents/Home'
alias java11='export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk11.0.18.2/zulu-11.jdk/Contents/Home'
alias java17='export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk17.0.6.9/zulu-17.jdk/Contents/Home'
alias jdk8='export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.391.4/zulu-8.jdk/Contents/Home'
alias jdk11='export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk11.0.18.2/zulu-11.jdk/Contents/Home'
alias jdk17='export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk17.0.6.9/zulu-17.jdk/Contents/Home'
java17
```

```shell
➜  .oh-my-zsh git:(master) ✗ pwd
/Users/.../.oh-my-zsh
➜  .oh-my-zsh git:(master) ✗ grv
origin	https://github.com/ohmyzsh/ohmyzsh.git (fetch)
origin	https://github.com/ohmyzsh/ohmyzsh.git (push)
  origin/master
  origin/original1.master
```

```shell
➜  homebrew git:(stable) pwd
/opt/homebrew
➜  homebrew git:(stable) gb -avv
  master                                                                b4fe541766 [origin/master] Merge pull request #19454 from Homebrew/dependabot/bundler/Library/Homebrew/parallel_tests-5.1.0
* stable                                                                2f6db3757e Merge pull request #19448 from gromgit/diagnostic/user_path_prereq
  remotes/origin/HEAD                                                   -> origin/master
  remotes/origin/bundle-install-euid                                    1d6784fb83 utils/gems: handle mismatching EUID and UID for bundle installs
  remotes/origin/dependabot/bundler/Library/Homebrew/json_schemer-2.2.1 b8bc33ed0b Update RBI files for json_schemer.
  remotes/origin/deps-filters                                           649ff4101c cmd/deps: add args to filter output
  remotes/origin/load-internal-cask-json-v3                             db3ab2ec12 cask/cask_loader: simplify branching logic for json v2 vs. v3
  remotes/origin/master                                                 b4fe541766 Merge pull request #19454 from Homebrew/dependabot/bundler/Library/Homebrew/parallel_tests-5.1.0
  remotes/origin/tapioca-patch                                          9c2aa47925 Patch Tapioca to fix YARD doc generation
  remotes/origin/timeout-values                                         a9c8556b9d github_runner_matrix: define timeout values in constants
~
```

#### [Linux/Unix/MacOS] Development Environment Setup

JDK

```shell
/Library/Java/JavaVirtualMachines
```

Others like maven, tomcat, etc

`~/devtools/` or somewhere you want

#### [Linux/Unix/MacOS] Copy File Contents To Clipboard

```shell
pbcopy < filename
pbpaste > filename
```

#### [Linux/Unix/MacOS] Port

```shell
lsof -i :5005 -i :8090 -i :8080
netstat -anp | grep 8080
```

#### [Linux/Unix/MacOS] Getting the Absolute Directory of a File in Linux

[Getting the Absolute Directory of a File in Linux | Baeldung on Linux](https://www.baeldung.com/linux/absolute-directory-of-file)

```shell
readlink -f <file>
```

#### [Linux/Unix/MacOS] Batch rename file/folder name

```shell
ls | xargs -I {} mv {} prefix{}subfix
```

#### [Linux/Unix/MacOS] Remove Specific History

// TODO doesn't work for me

```shell
history | grep command
history -d offset
```

Refer To:

[bash - Remove specific history commands on OS X - Stack Overflow](https://stackoverflow.com/questions/67110898/remove-specific-history-commands-on-os-x)

#### [Linux/Unix/MacOS] History Size

[command line - How to change history size for ever? - Ask Ubuntu](https://askubuntu.com/questions/307541/how-to-change-history-size-for-ever)

```shell
# .zshrc
HISTSIZE=-1
HISTFILESIZE=-1 # .zsh_history
```

#### [Linux/Unix/MacOS] How to Make Tab Auto-Completion Case-Insensitive in Bash

[Ignore case with Terminal tab completion in mac - Awais Tahir - Medium](https://medium.com/@hamza.idrees251/ignore-case-with-terminal-tab-completion-in-mac-147ba839719e)

```shell
# ~/.zshrc
autoload -Uz compinit && compinit
#or
unsetopt CASE_GLOB
```

[How to Make Tab Auto-Completion Case-Insensitive in Bash | Baeldung on Linux](https://www.baeldung.com/linux/bash-tab-auto-completion-case-insensitive)

> NOTE Doesn't work for me

```shell
echo 'set completion-ignore-case on' | sudo tee -a /etc/inputrc
```

#### [Linux/Unix/MacOS] Base64

```shell
base64 -i file > file_base64
cat file_base64 | pbcopy
pbpaste
base64 -d -i file > file_decode

```

[Git] gpg: signing failed: No pinentry

```shell
error: gpg failed to sign the data:
[GNUPG:] KEY_CONSIDERED 6494BC14FD1D70E0294E2542156EB4EDEF17CF1B 2
[GNUPG:] BEGIN_SIGNING H10
gpg: signing failed: No pinentry
[GNUPG:] FAILURE sign 67108949
gpg: signing failed: No pinentry
fatal: failed to write commit object
```

<your-gpg-key-id>

IntelliJ IDEA crash, causing gpg-agent locked.

```shell
ls -al ~/.gnupg
```

Output: Some lock files are there in `~/.gnupg`

```shell
srwx------@ 1 <user>  staff     0B Mar 31 13:59 S.gpg-agent
srwx------@ 1 <user>  staff     0B Mar 31 13:59 S.gpg-agent.browser
srwx------@ 1 <user>  staff     0B Mar 31 13:59 S.gpg-agent.extra
srwx------@ 1 <user>  staff     0B Mar 31 13:59 S.gpg-agent.ssh
srwx------@ 1 <user>  staff     0B May  9 10:22 S.scdaemon
```

S.gpg-agent: The main socket for the gpg-agent. This is used for general communication with the agent.
S.gpg-agent.browser: A socket used for browser-related operations, such as signing or decrypting data for browser extensions.
S.gpg-agent.extra: An additional socket for other purposes, often used for custom configurations or integrations.
S.gpg-agent.ssh: A socket used for SSH agent emulation. This allows gpg-agent to act as an SSH agent for managing SSH keys.
S.scdaemon: A socket for the scdaemon, which is responsible for smart card operations.

```shell
ps aux | grep gpg-agent
```

Output: gpg-agent is running

```shell
<user>          13810   0.0  0.0 410866800   3136   ??  Ss   31Mar25   1:18.55 gpg-agent --homedir /Users/<user>/.gnupg --use-standard-socket --daemon
```

Restart gpg-agent

```shell
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent
```

You can find locked files in `~/.gnupg` were gone.

#### [Git]

```
A - B - C - D - E (main)
    \
     X - Y - Z (How can I find the Z commit?)
    (HEAD, X is the commit I can found)
```

I deleled the branch for a while, so I couldn't find it back from `git reflog`.

[How do I move forward and backward between commits in git? - Stack Overflow](https://stackoverflow.com/questions/6759791/how-do-i-move-forward-and-backward-between-commits-in-git)

```shell
# where towards is a SHA1 of the commit or a tag.
git checkout $(git rev-list --topo-order HEAD..towards | tail -1)
```

Never checkout or create new branch before

```shell
git reset HEAD@{1}
```

[Git] Git Clone Failed

```shell
remote: Invalid username or password.
```

password is token, not password. password is not allowed at company.

#### [Linux/Unix/MacOS] Autocomplete Based on History?

[How To Set Up History-Based Autocompletion in Zsh - DEV Community](https://dev.to/rossijonas/how-to-set-up-history-based-autocompletion-in-zsh-k7o)

```shell
# ~/.zshrc

# initialize autocompletion
autoload -U compinit && compinit

# history setup
setopt SHARE_HISTORY
HISTFILE=$HOME/.zhistory
SAVEHIST=1000
HISTSIZE=999
setopt HIST_EXPIRE_DUPS_FIRST

# autocompletion using arrow keys (based on history)
bindkey '\e[A' history-search-backward
bindkey '\e[B' history-search-forward
```

```shell
source ~/.zshrc
```

[bash: smart autocomplete based on history? - Super User](https://superuser.com/questions/748809/bash-smart-autocomplete-based-on-history)

> NOTE Another method but doesn't work for me

```bash
cat >> /etc/inputrc <<'EOF'
"\e[A": history-search-backward
"\e[B": history-search-forward
EOF
```

```shell
zsh: permission denied: /etc/inputrc
```

Refer To:

[What does autoload do in zsh? - Stack Overflow](https://stackoverflow.com/questions/30840651/what-does-autoload-do-in-zsh)

#### [Linux/Unix/MacOS] Calculate in Terminal

```shell
echo $((1024*1024))
```

#### [Linux/Unix/MacOS] Open A Project with IDEA in Terminal

Take MacOS For Example

```shell
# Community Editor
open -na 'IntelliJ IDEA CE.app' --args "$@"
open -na 'IntelliJ IDEA CE.app' --args "project-name"

# Ultimate Editor
open -na 'IntelliJ IDEA.app' --args "project-name"
```

NOTE

There is a big difference between these three.

There isn't a good way to open a application in full screen via Terminal.

Refer To:

[Command-line interface | IntelliJ IDEA Documentation](https://www.jetbrains.com/help/idea/working-with-the-ide-features-from-command-line.html)

[macos - Open an app in fullscreen via Terminal - Ask Different](https://apple.stackexchange.com/questions/58875/open-an-app-in-fullscreen-via-terminal)

#### [Linux/Unix/MacOS] Quick Remove Maven Repository

```shell
#!/bin/bash

# Check if an argument is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <package:artifact:version>"
    exit 1
fi

# Split the argument into package, artifact, and version
IFS=':' read -r parts <<< "$1"

# Validate the argument structure
if [ "${#parts[@]}" -ne 3 ]; then
    echo "Invalid argument format. Expected format: <package:artifact:version>"
    exit 1
fi

# Convert package and artifact to directory path
dir_path=$(echo "${parts[0]}/${parts[1]}" | tr '.' '/')

# Full path to the directory to be removed
full_path="${dir_path}/${parts[2]}"

# Check if the directory exists and remove it
if [ -d "$full_path" ]; then
    echo "Removing directory: $full_path"
    rm -rf "$full_path"
    echo "Directory removed successfully."
else
    echo "Directory does not exist: $full_path"
fi
```

#### [Linux/Unix/MacOS] Alias with Tab Completion

// TODO tab completion of directories

Refer To:

[shell - How to set tab for zsh autocompletion? - Stack Overflow](https://stackoverflow.com/questions/59094821/how-to-set-tab-for-zsh-autocompletion)

[ohmyzsh/plugins/arduino-cli/arduino-cli.plugin.zsh at 432596e9918dd0fea65af8c1788a54130a4fca6e · ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh/blob/432596e9918dd0fea65af8c1788a54130a4fca6e/plugins/arduino-cli/arduino-cli.plugin.zsh)

[bash - How do you make an alias or function that retains tab completion? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/224227/how-do-you-make-an-alias-or-function-that-retains-tab-completion)

> ```shell
> complete -F _complete_alias <alias_cmd>
> ```

#### [Linux/Unix/MacOS] Representations for Unprintable ASCII Control Characters

[Ascii control codes (control characters, C0 controls)](https://jkorpela.fi/chars/c0.html)

[command line - Why does ^C, ^V etc. appear in the terminal when I use the Ctrl+character keyboard shortcut? - Ask Ubuntu](https://askubuntu.com/questions/704600/why-does-c-v-etc-appear-in-the-terminal-when-i-use-the-ctrlcharacter-keyboa)

#### [Linux/Unix/MacOS] List All Profiles

```shell
ls -a ~ | grep -E '^\.(profile|bash_profile|bashrc|zprofile|zshrc)$'
.bash_profile
.bashrc
.profile
.zprofile
.zshrc
```

[Linux/Unix/MacOS] Case Insensitive Search in Vim

```shell
/<key_word>\c
```

`\c` : case insensitive

Refer To:

[How to do case insensitive search in Vim - Stack Overflow](https://stackoverflow.com/questions/2287440/how-to-do-case-insensitive-search-in-vim)

#### [Linux/Unix/MacOS] ls

```shell
ls -lh
ls -ld
ls -t
ls -tr
ls -S
ls -Sr
```

#### [Linux/Unix/MacOS] vi Show Line Number by Default

```shell
vi ~/.vimrc
set number
set nu
```

[vi - vim line numbers - how to have them on by default? - Stack Overflow](https://stackoverflow.com/questions/10274146/vim-line-numbers-how-to-have-them-on-by-default)

#### [Linux/Unix/MacOS] Batch Call URLs

Prerequisites

```shell
brew install jq
```

data file

```shell
["groupId", "artifactId", "version"]
["groupId", "artifactId", "version"]
["groupId", "artifactId", "version"]

```

```shell
#!/bin/zsh

# Path to the file
file='/pathto/file'
updater=$(whoami)

# Read the file line by line
while IFS= read -r line; do
  # Extract values using jq
  groupId=$(echo "$line" | jq -r '.[0]')
  artifactId=$(echo "$line" | jq -r '.[1]')
  version=$(echo "$line" | jq -r '.[2]')

  query=$(curl -s ...)
  if [ $? -ne 0 ]; then
    echo "Error: Failed to query for line: $line"
    continue
  fi
  o_updater=$(echo $query | jq -r '.data[0].updater')
  comment=$(echo $query | jq -r '.data[0].comment')
  xIOJakartaDependencyToReplace=$(echo $query | jq -r '.data[0].xIOJakartaDependencyToReplace')
  migratedByCRM=$(echo $query | jq -r '.data[0].migratedByCRM')

  if [ "$migratedByCRM" != "true" ]; then
    star=$(curl -s ...)

    if [ $? -ne 0 ]; then
      echo "Error: Failed to update migratedByCRM for line: $line"
    else
      echo "Add star: $groupId:$artifactId"
    fi
  fi

  comment="$comment\n$(echo $xIOJakartaDependencyToReplace | awk -F':' '{print $3}') migrated by $o_updater"

  update=$(curl -s ...")
    if [ $? -ne 0 -a $(echo $update | jq -r '.status') -gt 299 ]; then
      echo "Error: Failed to update version and comment for line: $line"
      echo $update
    fi
done < $file
```

#### [Linux/Unix/MacOS] How to Read Diff Output

```shell
diff file1 file2
diff -c file1 file2
```

[linux - Understanding of diff output - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/81998/understanding-of-diff-output)

#### [Linux/Unix/MacOS] Copy

```shell
cp -p 
```

#### [Linux/Unix/MacOS] Sed - Stream Editor

```shell
sed -i '.bak' -e 'script_line_1' -e 'script_line_2' -e 'script_line_3' input_file
```

Escape charater: `\`

```shell
# escaped special characters
&, *, [, ]
```

Examples

```shell
# get content on line 2
sed -n '2p' /pathto/file

# get content skips the first two lines, and removes the last line:
sed '1,2d;$d' /pathto/file

# add content on line 177
sed -i '' "177i \\
    new_content
" $file

# insert content above the last line
sed -i '' '$i\
Your content here' /pathto/file

# replace content on line 2.
sed -i '' -E '2s/[0-9]+/new_content/' /pathto/file
sed -i '' '2s/abc/def/' /pathto/file
```

Explanation:
- `-i ''`: This option is used for compatibility with macOS `sed` to edit the file in place.
- `$i\`: This command inserts text before the last line.
- `Your content here`: Replace this with the content you want to insert.

```shell
# replace with [groupId]:[artifactId]:[version]
echo "<groupId>:<artifactId>:<version>" | sed s/\</\[/g | sed s/\>/\]/g
echo "<groupId>:<artifactId>:<type>:<version>" | sed s/\</\[/g | sed s/\>/\]/g

# replace with <groupId>:<artifactId>:<version>
echo "[groupId]:[artifactId]:[version]" | sed 's/\[/</g' | sed 's/\]/>/g'
echo "[groupId]:[artifactId]:[type]:[version]" | sed 's/\[/</g' | sed 's/\]/>/g'

# TODO replace with path pattern com/xxx/eem/util/mio-util-starter/0.3.4-SNAPSHOT
echo "com.xxx.eem.util:mio-util-starter:jar:0.3.4-SNAPSHOT" | sed 's/\./\//g' | sed 's/:/\//g'
echo "com.xxx.bes:bes-api:0.4.1-jakarta" | sed 's/\./\//g' | sed 's/:/\//g'


```

Refer To:

[Fixing "sed: command i expects \ followed by text" error | KAY SINGH](https://singhkays.com/blog/sed-error-i-expects-followed-by-text/)

[regular expression - How to use sed to replace numbers with parenthese? - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/308636/how-to-use-sed-to-replace-numbers-with-parenthese)



Error on MAC

```shell
command ... expects \ followed by text
```

different in FSD and BSD

Refer To:

[How to fix the “sed command expects \” error on Mac OS](https://ben.lobaugh.net/blog/205337/how-to-fix-the-sed-command-expects-error-on-mac-os)

#### [Linux/Unix/MacOS] Trace Route

[How to Run a traceroute on Windows, Mac, or Linux](https://www.greengeeks.com/support/article/how-to-run-a-traceroute-on-windows-mac-or-linux/)

#### [Linux/Unix/MacOS] Reuse `printf` Variables

[Bash: Reuse printf variables in output - Stack Overflow](https://stackoverflow.com/questions/67249603/bash-reuse-printf-variables-in-output)

> in zsh, use `%1$s`, `%2$s`

#### [Linux/Unix/MacOS] grep hidden file

```shell
grep -ri 'keywords' .
```

[How to grep Hidden Files and Directories | Baeldung on Linux](https://www.baeldung.com/linux/grep-hidden-files-directories)

#### [Linux/Unix/MacOS] grep -v multiple keywords

To use `grep` to exclude multiple keywords from your search, you can combine the `-v` option (to exclude matches) with regular expressions. Here’s how you can do it:

Example:

```bash
grep -v -e "keyword1" -e "keyword2" -e "keyword3" file.txt
```

#### Explanation:
- `-v` tells `grep` to **invert** the match (exclude lines containing the pattern).
- `-e` allows you to specify multiple patterns (in this case, multiple keywords).
- `file.txt` is the file you want to search through.

This will exclude any lines that contain `keyword1`, `keyword2`, or `keyword3`.

Alternatively, if you prefer to use regular expressions in a single `-e` option, you can separate the keywords using the `|` (OR) operator:

```bash
grep -v -E "keyword1|keyword2|keyword3" file.txt
```

Here:

- `-E` allows for extended regular expressions, which is needed for the `|` operator to work.

#### [Linux/Unix/MacOS] remove the lastest 3 files

```shell
ls -t | head -n 3 | xargs rm
```

#### [Linux/Unix/MacOS] encrypt and decrypt

```shell
gpg -c filename
gpg filename.gpg
```

```shell
openssl enc -aes-256-cbc -salt -in filename -out filename.enc
openssl enc -d -aes-256-cbc -in filename.enc -out filename
```

#### [Linux/Unix/MacOS] generate a Linux script

```shell
cat << 'EOF' > command.sh
#!/bin/bash
set -e
var=$1
echo "variable is $var"
# do something
EOF
chmod +x command.sh
```

#### [Linux/Unix/MacOS] test 80/443 port

```shell
telnet [host] [port]
telnet localhost 80
telnet localhost 443
curl -vvv http://localhost
curl -vvv https://localhost
```

#### [Linux/Unix/MacOS] Proxy Environment Variables

This is more a convention than a standard.

Environment Variables
curl reads and understands the following proxy related environment variables:

```shell
http_proxy, HTTPS_PROXY, FTP_PROXY
```

They should be set for protocol-specific proxies. General proxy should be set with

```shell
ALL_PROXY
```

A comma-separated list of hostnames that should not go through any proxy is set in (only an asterisk, * matches all hosts)

```shell
NO_PROXY
```

If the hostname matches one of these strings, or the host is within the domain of one of these strings, transactions with that node is not done over the proxy. When a domain is used, it needs to start with a period. A user can specify that both www.example.com and foo.example.com should not use a proxy by setting NO_PROXY to .example.com. By including the full name you can exclude specific hostnames, so to make www.example.com not use a proxy but still have foo.example.com do it, set NO_PROXY to www.example.com.

The usage of the -x/--proxy flag overrides the environment variables.

Refer To

[curl - Tutorial](https://curl.se/docs/tutorial.html) 

[http - Are HTTP_PROXY, HTTPS_PROXY and NO_PROXY environment variables standard? - Super User](https://superuser.com/questions/944958/are-http-proxy-https-proxy-and-no-proxy-environment-variables-standard) 

#### [Linux/Unix/MacOS] lazygit

GitHub: https://github.com/jesseduffield/lazygit

```shell
brew install lazygit

# run inside a git repository
lazygit
# Cmd + C to exit
```

Get Started 

╭─[1]─Status──────────────╮╭─[0]─Diff──────────────────────────────────────────╮
│✓ <project> → <branch>   ││No changed files                                   │
╰╭─────────────────────────────────────────────────────────────────────────────╮
╭│Thanks for using lazygit! Seriously you rock. Three things to share with you:│
││                                                                             │
││ 1) If you want to learn about lazygit's features, watch this vid:           │
││      https://youtu.be/CPLdltN7wgE                                           │
││                                                                             │
││ 2) Be sure to read the latest release notes at:                             │
││      https://github.com/jesseduffield/lazygit/releases                      │
││                                                                             │
││ 3) If you're using git, that makes you a programmer! With your help we can  │
││make                                                                         │
╰│    lazygit better, so consider becoming a contributor and joining the fun at│
╭│      https://github.com/jesseduffield/lazygit                               │
││    You can also sponsor me and tell me what to work on by clicking the      │
╰│donate                                                                       │
╭│    button at the bottom right.                                              │
││    Or even just star the repo to share the love!                            │
╰│                                                                             │
╭│Press <enter> to get started.                                                │
│╰─────────────────────────────────────────────────────────────────────────────╯
╰──────────────────1 of 2─╯╰───────────────────────────────────────────────────╯
Confirm: <enter> | Close/Cancel: <esc> | …            Donate Ask Question 0.54.2


#### [Linux/Unix/MacOS] neovim

Official site: https://neovim.io/

```shell
brew install neovim
```



#### [Vi/Vim] Comment or Uncomment Multiple Lines

```shell
# comment
:174,189s/^/#/
# uncomment
:174,189s/^#//
```

Refer To:

[Commenting out multiple lines of code, specified by line numbers, using vi or vim - Unix & Linux Stack Exchange](https://unix.stackexchange.com/questions/84929/commenting-out-multiple-lines-of-code-specified-by-line-numbers-using-vi-or-vi)

[vim does not find and replace simple phrase that is clearly present - Stack Overflow](https://stackoverflow.com/questions/5289262/vim-does-not-find-and-replace-simple-phrase-that-is-clearly-present)

#### [Vi/Vim] Move Current Lines

| Key     | Description                      |
|---------|----------------------------------|
| V       | Select Multiple Lines            |
| :set nu | Show Line Numbers                |
| :m +1   | Move Line Up 1 Line(s)           |
| :m -2   | Move Line Donw 2 Line(s)         |
| :m 3    | Move below Line 3, Become Line 4 |

[vi - Move entire line up and down in Vim - Stack Overflow](https://stackoverflow.com/questions/741814/move-entire-line-up-and-down-in-vim)


#### [] Task Status

TODO

IN-PROGRESS

BLOCKED

DONE

Refer To:

[Using task statuses – Help with Flow](https://www.flow.help/hc/en-us/articles/1500003628282-Using-task-statuses)

[Set and update task progress - Microsoft Support](https://support.microsoft.com/en-us/office/set-and-update-task-progress-3877e3f3-4650-4714-aabf-79702ab25ec1)

[Example Statuses - Tasks User Guide - Obsidian Publish](https://publish.obsidian.md/tasks/Getting+Started/Statuses/Example+Statuses)

[Add status labels for the issues: Todo, In progress, Review and Done · Issue #882 · WordPress/Documentation-Issue-Tracker · GitHub](https://github.com/WordPress/Documentation-Issue-Tracker/issues/882)

#### [Tools] API Platform

Postman

Insomnia

Apifox

Apipost

#### [VSCode] VSCode Installation

[Download from official site](https://vscode.download.prss.microsoft.com/dbazure/download/stable/c306e94f98122556ca081f527b466015e1bc37b0/VSCode-darwin-universal.zip
) 

[Install Cline, link your GitHub account](https://cline.bot/) 

[Install IntelliJ IDEA Keymap](https://marketplace.visualstudio.com/items?itemName=k--kato.intellij-idea-keybindings) 

#### [VSCode] Workspaces: Duplicate As Workspace in New Window 

<kdb> Cmd + Shift + P </kbd> | Workspaces: Duplicate As Workspace in New Window

How to bind a key? 

Keyboard Shortcuts | @command:workbench.action.duplicateWorkspaceInNewWindow +when:enterMultiRootWorkspaceSupport

Refer To: 

[Is there a way to open multiple Windows for the same Working directory. VS Code - Stack Overflow](https://stackoverflow.com/questions/73055236/is-there-a-way-to-open-multiple-windows-for-the-same-working-directory-vs-code) 

#### [VSCode] Menu Font Size

[The font size of menu bar. · Issue #152285 · microsoft/vscode](https://github.com/microsoft/vscode/issues/152285) 

> zoom level: 1.2

#### [Insomnia] Insomnia vs. Postman

| Insomnia           | Postman                   | Description                       | Reference                                                    |
| ------------------ | ------------------------- | --------------------------------- | ------------------------------------------------------------ |
| {% faker 'guid' %} | {{$guid}}/{{$randomUUID}} | Generate a fake UID for a request | [Should be able to generate Guid using {{guid}} · Kong/insomnia · Discussion #7394](https://github.com/Kong/insomnia/discussions/7394) |
|                    |                           |                                   |                                                              |
|                    |                           |                                   |                                                              |
|                    |                           |                                   |                                                              |
|                    |                           |                                   |                                                              |

#### [Google Search] Traditional Chinese Medicine

```shell
site:hopto.org OR site:hkbu.edu.hk OR site:cloudtcm.com
```

#### [Chrome] Adobe Flash Player is no longer supported

Install [Flash Player for Web - Chrome Web Store](https://chromewebstore.google.com/detail/lkhhagecaghfakddbncibijbjmgfhfdm)

Test in [Flash Player Test](https://www.ultrasounds.com/)

[Chrome Hotkey] Switch Profile

<kbd> Ctrl + Shift + M</kbd> 

<kbd> Cmd + Shift + M</kbd> 

Refer To:
[Chrome keyboard shortcuts - Computer - Google Chrome Help](https://support.google.com/chrome/answer/157179#zippy=%2Ctab-window-shortcuts%2Cgoogle-chrome-feature-shortcuts%2Caddress-bar-shortcuts%2Cmouse-shortcuts%2Cwebpage-shortcuts)

#### [Chrome] Filling Passwords without System Authentication

Settings | Autofill and passwords | Google Password Manager | Settings

or chrome://password-manager/settings

- [ ] User your screen lock when filling passwords

NOTE Make sure to uncheck this option for each profile if there're multiple profiles

#### [Chrome] Show Toolbar in Full Screen

Chrome | View | Always Show Toolbar in Full Screen

#### [Chrome] 301 Moved Permanently (from disk cache)

When you see
`301 Moved Permanently (from disk cache)`
in Chrome DevTools → **Network tab**, it means Chrome didn’t actually go out to the server. Instead, it served the cached redirect response straight from the local **disk cache**.

##### 📂 Where is the cache saved?

It depends on your OS, Chrome stores cached data in its **profile directory**:

* **Windows**

  ```
  C:\Users\<YourName>\AppData\Local\Google\Chrome\User Data\Default\Cache
  ```
* **macOS**

  ```
  ~/Library/Caches/Google/Chrome/Default/Cache
  ```
* **Linux**

  ```
  ~/.cache/google-chrome/Default/Cache
  ```

(`Default` = your default Chrome profile. If you use multiple profiles, the folder name will differ, e.g., `Profile 1`.)

---

##### 🧹 How to clear it

You don’t usually need to manually delete files. Instead:

1. **Clear cache via Chrome UI**

   * `⋮` menu → **Settings** → **Privacy and Security** → **Clear browsing data**
   * Choose **Cached images and files** → Clear.

2. **DevTools hard refresh**

   * Open DevTools (F12).
   * Right-click the **Reload button** → choose **Empty Cache and Hard Reload**.

3. **Command line (force disable cache)**

   * Start Chrome with

     ```
     chrome --disable-cache
     ```

     (useful for debugging).

4. **Manually delete cache files**

   * Close Chrome completely.
   * Delete the `Cache` folder from the paths above.
   * Restart Chrome.

---

👉 Note: A `301` redirect is **permanently cached** by design (per HTTP spec). Even after clearing disk cache, Chrome may remember it in the **HSTS / permanent redirect cache**.
If clearing the normal cache doesn’t fix it, you can flush that at:

* Go to `chrome://net-internals/#dns` → Click **Clear host cache**.
* Go to `chrome://net-internals/#hsts` → delete specific domains.

---

Do you want me to show you **how to clear just one domain’s 301 redirect** (instead of wiping all cache)?



#### [Excel] Identify Duplicates Between Two Columns

```excel
=countif(B:B,A2)
```

[Identify duplicates between two columns in Google Sheets - Google Docs Editors Community](https://support.google.com/docs/thread/152011014/identify-duplicates-between-two-columns-in-google-sheets?hl=en)

#### [pnpm]

##### Ant Design Components
[Components Overview - Ant Design](https://ant.design/components/overview/)


```shell
# check if commands exist
node -v
npm -v
npx -v
# install vite
npx vite --help
# press y + enter to install
# compile and run
npm install
npm run prebuild
npm run build:dev
npm start
```


```shell
# check if commands exist
node -v
npm -v
npx -v

# compile and run
npx pnpm@8.15.1 install
npx pnpm@8.15.1 start

# remove ./node_modules to uninstall all
rm -rf ./node_modules
```

```shell
# check if commands exist
# node 22.12.0
node -v
# pnpm@8.15.1
pnpm -v 

# install dependencies
pnpm install

# compile and run
pnpm start
```


nvm npm version management

```shell
brew install pnpm@8
```

```shell
==> Caveats
pnpm@8 requires a Node installation to function. You can install one with:
  brew install node

pnpm@8 is keg-only, which means it was not symlinked into /opt/homebrew,
because this is an alternate version of another formula.

If you need to have pnpm@8 first in your PATH, run:
  echo 'export PATH="/opt/homebrew/opt/pnpm@8/bin:$PATH"' >> ~/.zshrc

zsh completions have been installed to:
  /opt/homebrew/opt/pnpm@8/share/zsh/site-functions
==> Summary
🍺  /opt/homebrew/Cellar/pnpm@8/8.15.9: 735 files, 13.6MB
==> Running `brew cleanup pnpm@8`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
```






#### [Mac] Mac shortcut

<kbd> Cmd + Shift + . </kbd> Show Hidden Items in Finder

<kbd> Cmd + Shift + 3 </kbd> ScreenShot Full Screen

<kbd> Cmd + Shift + 4 </kbd> Capture a Portion

<kbd> Cmd + Shift + 4 + Space </kbd> Capture a Window

<kbd> Cmd + Shift + 5 </kbd> Capture an Area

<kbd> Cmd + Ctrl + F </kbd> Enter Full Screen

<kbd> Cmd + \` </kbd>  and <kbd> Cmd + Shift +` </kbd> Switch Windows in The Same APP



[Mac keyboard shortcuts - Apple Support](https://support.apple.com/en-us/102650)

[Mac tips for Windows switchers - Apple Support](https://support.apple.com/en-us/102323)

[Mac keyboard shortcuts - Apple Support](https://support.apple.com/en-us/102650)

[Intro to Shortcuts on Mac - Apple Support](https://support.apple.com/guide/shortcuts-mac/intro-to-shortcuts-apdf22b0444c/mac)

[Use macOS keyboard shortcuts - Apple Support](https://support.apple.com/guide/mac-help/keyboard-shortcuts-mchlp2262/mac)

[Shortcut for toggling between different windows of same app?](https://apple.stackexchange.com/questions/193937/shortcut-for-toggling-between-different-windows-of-same-app)

#### [Mac] Go to Folder

Go > Go to Folder

<kbd> Cmd + Shift + G </kbd>

[Go directly to a specific folder on Mac - Apple Support](https://support.apple.com/en-us/guide/mac-help/mchlp1236/mac)

#### [Mac] Open Terminal from the Finder

Control-click

<kbd> Cmd + T </kbd> Open a new tab with same directory

Refer To:

[Open new Terminal windows and tabs on Mac - Apple Support (SG)](https://support.apple.com/en-sg/guide/terminal/trmlb20c7888/mac)

#### [Mac] Default Application to Open With

[Choose an app to open a file on Mac - Apple Support (SG)](https://support.apple.com/en-sg/guide/mac-help/mh35597/mac)

#### [Mac] IDEA Open A New Project in A New Window instead of A New Tab

System Settings... | Desktop & Dock | Windows | Prefer tabs when opening documents: Never

[macos - IntellijIDEA: how to open a project in a tab instead of a new window from OSX cli? - Stack Overflow](https://stackoverflow.com/questions/71488953/intellijidea-how-to-open-a-project-in-a-tab-instead-of-a-new-window-from-osx-cl)

#### [Mac] Select with Trackpad

[Trackpad selecting without clicking - Apple Community](https://discussions.apple.com/thread/4643313?sortBy=best)

> Double click and hold, and then drag

[macos - How to select text with touchpad without pressing the "hard" key? - Ask Different](https://apple.stackexchange.com/questions/151683/how-to-select-text-with-touchpad-without-pressing-the-hard-key)

#### [Mac] Select with Three Fingers

#### [Mac] Lock The Desktop Order

System Settings... | Desktop & Dock | Mission Control

- [ ] Automatically rearrange Spaces based on most recent use

[How lock destop screens in the order I wa… - Apple Community](https://discussions.apple.com/thread/5669041?sortBy=best)

#### [Mac] Rearrange Icons

<kbd>CMD + Drag</kbd>

#### [Mac] Always Show The Menu Bar In Full Screen

System Settings | Control Center | Automatically hide and show the menu bar: Never

#### [Mac] Open a New Terminal Window

```shell
# case insensitive, and both 'terminal' and 'terminal.app' are the same
open -a Terminal foo/folder
```

Open and Run A Command

```shell
osascript -e 'tell application "Terminal" to do script "cd /path/to/your/folder && your_command_here"'
```

#### [Mac] Effective on macOS

Install [Homebrew](https://brew.sh)

Install [Raycast](https://www.raycast.com/), [old versions](https://www.raycast.com/download/unsupported)

Install [Oh My Zsh](https://ohmyz.sh/)

> including showing git branch in Terminial
>
> ```shell
> plugins=(git mvn)
> # colorize
> ```

[Git plugin: "gl" should be short for "git log", not "git push" · Issue #9438 · ohmyzsh/ohmyzsh](https://github.com/ohmyzsh/ohmyzsh/issues/9438)

```shell
brew install trash
brew install mvnvm
brew install pyenv
brew install jq
# brew install pygments # for colourize
```

Refer To:

[Move to Trash CLI on macOS](https://ansidev.xyz/posts/2021-04-30-move-to-trash-cli-on-macos)

Install [Typora](https://zahui.fan/posts/64b52e0d/), not run well

[0.9.9.32.1 beta](https://download.typora.io/mac/Typora-0.9.9.32.1.dmg), [0.9.9.26.7 beta](https://download.typora.io/mac/Typora-0.9.9.26.7.dmg) from [Older macOS Support - Typora Support](https://support.typora.io/Older-macOS-Support/), without search showly issue

[Typora Support](https://support.typora.io/)

#### [Mac] Multiple Version of Python -- pyenv

```shell
brew install pyenv
pyenv install 3.7.17
pyenv --version
pyenv versions
# install in ~/.pyenv/versions/

# [Not Recommended] only use 3.8 or later
brew install python
brew install python@3.8

python3.8 -m venv /pathto/python3.8
/pathto/python3.8/bin/pip install numpy --trusted-host pypi.org --trusted-host files.pythonhosted.org
/pathto/python3.8/bin/pip install networkx==2.3  --trusted-host pypi.org --trusted-host files.pythonhosted.org 


brew uninstall pyenv
rm -rf ~/.pyenv
```

Refer To:

[Python Release Python 3.7.0 | Python.org](https://www.python.org/downloads/release/python-370/)

#### [Mac] Unexpected output of 'arch' on OSX

```shell
pyenv install 3.7.3      
python-build: use openssl from homebrew
python-build: use readline from homebrew
Downloading Python-3.7.3.tar.xz...
-> https://www.python.org/ftp/python/3.7.3/Python-3.7.3.tar.xz
Installing Python-3.7.3...
python-build: use tcl-tk from homebrew
python-build: use readline from homebrew
python-build: use zlib from xcode sdk

BUILD FAILED (OS X 14.6.1 using python-build 20180424)

Inspect or clean up the working tree at /var/folders/sr/2mr1184n4ybgbv5c37v75zv80000gp/T/python-build.20240915143949.69957
Results logged to /var/folders/sr/2mr1184n4ybgbv5c37v75zv80000gp/T/python-build.20240915143949.69957.log

Last 10 log lines:
checking size of _Bool... 1
checking size of off_t... 8
checking whether to enable large file support... no
checking size of time_t... 8
checking for pthread_t... yes
checking size of pthread_t... 8
checking size of pthread_key_t... 8
checking whether pthread_key_t is compatible with int... no
configure: error: Unexpected output of 'arch' on OSX
make: *** No targets specified and no makefile found.  Stop.
```

Doesn't work for me

Refer To:

[Python 3.6-3.8 cannot be installed on Mac OS 11.0.1: "implicit declaration of function 'sendfile' is invalid in C99" · Issue #1737 · pyenv/pyenv](https://github.com/pyenv/pyenv/issues/1737)

[Cannot Install Python Versions on macOS Monterey 12.2.1: "error: Unexpected output of 'arch' on OSX" · Issue #2271 · pyenv/pyenv](https://github.com/pyenv/pyenv/issues/2271)

[failed to install python versions using pyenv on macos - Stack Overflow](https://stackoverflow.com/questions/66927933/failed-to-install-python-versions-using-pyenv-on-macos)

#### [Mac] Shortcuts Conflicts

System Settings | Keyboard | Keyboard Shortcuts... | Services | Text

- [ ] Search man Page Index in Terminal

#### [Mac] Default Application for All Files Associated

[Changing the default application for all … - Apple Community](https://discussions.apple.com/thread/7185188?sortBy=rank)

#### [Mac] Unknown locale, assuming C

```shell
man ls
Unknown locale, assuming C
```

Terminal | Settings | Profiles | Advanced

- [ ] Set locale environment variables on startup

Refer To:

[command line - Unknown locale, assuming C - Error message in terminal - Ask Different](https://apple.stackexchange.com/questions/451014/unknown-locale-assuming-c-error-message-in-terminal)

#### [Mac] stat in MAC

```shell
stat -x file
```

#### [Mac] Proformance Monitor

```shell
# find the pid of a specify process
pgrep process_name
ps -ax | grep -i process_name
# 
top -pid <pid>

top -o MEM
```

Refer To:

[‘TOP’: A Powerful Command for your macOS Terminal | by ofer shmueli | Mac O’Clock | Medium](https://medium.com/macoclock/top-a-powerful-command-for-your-macos-terminal-d284fe3a16b)

[Filtering top command output](https://superuser.com/questions/281347/filtering-top-command-output)

[How can I find a specific process with "top" in a Mac terminal](https://stackoverflow.com/questions/7501057/how-can-i-find-a-specific-process-with-top-in-a-mac-terminal)

[How to display `top` results sorted by memory usage in real time?](https://unix.stackexchange.com/questions/128953/how-to-display-top-results-sorted-by-memory-usage-in-real-time)

#### [Mac] Open new Terminal Windows and Run Commands

```shell
cd /pathto/rootDir
for dir in */ ; do
    if [ -d "$dir" ]; then
        osascript -e "tell application \"Terminal\" to do script \"cd /pathto/rootDir$dir && mvncist\""
    fi
done
```

#### [Mac] JAVA_HOME

https://yanbin.blog/macos-how-to-locatate-java_home/

#### [Mac] Schedule Task

To schedule a task on macOS that runs every 30 minutes and executes the `pmset displaysleepnow` command, you can use `launchd`, which is the macOS system and service manager. You'll create a `plist` (property list) file to define the schedule and command.

##### Steps:

1. **Create the `plist` file**: First, you need to create a property list file for your scheduled task. This file will define the schedule and the command to execute.

   Open a terminal and create a new file in the `~/Library/LaunchAgents/` directory (this directory is for user-specific tasks):

   ```bash
   nano ~/Library/LaunchAgents/me.user.displaySleep.plist
   ```

2. **Add the following content** to the `plist` file: This file will tell `launchd` to run the `pmset displaysleepnow` command every 30 minutes.

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
     <dict>
       <key>Label</key>
       <string>me.user.displaySleep</string>
   
       <key>ProgramArguments</key>
       <array>
         <string>/usr/bin/pmset</string>
         <string>displaysleepnow</string>
       </array>
   
       <key>StartInterval</key>
       <integer>1800</integer> <!-- 1800 seconds = 30 minutes -->
   
       <key>RunAtLoad</key>
       <true/>
     </dict>
   </plist>
   ```

   - `Label`: This is the name of your task.
   - `ProgramArguments`: This defines the command you want to run (in this case, `pmset displaysleepnow`).
   - `StartInterval`: This specifies how often to run the task in seconds (1800 seconds = 30 minutes).
   - `RunAtLoad`: If set to ``, it runs the task immediately after the computer starts.

3. **Save the file** and exit the editor: In `nano`, you can save and exit by pressing `CTRL + O`, `ENTER`, and then `CTRL + X`.

4. **Load the plist file into `launchd`**: To load your task so it starts running, use the following command:

   ```bash
   launchctl load ~/Library/LaunchAgents/me.user.displaySleep.plist
   ```

5. **Verify that the task is running**: You can verify if your task is scheduled and running by listing all loaded launch agents:

   ```bash
   launchctl list | grep me.user.displaySleep
   
   # PID STATUS LABEL
   ```

6. **Unload the plist file (if you want to stop it later)**: If you need to stop the task, you can unload the `plist`:

   ```bash
   launchctl unload ~/Library/LaunchAgents/me.user.displaySleep.plist
   ```

##### Notes:

- If you ever need to make changes to the plist, you'll need to unload it first (`launchctl unload`), edit the file, and then load it again (`launchctl load`).
- The `pmset displaysleepnow` command forces the display to go to sleep immediately, but it will not affect other power management settings (like system sleep).



The error message `Unload failed: 5: Input/output error` when trying to unload a `launchd` job (`launchctl unload`) can be a bit tricky to resolve, but it’s typically related to permissions or issues with how the job is loaded. Let's break it down and find a solution.

##### Possible Causes & Solutions

###### 1. **Permission Issues** (Root Access Required)

If you're trying to unload a `launchd` job that was loaded by a different user (or one that requires administrative privileges), you might need to run the command as `sudo`. This can happen when a job was loaded with higher privileges or in a system directory like `/Library/LaunchDaemons/` (as opposed to `~/Library/LaunchAgents/` for user-specific tasks).

To attempt to unload it with elevated privileges, use `sudo`:

```bash
sudo launchctl bootout system /Library/LaunchDaemons/com.user.displaySleep.plist
```

Or, for a user-specific job:

```bash
sudo launchctl bootout user/$(id -u) ~/Library/LaunchAgents/com.user.displaySleep.plist
```

Note:

- `bootout` is generally used to stop jobs that were started by `launchd`, particularly for system-wide jobs.
- `launchctl bootout` can replace `launchctl unload` on newer macOS versions (from macOS 11 onwards), where `bootout` is the newer approach for unloading system and user jobs.

###### 2. **Ensure the Job is Not Running**

You might be getting the error because the job is still actively running, and `launchctl` can't unload it while it's executing. To check if the job is still active, list all `launchd` jobs:

```bash
launchctl list | grep com.user.displaySleep
```

If you see it listed, you'll need to stop it before unloading. You can stop the job using:

```bash
sudo launchctl bootout system /Library/LaunchDaemons/com.user.displaySleep.plist
```

For a user-specific job:

```bash
sudo launchctl bootout user/$(id -u) ~/Library/LaunchAgents/com.user.displaySleep.plist
```

###### 3. **Clear Corrupted or Stuck Jobs**

Sometimes `launchd` jobs might get stuck or corrupt, especially if there are system-related errors. You can try clearing the job and unloading it using the following steps:

1. **Kill the process** related to the job manually:

   You can find the process associated with the job and kill it:

   ```bash
   ps aux | grep com.user.displaySleep
   ```

   Then, use `kill` to terminate the process (use the process ID from the output):

   ```bash
   sudo kill -9 <PID>
   ```

2. **Unload the job** after ensuring no processes are running:

   ```bash
   sudo launchctl bootout system /Library/LaunchDaemons/com.user.displaySleep.plist
   ```

###### 4. **Reboot the System**

If none of the above works, try rebooting your system. Rebooting can often clear issues with `launchd` and system services. After the reboot, try unloading the job again:

```bash
sudo launchctl bootout system /Library/LaunchDaemons/com.user.displaySleep.plist
```

###### 5. **Check for `launchd` Issues on macOS**

Since you're receiving the "Input/output error" message, there could be a deeper issue with `launchd`. This can sometimes happen if there’s a corruption in the system configuration files. Check the system logs for any additional information:

```bash
log show --predicate 'eventMessage contains "launchd"' --last 1h
```

This might give you more details on why the job is failing to unload.

###### 6. **Manual Deletion of the plist**

If all else fails, you can manually remove the `plist` file and its associated job. To do this:

1. **Delete the `plist` file**:

   For user jobs (in `~/Library/LaunchAgents/`):

   ```bash
   rm ~/Library/LaunchAgents/com.user.displaySleep.plist
   ```

   For system jobs (in `/Library/LaunchDaemons/`):

   ```bash
   sudo rm /Library/LaunchDaemons/com.user.displaySleep.plist
   ```

2. After deletion, you might want to run:

   ```bash
   sudo launchctl bootout system /Library/LaunchDaemons/com.user.displaySleep.plist
   ```

   Or for user jobs:

   ```bash
   sudo launchctl bootout user/$(id -u) ~/Library/LaunchAgents/com.user.displaySleep.plist
   ```

   **Note**: Deleting the `plist` file will remove the job permanently, but it's still a good idea to check if the job is actively running before deleting the file.

------

##### Conclusion

In summary:

- You may need `sudo` privileges to unload the job depending on its location (system vs. user job).
- Use `launchctl bootout` for macOS 11+ as it replaces `launchctl unload`.
- Kill any related processes before unloading the job.
- If you still get errors, you may want to delete the `plist` file manually.

If the problem persists after trying the above steps, a system reboot might resolve it, or you may need to dig deeper into system logs to see what might be causing the issue.



```shell
vi ~/Library/LaunchAgents/me.user.displaySleep.plist
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>me.user.displaySleep</string>

    <key>ProgramArguments</key>
    <array>
      <string>/usr/bin/pmset</string>
      <string>displaysleepnow</string>
    </array>

    <key>StartInterval</key>
    <integer>1800</integer> <!-- 1800 seconds = 30 minutes -->

    <key>RunAtLoad</key>
    <true/>
  </dict>
</plist>
```

```shell
:x
launchctl load ~/Library/LaunchAgents/me.user.displaySleep.plist
launchctl list | grep me.user.displaySleep
ps aux | grep me.user.displaySleep
launchctl stop me.user.displaySleep
launchctl unload ~/Library/LaunchAgents/me.user.displaySleep.plist
rm ~/Library/LaunchAgents/me.user.displaySleep.plist
```



Refer To:

[How to use launchctl remove? - Targets / macOS - Xojo Programming Forum](https://forum.xojo.com/t/how-to-use-launchctl-remove/48635/6)

```shell
# doesn't work
echo "/usr/bin/pmset displaysleepnow | at now + 1 minutes
# query
atq
# remove
atrm 1 2 3
```

#### [Slack] Sync Slack Status with Outlook Calendar

[Automations: Sync your status with your calendar | Slack](https://slack.com/intl/en-sg/help/articles/4412365549075-Automations--Sync-your-status-with-your-calendar)

[Microsoft Outlook Calendar for Slack | Slack](https://slack.com/intl/en-sg/help/articles/360020134853-Microsoft-Outlook-Calendar-for-Slack)

[Set your out of office status on Enterprise Grid | Slack](https://slack.com/help/articles/20584016893843-Set-your-out-of-office-status-on-Enterprise-Grid#sync-with-calendar-apps)

[Add your out of office event to the Outlook calendar of others - Microsoft Support](https://support.microsoft.com/en-us/office/add-your-out-of-office-event-to-the-outlook-calendar-of-others-69fe38aa-7b5f-4225-8b69-47f47092e65e)

#### [Event] Google and UniSpace

[“Unprecedented” Google Cloud event wipes out customer account and its backups | Ars Technica](https://arstechnica.com/gadgets/2024/05/google-cloud-accidentally-nukes-customer-account-causes-two-weeks-of-downtime/)

[ARTICLE] Google Cloud explains how it accidentally deleted a customer account

https://arstechnica.com/gadgets/2024/05/google-cloud-explains-how-it-accidentally-deleted-a-customer-account/

https://cloud.google.com/blog/products/infrastructure/details-of-google-cloud-gcve-incident

Rami

**Google Cloud explains how it accidentally deleted a customer account**

**UniSuper's 647,000 users faced two weeks of downtime because of a Google Cloud bug.**

**[Ron Amadeo](https://arstechnica.com/author/ronamadeo/) - 5/30/2024, 10:10 AM**

##### *Flubbing the input —*

Earlier this month, Google Cloud experienced one of its [biggest blunders ever](https://arstechnica.com/gadgets/2024/05/google-cloud-accidentally-nukes-customer-account-causes-two-weeks-of-downtime/) when UniSuper, a $135 billion Australian pension fund, had its Google Cloud account wiped out due to some kind of mistake on Google's end. At the time, UniSuper indicated it had lost everything it had stored with Google, even its backups, and that caused two weeks of downtime for its 647,000 members. There were [joint statements](https://www.unisuper.com.au/about-us/media-centre/2024/a-joint-statement-from-unisuper-and-google-cloud) from the Google Cloud CEO and UniSuper CEO on the matter, a lot of apologies, and presumably a lot of worried customers who wondered if their retirement fund had disappeared.

In the immediate aftermath, the explanation we got was that "the disruption arose from an unprecedented sequence of events whereby an inadvertent misconfiguration during provisioning of UniSuper’s Private Cloud services ultimately resulted in the deletion of UniSuper’s Private Cloud subscription." Two weeks later, GoogleCloud's internal review of the problem is finished, and the company has [a blog post up](https://cloud.google.com/blog/products/infrastructure/details-of-google-cloud-gcve-incident) detailing what happened.

Google has a "TL;DR" at the top of the post, and it sounds like a Google employee got an input wrong.

> During the initial deployment of a Google Cloud VMware Engine (GCVE) Private Cloud for the customer using an internal tool, there was an inadvertent misconfiguration of the GCVE service by Google operators due to leaving a parameter blank. This had the unintended and then unknown consequence of defaulting the customer’s GCVE Private Cloud to a fixed term, with automatic deletion at the end of that period. The incident trigger and the downstream system behavior have both been corrected to ensure that this cannot happen again.

The most shocking thing about Google's blunder was the sudden and irreversible deletion of a customer account. Shouldn't there be protections, notifications, and confirmations in place to never accidentally delete something? Google says there are, but those warnings are for a "customer-initiated deletion" and didn't work when using the admin tool. Google says, "No customer notification was sent because the deletion was triggered as a result of a parameter being left blank by Google operators using the internal tool, and not due to a customer deletion request. Any customer-initiated deletion would have been preceded by a notification to the customer."

During its many downtime updates, UniSuper indicated it did not have access to Google Cloud backups and had to dig into a third-party (presumably less up-to-date) store to get back up and running. In the frenzy of the recovery period, UniSuper said that "UniSuper had duplication in two geographies as a protection against outages and loss. However, when the deletion of UniSuper’s Private Cloud subscription occurred, it caused deletion across both of these geographies... UniSuper had backups in place with an additional service provider. These backups have minimized data loss, and significantly improved the ability of UniSuper and Google Cloud to complete the restoration."

In its post-mortem, Google now says, "Data backups that were stored in Google Cloud Storage in the same region were not impacted by the deletion, and, along with third-party backup software, were instrumental in aiding the rapid restoration." It's hard to square these two statements, especially with the two-week recovery period. The goal of a backup is to be quickly restored; so either UniSuper's backups didn't get deleted and weren't effective, leading to two weeks of downtime, or they would have been effective had they not been partially or completely wiped out.

Google stressed many times in the post that this issue affected a single customer, has never happened before, should never happen again, and is not a systemic problem with Google Cloud. Here's the entire "remediation" section of the blog post:

> Google Cloud has since taken several actions to ensure that this incident does not and can not occur again, including:
>
> 1. We deprecated the internal tool that triggered this sequence of events. This aspect is now fully automated and controlled by customers via the user interface, even when specific capacity management is required.
> 2. We scrubbed the system database and manually reviewed all GCVE Private Clouds to ensure that no other GCVE deployments are at risk.
> 3. We corrected the system behavior that sets GCVE Private Clouds for deletion for such deployment workflows.

Google says Cloud still has "safeguards in place with a combination of soft delete, advance notification, and human-in-the-loop, as appropriate," and it confirmed these safeguards all still work.

Ron Amadeo Ron is the Reviews Editor at Ars Technica, where he specializes in Android OS and Googleproducts. He is always on the hunt for a new gadget and loves to rip things apart to see how they work. He loves to tinker and always seems to be working on a new project.

#### [Template] V2MOM

```
# Essential Engineering

2025 V2MOM

## Problem Statement

## Vision

*What's Essential Engineering in one sentence.*

## Values

*What's values*

### Ways of Working

### Collaboration is key to our success

## RASCI

|               | R    | A    | S    | C    | I    |
| ------------- | ---- | ---- | ---- | ---- | ---- |
|               |      |      |      |      |      |
| Theme: theme1 |      |      |      |      |      |
| Theme: theme2 |      |      |      |      |      |
| ...           |      |      |      |      |      |

## Methods

Theme: theme1: ...

...

## Obstacles

## Measureements

OKRs

#### Objective:

#### Key Result:

	[Optional] Baseline: ...

	[Optional] Secondary Metrics

## Appendix A: 2025 Draft Priorities

## Appendix B: What’s in and What’s Out?

## Appendix C: Collaboration

```





---

// TODO

To check if Java libraries have been released, you can use the following methods:

1. **Maven Central Repository**: Visit [Maven Central](https://search.maven.org/) and search for the library by its group ID and artifact ID.

2. **Maven Dependency Plugin**: Use the Maven Dependency Plugin to list the available versions of a dependency.

   ```sh
   mvn dependency:resolve -DincludeArtifactIds=<artifactId> -DincludeGroupIds=<groupId>
   ```
```
   
3. **Library's GitHub Repository**: Check the releases section of the library's GitHub repository.

4. **Library's Official Website**: Visit the official website or documentation page of the library.

5. **Maven Versions Plugin**: Use the Maven Versions Plugin to display the available versions of dependencies.
   ```sh
   mvn versions:display-dependency-updates
```

These methods will help you determine if a specific version of a Java library has been released.



要快速查看大量 Java libraries 是否已有 release 版本，可以考慮以下幾種方法：

1. **Maven Central Repository**：
   - 使用 Maven Central 的搜尋功能（例如 [search.maven.org](https://search.maven.org/)），可以直接輸入庫的名稱或關鍵字來查詢相關的 release 版本。

2. **Gradle Plugin**：
   - 如果你使用 Gradle，可以使用 `gradle dependencies` 命令來列出所有依賴項，然後檢查它們的版本。

3. **使用工具或腳本**：
   - 編寫腳本（例如使用 Python 或 Shell）來遍歷一個包含庫名稱的列表，然後查詢 Maven Central API 或使用 GitHub API 來檢查各個庫的 release 情況。

4. **Dependency Management Tools**：
   - 使用像 [Dependabot](https://dependabot.com/) 或 [Renovate](https://renovatebot.com/) 這類工具，這些工具可以自動檢查依賴項的更新情況，並提供通知。

5. **查看官方網站或 GitHub**：
   - 訪問每個庫的官方網站或 GitHub 頁面，通常會在 Releases 標籤下顯示最新的 release 版本。

這些方法可以幫助你有效地檢查多個 Java libraries 的 release 情況。你最常用的是哪一種呢？





To quickly check whether a large number of Java libraries have released versions, you can consider the following methods:

1. **Maven Central Repository**: Visit [Maven Central](https://search.maven.org/) and search for each library by its group ID and artifact ID.

2. **Maven Dependency Plugin**: Use the Maven Dependency Plugin to list the available versions of dependencies.
   ```sh
   mvn dependency:resolve -DincludeArtifactIds=<artifactId> -DincludeGroupIds=<groupId>
   ```

3. **Library's GitHub Repository**: Check the releases section of each library's GitHub repository.

4. **Library's Official Website**: Visit the official website or documentation page of each library.

5. **Maven Versions Plugin**: Use the Maven Versions Plugin to display the available versions of dependencies.

   ```sh
   mvn versions:display-dependency-updates
   ```
```
   
6. **Automated Script**: Write a script to automate the checking process using Maven or other tools.

### Example Script Using Maven Versions Plugin

You can create a script to check for updates for multiple libraries using the Maven Versions Plugin. Here is an example:

​```sh
#!/bin/bash

# List of libraries to check
libraries=(
  "com.example:library1"
  "com.example:library2"
  "com.example:library3"
)

# Create a temporary Maven project
mkdir temp-maven-project
cd temp-maven-project
mvn archetype:generate -DgroupId=com.example -DartifactId=temp-maven-project -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false

# Add dependencies to the pom.xml
for lib in "${libraries[@]}"; do
  IFS=':' read -r groupId artifactId <<< "$lib"
  xmlstarlet ed -L -s "/project/dependencies" -t elem -n "dependency" -v "" \
    -s "/project/dependencies/dependency[last()]" -t elem -n "groupId" -v "$groupId" \
    -s "/project/dependencies/dependency[last()]" -t elem -n "artifactId" -v "$artifactId" \
    -s "/project/dependencies/dependency[last()]" -t elem -n "version" -v "LATEST" \
    pom.xml
done

# Check for updates
mvn versions:display-dependency-updates

# Clean up
cd ..
rm -rf temp-maven-project
```

This script creates a temporary Maven project, adds the specified libraries as dependencies, and uses the Maven Versions Plugin to check for updates. Finally, it cleans up the temporary project.


自助烧烤（11:00 - 13:00）地点：共青森林公园烧烤区
西门可停车 离烧烤区比较近。
北门入园较为方便，大家可以参考下图路线 （建议大家11点前到达）。
33 - 37 号烧烤棚是我们预定的，大家自由落座即可。
晚饭时间（17:30 - 20:00）
酒店停车方便；出行不方便的同事可以结伴打车，抵达餐厅。
地点：禧莱宴·精品粤菜.海鲜融创菜(金桥店) （上海市上海市浦东新区金台路222号）

---

	【性味】	【功效】
去殼砂仁（陽春砂）	辛，溫。	化濕開胃，溫脾止瀉，理氣安胎。用於濕濁中阻，脘痞不饑，脾胃虛寒，嘔吐泄瀉，妊娠惡阻，胎動不安。
地黃	甘，寒。	清熱涼血，養陰生津；
桂枝	辛、甘，溫。	發汗解肌，溫通經脈，助陽化氣，平沖降氣。用於風寒感冒，脘腹冷痛，血寒經閉，關節痹痛，痰飲，水腫，心悸，奔豚。
蓮子	甘、澀，平。	補脾止瀉，益腎澀精，養心安神。用於脾虛久瀉，遺精帶下，心悸失眠。
蜜麩炒白朮	苦、甘，溫。	健脾益氣、燥濕利水、止汗、安胎。用於脾虛食少、腹脹泄瀉、痰飲眩悸、水腫、自汗、胎動不安。
制山茱萸	酸、澀，微溫。	補益肝腎，澀精固脫。用於眩暈耳鳴，腰膝酸痛，陽痿遺精，遺尿尿頻，崩漏帶下，大汗虛脫，內熱消渴。
白茯苓	甘、淡，平。	滲濕利水，健脾和胃，寧心安神。小便不利；水腫脹滿；痰飲咳逆；嘔吐；脾虛食少；泄瀉；心悸不安；失眠健忘；遺精白濁。
黨參片	甘、微酸，性平。	補中益氣，健脾益肺。用於脾肺虛弱，氣短心悸，食少便溏，虛喘咳嗽，內熱消渴。
黃芪	甘，溫。	補氣固表，利尿托毒，排膿，斂瘡生肌的功效。用於氣虛乏力，食少便溏，中氣下陷，久瀉脫肛，便血崩漏，表虛自汗，癰疽難潰，久潰不斂，血虛萎黃，內熱消渴。
北沙參	甘，微苦，微寒。	養陰清肺，益胃生津。用於肺熱燥咳、勞嗽痰血、熱病津傷口渴。
蜜麩炒白芍	苦、酸，微寒。	養血柔肝，緩中止痛，斂陰收汗。治胸腹脅肋疼痛，瀉痢腹痛，自汗盜汗，陰虛發熱，月經不調，崩漏，帶下。
山藥	甘、平。	補脾養胃，生津益肺，補腎澀精。用於脾虛食少，久瀉不止，肺虛喘咳，腎虛遺精，帶下，尿頻，虛熱消渴。
麥冬	甘、微苦，涼。	滋陰生津、潤肺止咳、清心除煩。主治熱病傷津、心煩、口渴、咽乾肺熱、咳嗽、肺結核。
炒麥芽	甘，平。	行氣消食回乳。用於食積不消，婦女斷乳。
防風	辛、甘，微溫。	祛風解表，勝濕止痛，止痙。用於治療外感風寒，頭痛，目眩，項強、風寒濕痹，骨節酸痛，四肢攣急，破傷風。
炒稻芽	甘，溫。	消食和中，健脾開胃。用於食積不消，腹脹口臭，脾胃虛弱，不饑食少。炒稻芽偏於消食。用於不饑食少。焦稻芽善化積滯。用於積滯不消。
癟桃乾		
煅牡蠣	鹹，微寒。	重鎮安神，潛陽補陰，軟堅散結。用於驚悸失眠，眩暈耳鳴，瘰鬁痰核，症瘕痞塊。煆牡蠣收斂固澀。用於自汗盜汗，遺精崩帶，胃痛吞酸。



