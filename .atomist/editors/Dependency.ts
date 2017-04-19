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
import { Pom } from '@atomist/rug/model/Pom'

export class Dependency {
    groupId: string;
    artifactId: string;
    version: string;
    scope: string;
    classifier: string;

    constructor(groupId: string, artifactId: string, version: string, type = "jar", scope = "provided", classifier = "") {
        this.groupId = groupId;
        this.artifactId = artifactId;
        this.version = version;
        this.scope = scope;
        this.classifier = classifier;
    }

    addOrReplaceDependencyManagement(pom: Pom) {
        pom.addOrReplaceDependencyManagementDependency(this.groupId, this.artifactId, this.getXml());
    }

    addOrReplaceManagedDependency(pom: Pom) {
        pom.addNodeIfNotPresent("/project", "/project/dependencies", "dependencies", "<dependencies></dependencies>");
        if (this.classifier === "") {
            pom.addOrReplaceDependency(this.groupId, this.artifactId);
        } else {
            pom.addOrReplaceNode("/project/dependencies",
                `/project/dependencies/dependency/artifactId[text()='${this.artifactId}' and ../groupId[text() = '${this.groupId}' and ../classifier[text() = '${this.classifier}']]]/..`,
                "dependency",
                `<dependency><groupId>${this.groupId}</groupId><artifactId>${this.artifactId}</artifactId><classifier>${this.classifier}</classifier></dependency>`);
        }
    }

    getXml() : string {
        if (this.classifier === "") {
            return `<dependency>
            <groupId>${this.groupId}</groupId>
            <artifactId>${this.artifactId}</artifactId>
            <version>${this.version}</version>
            <scope>${this.scope}</scope>
        </dependency>`;
        } else {
            return `<dependency>
            <groupId>${this.groupId}</groupId>
            <artifactId>${this.artifactId}</artifactId>
            <version>${this.version}</version>
            <scope>${this.scope}</scope>
            <classifier>${this.classifier}</classifier>
        </dependency>`;
        }
    }
}