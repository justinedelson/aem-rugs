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
import { Pattern } from '@atomist/rug/operations/RugOperation';
import { Editor, Parameter, Tags } from '@atomist/rug/operations/Decorators';
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { Pom } from '@atomist/rug/model/Pom'
import { EveryPom } from '@atomist/rug/model/EveryPom'
import { editMatchingProjectsAndParents } from './EditorFunctions'
import { Dependencies } from './Constants'

const headerName = "Sling-Model-Packages";
const pluginXpath = "/project/build/plugins/plugin/artifactId[text() = 'maven-bundle-plugin']/..";
const configurationXpath = `${pluginXpath}/configuration`;
const instructionsXpath = `${configurationXpath}/instructions`;
const packagesXpath = `${instructionsXpath}/${headerName}`;
const defaultPackageVersion = "1.0.0";

@Editor("AddSlingModelsPackage", "Enable Sling Models for a specific package")
@Tags("adobe", "sling", "aem")
export class AddSlingModelsPackage implements EditProject {

    @Parameter({
        displayName: "Package Name",
        description: "Java Package name containing Sling Models",
        pattern: Pattern.java_package,
        validInput: "a package name",
        minLength: 1,
        maxLength: 100
    })
    packageName: string;

    @Parameter({
        displayName: "Bundle Path",
        description: "Path to the bundle to edit. Only requried if there is more than one bundle.",
        pattern: Pattern.any,
        validInput: "a bundle path",
        minLength: 1,
        maxLength: 100,
        required: false
    })
    bundlePath: string;

    @Parameter({
        displayName: "Package Version",
        description: "Export version of the model package, defaults to 1.0.0.",
        pattern: Pattern.semantic_version,
        validInput: "a version",
        minLength: 1,
        maxLength: 100,
        required: false
    })
    packageVersion: string;

    updateBundle(project: Project, pomToMatch: Pom) {
        editMatchingProjectsAndParents(project, pom => {
            if (pomToMatch) {
                return pom.path == pomToMatch.path;
            } else {
                return pom.packaging() == "bundle";
            }
        }, pom => {
            Dependencies.javaxInject.addOrReplaceDependency(pom);

            pom.addNodeIfNotPresent(pluginXpath, configurationXpath, "configuration", "<configuration></configuration>");
            pom.addNodeIfNotPresent(configurationXpath, instructionsXpath, "instructions", "<instructions></instructions>");

            let newValue = this.packageName;

            let existingPackages = pom.getTextContentFor(packagesXpath);
            if (existingPackages && existingPackages != "") {
                newValue = `${existingPackages},${newValue}`;
            }
            pom.addOrReplaceNode(instructionsXpath, packagesXpath, headerName, `<${headerName}>${newValue}</${headerName}>`);

            let packageInfoFile = `${pom.path.replace("pom.xml", "")}src/main/java/${this.packageName.replace(/\./g, "/")}/package-info.java`;

            if (!project.fileExists(packageInfoFile)) {
                let packageFileContent: string;
                if (Dependencies.osgiAnnotations.isDependencyPresent(pom)) {
                    packageFileContent = `@org.osgi.annotation.versioning.Version("1.0.0")
package ${this.packageName};`
                } else if (Dependencies.bndAnnotations.isDependencyPresent(pom)) {
                    packageFileContent = `@aQute.bnd.annotation.Version("1.0.0")
package ${this.packageName};`
                } else  {
                    packageFileContent = `package ${this.packageName};`;
                }

                project.addFile(packageInfoFile, packageFileContent);
            }
        }, pom => {
            Dependencies.javaxInject.addOrReplaceDependencyManagement(pom);
        });
    }

    edit(project: Project) {
        if (!this.packageVersion) {
            this.packageVersion = defaultPackageVersion;
        }
        let eng: PathExpressionEngine = project.context.pathExpressionEngine;

        if (this.bundlePath) {
            if (!project.fileExists(`${this.bundlePath}/pom.xml`.substring(1))) {
                project.fail(`No bundle found at ${this.bundlePath}`);
            } else {
                let pathExpression = new PathExpression<Project, Pom>(`${this.bundlePath}/*[@name='pom.xml']/Pom()`);
                let pom : Pom = eng.scalar(project, pathExpression);
                this.updateBundle(project, pom);
            }
        } else {
            let bundleCount = 0;
            eng.with<EveryPom>(project, "/EveryPom()[@packaging = 'bundle']", pom => {
                bundleCount++;
            });
            if (bundleCount == 1) {
                this.updateBundle(project, null);
            } else {
                project.fail("Must specify a bundle path since this project contains multiple bundles.");
            }
        }
    }
}

export const addSlingModelsPackage = new AddSlingModelsPackage();
