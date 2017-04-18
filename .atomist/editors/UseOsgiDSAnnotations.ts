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
import { EditProject } from '@atomist/rug/operations/ProjectEditor';
import { Project } from '@atomist/rug/model/Project';
import { Editor, Parameter, Tags } from '@atomist/rug/operations/Decorators';
import { removeDependencyManagementDependency, editMatchingProjectsAndParents,
            removeBuildPlugin, removeBuildPluginManagementPlugin,
            updateBuildPluginVersionIfNecessary, updateBuildPluginManagementPluginVersionIfNecessary } from './EditorFunctions'

@Editor("UseOsgiDSAnnotations", "Update the project to use the standard OSGI Declarative Services annotations")
@Tags("adobe", "osgi")
export class UseOsgiDSAnnotations implements EditProject {

    edit(project: Project) {
        editMatchingProjectsAndParents(project, pom => {
            return pom.packaging() === "bundle"
        }, pom => {
            pom.addOrReplaceDependency("org.osgi", "org.osgi.annotation");
            pom.addOrReplaceDependency("org.osgi", "org.osgi.service.component.annotations");
            pom.addOrReplaceDependency("org.osgi", "org.osgi.service.metatype.annotations");
            pom.removeDependency("org.apache.felix", "org.apache.felix.scr.annotations");
            pom.removeDependency("biz.aQute.bnd", "annotation");
            removeBuildPlugin(pom, "org.apache.felix", "maven-scr-plugin");
            updateBuildPluginVersionIfNecessary(pom, "org.apache.felix", "maven-bundle-plugin", "3.2.0");
        }, pom => {
            pom.addOrReplaceDependencyManagementDependency("org.osgi", "org.osgi.annotation", `<dependency>
                <groupId>org.osgi</groupId>
                <artifactId>org.osgi.annotation</artifactId>
                <version>6.0.0</version>
                <scope>provided</scope>
            </dependency>`);
            pom.addOrReplaceDependencyManagementDependency("org.osgi", "org.osgi.service.component.annotations", `<dependency>
                <groupId>org.osgi</groupId>
                <artifactId>org.osgi.service.component.annotations</artifactId>
                <version>1.3.0</version>
                <scope>provided</scope>
            </dependency>`);
            pom.addOrReplaceDependencyManagementDependency("org.osgi", "org.osgi.service.metatype.annotations", `<dependency>
                <groupId>org.osgi</groupId>
                <artifactId>org.osgi.service.metatype.annotations</artifactId>
                <version>1.3.0</version>
                <scope>provided</scope>
            </dependency>`);
            removeDependencyManagementDependency(pom, "org.apache.felix", "org.apache.felix.scr.annotations");
            removeDependencyManagementDependency(pom, "biz.aQute.bnd", "annotation");

            removeBuildPluginManagementPlugin(pom, "org.apache.felix", "maven-scr-plugin");
            updateBuildPluginManagementPluginVersionIfNecessary(pom, "org.apache.felix", "maven-bundle-plugin", "3.2.0");
        });
    }
}

export const useOsgiDSAnnotations = new UseOsgiDSAnnotations();
