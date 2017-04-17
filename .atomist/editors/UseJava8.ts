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
import { EditProject } from '@atomist/rug/operations/ProjectEditor'
import { Project } from '@atomist/rug/model/Project'
import { Pom } from '@atomist/rug/model/Pom'
import { EveryPom } from '@atomist/rug/model/EveryPom'
import { Editor, Parameter, Tags } from '@atomist/rug/operations/Decorators'
import { addOrReplaceBuildPluginManagementPlugin, editMatchingProjectsAndParents } from './EditorFunctions'

const pluginGroupId = "org.apache.maven.plugins";
const pluginArtifactId = "maven-compiler-plugin";

@Editor("UseJava8", "Set the Maven Compiler Plugin to use Java 8")
@Tags("adobe", "java")
export class UseJava8 implements EditProject {

    replaceSourceAndTarget(pom: Pom, xpath: String) {
        if (pom.contains(`${xpath}/configuration/source`)) {
            pom.addOrReplaceNode(`${xpath}/configuration`, `${xpath}/configuration/source`, "source", "<source>1.8</source>");
        }
        if (pom.contains(`${xpath}/configuration/target`)) {
            pom.addOrReplaceNode(`${xpath}/configuration`, `${xpath}/configuration/target`, "target", "<target>1.8</target>");
        }
    }

    edit(project: Project) {
        project.context.pathExpressionEngine.with<EveryPom>(project, "/EveryPom()", pom => {
            let pluginXPath = `/plugins/plugin/artifactId[text() = '${pluginArtifactId}' and ../groupId[text() = '${pluginGroupId}']]/..`;
            let basePluginManagementXPath = `/project/build/pluginManagement${pluginXPath}`;
            let basePluginXPath = `/project/build${pluginXPath}`;

            if (pom.contains(basePluginManagementXPath)) {
                console.log(`update mgmt? ${pom}`)
                this.replaceSourceAndTarget(pom, basePluginManagementXPath);
            }

            if (pom.contains(basePluginXPath)) {
                console.log(`update? ${pom}`)
                this.replaceSourceAndTarget(pom, basePluginXPath);
            }
        });
    }
}

export const useJava8 = new UseJava8();

