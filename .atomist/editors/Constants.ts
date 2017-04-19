/*
 * Copyright (C) 2017 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Dependency } from './Dependency'

export abstract class XPaths {
    public static bsn: string = "/project/build/plugins/plugin[artifactId/text()='maven-bundle-plugin']/configuration/instructions/Bundle-SymbolicName";
    public static embeddeds: string = "/project/build/plugins/plugin[artifactId/text()='content-package-maven-plugin']/configuration/embeddeds";
    public static contentPackageGroup: string = "/project/build/plugins/plugin[artifactId/text()='content-package-maven-plugin']/configuration/group";
    public static slingInstallUrl: string = "/project/build/plugins/plugin[artifactId/text()='maven-sling-plugin']/configuration/slingUrl";
}

export abstract class Dependencies {
    public static osgiCore420: Dependency = new Dependency("org.osgi", "org.osgi.core", "4.2.0");
    public static osgiCompendium420: Dependency = new Dependency("org.osgi", "org.osgi.compendium", "4.2.0");
    public static scrAnnotations : Dependency = new Dependency("org.apache.felix", "org.apache.felix.scr.annotations", "1.9.8");
    public static bndAnnotations : Dependency = new Dependency("biz.aQute.bnd", "annotation", "2.3.0");
    public static servletApi : Dependency = new Dependency("javax.servlet", "servlet-api", "2.5");
    public static commonsLang3 : Dependency = new Dependency("org.apache.commons", "commons-lang3", "3.0.1");
    public static commonsLang2 : Dependency = new Dependency("commons-lang", "commons-lang", "2.5");
    public static commonsCodec : Dependency = new Dependency("commons-codec", "commons-codec", "1.5");
    public static commonsIo : Dependency = new Dependency("commons-io", "commons-io", "2.4");
    public static jstl : Dependency = new Dependency("com.day.commons", "day-commons-jstl", "1.1.4");
    public static jsp : Dependency = new Dependency("javax.servlet.jsp", "jsp-api", "2.1");
    public static jcr : Dependency = new Dependency("javax.jcr", "jcr", "2.0");
    public static junit : Dependency = new Dependency("junit", "junit", "4.11", "jar", "test");
    public static junitAddons : Dependency = new Dependency("junit-addons", "junit-addons", "1.4", "jar", "test");
    public static slf4j : Dependency = new Dependency("org.slf4j", "slf4j-api", "1.7.6");
    public static slf4jSimple : Dependency = new Dependency("org.slf4j", "slf4j-simple", "1.7.6", "jar", "test");
    public static wcmTaglib : Dependency = new Dependency("com.day.cq.wcm", "cq-wcm-taglib", "5.6.4");
    public static slingTaglib : Dependency = new Dependency("org.apache.sling", "org.apache.sling.scripting.jsp.taglib", "2.2.0");
    public static javaxInject : Dependency = new Dependency("javax.inject", "javax.inject", "1");
    public static coreComponentsBundle = new Dependency("com.adobe.cq", "core.wcm.components.core", "1.0.0");
    public static osgiAnnotations = new Dependency("org.osgi", "org.osgi.annotation", "6.0.0");
    public static osgiComponentAnnotations = new Dependency("org.osgi", "org.osgi.service.component.annotations", "1.3.0");
    public static osgiMetatypeAnnotations = new Dependency("org.osgi", "org.osgi.service.metatype.annotations", "1.3.0");
}

export abstract class AemPattern {
    public static componentGroup: string = "^[a-zA-Z][-\\w. ]+$";
    public static relativeFolder: string = "^[\\w]+[-\\w\\/]+$";

}