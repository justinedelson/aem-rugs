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
import { Editor, Parameter, Tags } from '@atomist/rug/operations/Decorators'
import { findContentPackageFolderWithFilterCovering, createNodeNameFromTitle, editMatchingProjectsAndParents } from './EditorFunctions'
import { AemPattern } from "./Constants"

let componentMappings = {
    "breadcrumb" : "core/wcm/components/breadcrumb/v1/breadcrumb",
    "button" : "core/wcm/components/form/button/v1/button",
    "formcontainer" : "core/wcm/components/form/container/v1/container",
    "hidden" : "core/wcm/components/form/hidden/v1/hidden",
    "options" : "core/wcm/components/form/options/v1/options",
    "textfield" : "core/wcm/components/form/text/v1/text",
    "image" : "core/wcm/components/image/v1/image",
    "list" : "core/wcm/components/list/v1/list",
    "sharing" : "core/wcm/components/sharing/v1/sharing",
    "text" : "core/wcm/components/text/v1/text"
};

let coreComponentBundleGroupId = "com.adobe.cq";
let coreComponentBundleArtifactId = "core.wcm.components.core";
let coreComponentBundleVersion = "1.0.0";


@Editor("AddCoreComponent", "Add a proxy component for one of the core components to an AEM project.")
@Tags("adobe", "aem")
export class AddCoreComponent implements EditProject {

    @Parameter({
        displayName: "Component folder",
        description: "a folder (relative to /apps) into which the proxy component will be created.",
        pattern: AemPattern.relativeFolder,
        validInput: "a folder name relative to /apps",
        minLength: 1,
        maxLength: 200
    })
    component_folder_name: string;

    @Parameter({
        displayName: "Component group",
        description: "the component group name",
        pattern: AemPattern.componentGroup,
        validInput: "a component group name",
        minLength: 1,
        maxLength: 30
    })
    component_group: string;

    @Parameter({
        displayName: "Core component name",
        description: `the core component name (one of ${Object.keys(componentMappings).join(", ")}`,
        pattern: "^" + Object.keys(componentMappings).join(("|")) + "$",
        validInput: `a component name (one of ${Object.keys(componentMappings).join(", ")}`,
        minLength: 1,
        maxLength: 30
    })
    core_component_name: string;

    @Parameter({
        displayName: "New component title",
        description: "the newly created component's title",
        pattern: Pattern.any,
        validInput: "a component title",
        minLength: 1,
        maxLength: 30
    })
    component_title: string;

    edit(project: Project) {
        let absoluteComponentFolderName = "/apps/" + this.component_folder_name;
        let jcrRootPath : string = findContentPackageFolderWithFilterCovering(project, absoluteComponentFolderName);
        if (!jcrRootPath) {
            project.fail(`Could not find content package project with filter covering '${absoluteComponentFolderName}'.`);
            return;
        }
        let componentName = createNodeNameFromTitle(this.component_title);
        let componentPath = `${absoluteComponentFolderName}/${componentName}`;
        let relativeComponentPath = componentPath.substring(6);
        let componentFolder = `${jcrRootPath}${componentPath}`
        project.addFile(componentFolder + "/.content.xml", `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    componentGroup="${this.component_group}"
    sling:resourceSuperType="${componentMappings[this.core_component_name]}"
    jcr:title="${this.component_title}"/>`);
        if (this.core_component_name === "image") {
            project.merge("components/image/_cq_editConfig.xml.vm", componentFolder + "/_cq_editConfig.xml", {
                componentType : relativeComponentPath
            });
        }

        editMatchingProjectsAndParents(project, pom => {
            return pom.packaging() === "bundle";
        }, pom => {
            pom.addOrReplaceDependency(coreComponentBundleGroupId, coreComponentBundleArtifactId);
        }, pom => {
            console.log("add/replace dependencyManagement in " + pom.path());
            pom.addOrReplaceDependencyManagementDependency(coreComponentBundleGroupId, coreComponentBundleArtifactId, `<dependency>
            <groupId>${coreComponentBundleGroupId}</groupId>
            <artifactId>${coreComponentBundleArtifactId}</artifactId>
            <version>${coreComponentBundleVersion}</version>
            <scope>provided</scope>
        </dependency>`);
        })
    }
}

export const addCoreComponent = new AddCoreComponent();
