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
import { Pattern } from '@atomist/rug/operations/RugOperation'
import { Pom } from '@atomist/rug/model/Pom'
import { EveryPom } from '@atomist/rug/model/EveryPom'
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { Editor, Parameter, Tags } from '@atomist/rug/operations/Decorators'
import { addOrReplaceBuildPluginManagementPlugin, addPluginManagementIfNotPresent } from './EditorFunctions'

const pluginGroupId = "org.apache.sling";
const pluginArtifactId = "htl-maven-plugin";
const pluginVersion = "1.0.6";

@Editor("AddHtlMavenPlugin", "Adds the HTL Maven Plugin to Content Package projects")
@Tags("documentation")
export class AddHtlMavenPlugin implements EditProject {

    edit(project: Project) {
        // first, find all of the projects and all of the content package projects
        let allProjects: { [key:string]:Pom; } = { };
        let allContentPackageProjects: Pom[] = [];

        let eng: PathExpressionEngine = project.context().pathExpressionEngine();
        eng.with<EveryPom>(project, "/EveryPom()", pom => {
            let key: string = pom.groupId() + ":" + pom.artifactId();
            allProjects[key] = pom;
            if (pom.packaging() === "content-package") {
                allContentPackageProjects.push(pom);
            }
        });

        // now go through the content package projects and add the plugin
        for (let pom of allContentPackageProjects) {
            pom.addOrReplaceBuildPlugin(pluginGroupId, pluginArtifactId, `<plugin>
                <groupId>org.apache.sling</groupId>
                <artifactId>htl-maven-plugin</artifactId>
            </plugin>`);

            // then add it to the parent
            let parentKey = pom.parentGroupId() + ":" + pom.parentArtifactId();
            let parentPom = allProjects[parentKey];
            if (parentPom != null) {
                addPluginManagement(parentPom);
            } else {
                addPluginManagement(pom);
            }
        }
    }
}

function addPluginManagement(pom: Pom) {
    addPluginManagementIfNotPresent(pom);
    addOrReplaceBuildPluginManagementPlugin(pom, pluginGroupId, pluginArtifactId, `<plugin>
                    <groupId>${pluginGroupId}</groupId>
                    <artifactId>${pluginArtifactId}</artifactId>
                    <version>${pluginVersion}</version>
                    <configuration>
                        <failOnWarnings>true</failOnWarnings>
                    </configuration>
                    <executions>
                        <execution>
                            <goals>
                                <goal>validate</goal>
                            </goals>
                        </execution>
                    </executions>
                </plugin>`);
}

export const addHtlMavenPlugin = new AddHtlMavenPlugin();
