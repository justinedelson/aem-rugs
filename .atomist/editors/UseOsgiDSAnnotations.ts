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
import { Dependencies } from './Constants'
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
            Dependencies.osgiAnnotations.addOrReplaceDependency(pom);
            Dependencies.osgiMetatypeAnnotations.addOrReplaceDependency(pom);
            Dependencies.osgiComponentAnnotations.addOrReplaceDependency(pom);
            Dependencies.scrAnnotations.removeDependency(pom);
            Dependencies.bndAnnotations.removeDependency(pom);

            removeBuildPlugin(pom, "org.apache.felix", "maven-scr-plugin");
            updateBuildPluginVersionIfNecessary(pom, "org.apache.felix", "maven-bundle-plugin", "3.2.0");
        }, pom => {
            Dependencies.osgiAnnotations.addOrReplaceDependencyManagement(pom);
            Dependencies.osgiMetatypeAnnotations.addOrReplaceDependencyManagement(pom);
            Dependencies.osgiComponentAnnotations.addOrReplaceDependencyManagement(pom);
            Dependencies.scrAnnotations.removeDependencyManagement(pom);
            Dependencies.bndAnnotations.removeDependencyManagement(pom);

            removeBuildPluginManagementPlugin(pom, "org.apache.felix", "maven-scr-plugin");
            updateBuildPluginManagementPluginVersionIfNecessary(pom, "org.apache.felix", "maven-bundle-plugin", "3.2.0");
        });
    }
}

export const useOsgiDSAnnotations = new UseOsgiDSAnnotations();
