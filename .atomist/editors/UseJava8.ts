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
const configValue = "1.8";

@Editor("UseJava8", "Set the Maven Compiler Plugin to use Java 8")
@Tags("adobe", "java")
export class UseJava8 implements EditProject {

    replace(pom: Pom, xpath: String, tagName: string) {
        let configXpath = `${xpath}/configuration`;
        let valueXpath = `${configXpath}/${tagName}`;
        if (pom.contains(valueXpath)) {
            if (pom.getTextContentFor(valueXpath) != configValue) {
                pom.addOrReplaceNode(configXpath, valueXpath, tagName, `<${tagName}>${configValue}</${tagName}>`);
            }
        }
    }

    replaceSourceAndTarget(pom: Pom, xpath: string) {
        this.replace(pom, xpath, "source");
        this.replace(pom, xpath, "target");
    }

    edit(project: Project) {
        let changesMade = false;
        project.context.pathExpressionEngine.with<EveryPom>(project, "/EveryPom()", pom => {
            let pluginXPath = `/plugins/plugin/artifactId[text() = '${pluginArtifactId}']/..`;
            let basePluginManagementXPath = `/project/build/pluginManagement${pluginXPath}`;
            let basePluginXPath = `/project/build${pluginXPath}`;

            if (pom.contains(basePluginManagementXPath)) {
                this.replaceSourceAndTarget(pom, basePluginManagementXPath);
                changesMade = true;
            }

            if (pom.contains(basePluginXPath)) {
                this.replaceSourceAndTarget(pom, basePluginXPath);
                changesMade = true;
            }
        });
        if (!changesMade) {
            // no changes made anywhere, so let's find a parent to update
            editMatchingProjectsAndParents(project, pom => {
                return pom.packaging() == "jar" || pom.packaging() == "bundle";
            }, pom => {}, pom => {
                addOrReplaceBuildPluginManagementPlugin(pom, pluginGroupId, pluginArtifactId, `<plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <target>1.8</target>
                    <source>1.8</source>
                </configuration>
            </plugin>`);
            });
        }
    }
}

export const useJava8 = new UseJava8();

