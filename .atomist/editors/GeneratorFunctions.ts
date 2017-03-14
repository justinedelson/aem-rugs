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
import { Project } from '@atomist/rug/model/Project'
import { Xml } from '@atomist/rug/model/Xml'
import { Pom } from '@atomist/rug/model/Pom'
import { Dependencies } from './Constants'
import {Dependency} from "./Dependency";

/**
 * Remove files in this project that do not belong in the generated
 * project.
 *
 * @param project  Generated project to be modified.
 * @param extra    List of files in addition to the defaults to remove.
 */
export function removeUnnecessaryFiles(project: Project, extraFiles?: string[], extraDirectories?: string[]): void {
    let filesToRemove: string[] = [
        ".atomist.yml",
        ".travis.yml"
    ];
    if (extraFiles != null) {
        filesToRemove = filesToRemove.concat(extraFiles);
    }
    for (let f of filesToRemove) {
        project.deleteFile(f);
    }

    let directoriesToRemove: string[] = [
        ".idea"
    ];
    if (extraDirectories != null) {
        directoriesToRemove = directoriesToRemove.concat(extraDirectories);
    }
    for (let d of directoriesToRemove) {
        project.deleteDirectory(d);
    }
}

export function setProperty(xml : Xml, name : string, value : string): void {
    xml.setTextContentFor(`/properties/entry[@key='${name}']`, value);
}

export function addDependencyManagement(aemVersion: string, pom: Pom): void {
    let dependencies = [
        Dependencies.osgiCore420,
        Dependencies.osgiCompendium420,
        Dependencies.scrAnnotations,
        Dependencies.bndAnnotations,
        Dependencies.servletApi,
        Dependencies.commonsLang3,
        Dependencies.commonsLang2,
        Dependencies.commonsCodec,
        Dependencies.commonsIo,
        Dependencies.jstl,
        Dependencies.jsp,
        Dependencies.jcr,
        Dependencies.slf4j,
        Dependencies.wcmTaglib,
        Dependencies.slingTaglib
    ];
    let testDependencies = [
        Dependencies.junit,
        Dependencies.junitAddons,
        Dependencies.slf4jSimple
    ];

    dependencies.push(getUberJar(aemVersion));

    let allDependencies = dependencies.concat(testDependencies);

    for (let d of allDependencies) {
        d.addOrReplaceDependencyManagement(pom);
    }
}

export function addContentPackageDependencies(aemVersion: string, pom: Pom): void {
    let dependencies = [
        Dependencies.osgiCore420,
        Dependencies.osgiCompendium420,
        Dependencies.servletApi,
        Dependencies.commonsLang3,
        Dependencies.commonsLang2,
        Dependencies.jstl,
        Dependencies.jsp,
        Dependencies.jcr,
        Dependencies.slf4j,
        Dependencies.wcmTaglib,
        Dependencies.slingTaglib
    ];

    dependencies.push(getUberJar(aemVersion));

    for (let d of dependencies) {
        d.addOrReplaceManagedDependency(pom);
    }
}

export function addBundleDependencies(aemVersion: string, pom: Pom): void {
    let dependencies = [
        Dependencies.osgiCore420,
        Dependencies.osgiCompendium420,
        Dependencies.scrAnnotations,
        Dependencies.bndAnnotations,
        Dependencies.servletApi,
        Dependencies.commonsLang3,
        Dependencies.commonsLang2,
        Dependencies.commonsCodec,
        Dependencies.commonsIo,
        Dependencies.jsp,
        Dependencies.jcr,
        Dependencies.slf4j
    ];
    let testDependencies = [
        Dependencies.junit,
        Dependencies.junitAddons,
        Dependencies.slf4jSimple
    ];

    dependencies.push(getUberJar(aemVersion));

    let allDependencies = dependencies.concat(testDependencies);

    for (let d of allDependencies) {
        d.addOrReplaceManagedDependency(pom);
    }
}

function getUberJar(aemVersion: string) : Dependency {
    switch (aemVersion) {
        case "6.1":
            return new Dependency("com.adobe.aem", "uber-jar", "6.1.0", "jar", "provided", "obfuscated-apis");
        case "6.2":
            return new Dependency("com.adobe.aem", "uber-jar", "6.2.0", "jar", "provided", "apis");
        case "6.3":
            return new Dependency("com.adobe.aem", "uber-jar", "6.3.0", "jar", "provided", "apis");
    }
}