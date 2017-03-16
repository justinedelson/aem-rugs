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
import { PopulateProject } from '@atomist/rug/operations/ProjectGenerator'
import { Project } from '@atomist/rug/model/Project'
import { Pattern } from '@atomist/rug/operations/RugOperation'
import { Generator, Parameter, Tags } from '@atomist/rug/operations/Decorators'
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { File } from '@atomist/rug/model/File'
import { Pom } from '@atomist/rug/model/Pom'
import { Xml } from '@atomist/rug/model/Xml'
import { removeUnnecessaryFiles, setProperty, addDependencyManagement, addContentPackageDependencies, addBundleDependencies } from './GeneratorFunctions'
import { addFilterEntry, addFilterEntryToDefinition } from "./EditorFunctions"
import { XPaths } from "./Constants"

@Generator("CreateAemMultimoduleProject", "Create a skeletal AEM project")
@Tags("documentation")
export class CreateAemMultimoduleProject implements PopulateProject {

    @Parameter({
        displayName: "Group ID",
        description: "the Maven Group ID for the generated project",
        pattern: Pattern.group_id,
        validInput: "A Maven Group ID",
        minLength: 1,
        maxLength: 100
    })
    group_id: string;

    @Parameter({
        displayName: "Content Package Group",
        description: "a Group for your Package when it is installed in the AEM Package Manager",
        pattern: Pattern.any,
        validInput: "a Group",
        minLength: 1,
        maxLength: 100
    })
    content_package_group: string;

    @Parameter({
        displayName: "/apps folder",
        description: "a folder under /apps in which components and configs will be created",
        pattern: Pattern.java_identifier,
        validInput: "a folder name",
        minLength: 1,
        maxLength: 100
    })
    apps_folder_name: string;

    @Parameter({
        displayName: "AEM Version",
        description: "An AEM version (must be one of 6.1, 6.2 or 6.3).",
        pattern: "^6\.1|6\.2|6\.3$",
        validInput: "a supported AEM Version",
        minLength: 3,
        maxLength: 3
    })
    aem_version: string;

    version: string = "0.0.1-SNAPSHOT";
    bundleArtifactId: string;
    contentArtifactId: string;

    updateReadme(project: Project) {
        console.log("Updating README.md");

        let eng: PathExpressionEngine = project.context().pathExpressionEngine();
        let readMePE = new PathExpression<Project, File>("/*[@name='README.md']");
        let readMe: File = eng.scalar(project, readMePE);
        readMe.replace("${projectName}", project.name());
    }

    updatePoms(project: Project) {
        console.log("Updating POM files");
        let eng: PathExpressionEngine = project.context().pathExpressionEngine();
        eng.with<Pom>(project, "/Pom()", pom => {
            pom.setArtifactId(project.name());
            pom.setGroupId(this.group_id);
            pom.setVersion(this.version);
            pom.setProjectName(`${project.name()} - Reactor Project`);
            pom.setDescription(`Maven Multimodule project for ${project.name()}.`);
            addDependencyManagement(this.aem_version, pom);
        });
        eng.with<Pom>(project, "/*/*[@name='pom.xml']/Pom()", pom => {
            pom.setParentArtifactId(project.name());
            pom.setParentGroupId(this.group_id);
            pom.setParentVersion(this.version);
            if (pom.packaging() === "bundle") {
                pom.setArtifactId(this.bundleArtifactId);
                pom.setProjectName(`${project.name()} Bundle`);
                pom.setTextContentFor(XPaths.bsn, `${this.group_id}.${project.name()}`);
                pom.setTextContentFor(XPaths.slingInstallUrl, `http://\${aem.host}:\${aem.port}/apps/${this.apps_folder_name}/install`);
                addBundleDependencies(this.aem_version, pom);
            } else if (pom.packaging() === "content-package") {
                pom.setArtifactId(this.contentArtifactId);
                pom.setProjectName(`${project.name()} Content Package`);
                pom.addOrReplaceDependencyOfVersion(this.group_id, this.bundleArtifactId, "${project.version}");
                addContentPackageDependencies(this.aem_version, pom);
                pom.addChildNode(XPaths.embeddeds, "embedded", `<embedded>
                            <groupId>${this.group_id}</groupId>
                            <artifactId>${this.bundleArtifactId}</artifactId>
                            <target>/apps/${this.apps_folder_name}/install</target>
                        </embedded>`);
                pom.setTextContentFor(XPaths.contentPackageGroup, this.content_package_group);
            }
        });
    }

    updateVaultFiles(project: Project) {
        console.log("Updating Vault files");
        let eng: PathExpressionEngine = project.context().pathExpressionEngine();
        // TODO - figure out how to properly form the path expression
        eng.with<Xml>(project, "/Xml()", xml => {
            if (xml.path() === "ui.apps/src/main/content/META-INF/vault/properties.xml") {
                setProperty(xml, 'version', this.version);
                setProperty(xml, 'description', `${project.name()} Content Package`);
                setProperty(xml, 'group', this.content_package_group);
                setProperty(xml, 'name', project.name());
                setProperty(xml, 'path', `/etc/packages/${this.content_package_group}/${project.name()}-${this.version}.zip`);
            } else if (xml.path() === "ui.apps/src/main/content/META-INF/vault/filter.xml") {
                addFilterEntry(xml, `/apps/${this.apps_folder_name}`);
            }
        });
        eng.with<File>(project, "//definition/*[@name='.content.xml']", file => {
            file.replace('cqVersion="REPLACE"', `cqVersion="${this.aem_version}"`);
            file.replace('group="REPLACE"', `group="${this.content_package_group}"`);
            file.replace('name="REPLACE"', `name="${project.name()}"`);
            file.replace('path="REPLACE"', `path="/etc/packages/${this.content_package_group}/${project.name()}-${this.version}"`);
            file.replace('version="REPLACE"', `version="${this.version}"`);
            addFilterEntryToDefinition(file, `/apps/${this.apps_folder_name}`);
        });
    }

    populate(project: Project) {
        console.log(`Creating ${project.name()}`);

        this.bundleArtifactId = `${project.name()}.core`;
        this.contentArtifactId = `${project.name()}.ui.apps`;

        removeUnnecessaryFiles(project, [ "NOTICE", "LICENSE", "CHANGELOG.md", "CODE_OF_CONDUCT.md", "README.md" ]);
        project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/multimodule-project", "");
        this.updateReadme(project);
        this.updatePoms(project);
        this.updateVaultFiles(project);
        project.addDirectory("java", "core/src/main");
        project.addDirectory("java", "core/src/test");
        project.addDirectory("jcr_root", "ui.apps/src/main/content");
        project.addFile(`ui.apps/src/main/content/jcr_root/apps/${this.apps_folder_name}/install/.vltignore`, "*.jar");

    }
}

export const createAemMultimoduleProject = new CreateAemMultimoduleProject();
