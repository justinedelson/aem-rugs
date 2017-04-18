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
import { Editor, Parameter, Tags } from '@atomist/rug/operations/Decorators'
import { editMatchingProjectsAndParents } from './EditorFunctions'

const pluginGroupId = "org.apache.sling";
const pluginArtifactId = "htl-maven-plugin";
const pluginVersion = "1.0.6";

@Editor("AddHtlMavenPlugin", "Adds the HTL Maven Plugin to Content Package projects")
@Tags("adobe", "aem")
export class AddHtlMavenPlugin implements EditProject {

    edit(project: Project) {
        editMatchingProjectsAndParents(project, pom => {
            return pom.packaging() === "content-package"
        }, pom => {
            pom.addOrReplaceBuildPlugin(pluginGroupId, pluginArtifactId, `<plugin>
                <groupId>org.apache.sling</groupId>
                <artifactId>htl-maven-plugin</artifactId>
            </plugin>`);
        }, pom => {
            pom.addOrReplaceBuildPluginManagementPlugin(pluginGroupId, pluginArtifactId, `<plugin>
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
        });
    }
}

export const addHtlMavenPlugin = new AddHtlMavenPlugin();
