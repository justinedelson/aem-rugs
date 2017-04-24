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
import { Xml } from '@atomist/rug/model/Xml'
import { File } from '@atomist/rug/model/File'
import { Pom } from '@atomist/rug/model/Pom'
import { Project } from '@atomist/rug/model/Project'
import { EveryPom } from '@atomist/rug/model/EveryPom'
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { DOMParser } from 'xmldom'
import { gt as semverGt} from 'semver'

export function addFilterEntry(filterXml : Xml, path : string) : void {
    filterXml.addChildNode("/workspaceFilter", "filter", `<filter root="${path}"/>`);
}

export function addFilterEntryToDefinition(definitionXml : File, path : string) : void {
    let doc = new DOMParser().parseFromString(definitionXml.content, "text/xml");
    let filterElement = findDefinitionFilter(doc.documentElement);
    if (filterElement) {
        let filterCount = countChildNodes(filterElement);

        let newFilterEntry = doc.createElement(`f${filterCount}`);
        newFilterEntry.setAttributeNS("http://www.jcp.org/jcr/1.0", "jcr:primaryType", "nt:unstructured");
        newFilterEntry.setAttribute("mode", "replace");
        newFilterEntry.setAttribute("root", path);
        newFilterEntry.setAttribute("rules", "[]");
        filterElement.appendChild(newFilterEntry);

        definitionXml.setContent(doc.toString());
    } else {
        console.warn("No filter element found in definition/.content.xml. Skipping adding a filter entry.")
    }
}

export function findContentPackageFolderWithFilterCovering(project : Project, path: string) : string {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    let result: string;

    eng.with<EveryPom>(project, "/EveryPom()", pom => {
        if (pom.packaging() === "content-package") {
            let basePath = pom.path.substring(0, pom.path.lastIndexOf("/"));
            eng.with<Xml>(project, "/Xml()", xml => {
                let tailMatch = xml.path.match("META\-INF/vault/filter\.xml$");
                if (tailMatch && xml.underPath(basePath)) {
                    let doc = new DOMParser().parseFromString(xml.content, "text/xml");
                    let filters = doc.getElementsByTagName("filter");
                    for (let filter of filters) {
                        let root = filter.getAttribute("root").toString();
                        // TODO - deal with includes/excludes
                        if (path.indexOf(root) == 0) {
                            result = xml.path.substring(0, tailMatch.index) + "jcr_root";
                        }
                    }
                }
            });
        }
    });
    return result;
}

export function removeDependencyManagementDependency(pom: Pom, groupId: string, artifactId: string) {
    pom.deleteNode(`/project/dependencyManagement/dependencies/dependency/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/..`);
}

export function removeBuildPlugin(pom: Pom, groupId: string, artifactId: string) {
    pom.deleteNode(`/project/build/plugins/plugin/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/..`);
}

export function removeBuildPluginManagementPlugin(pom: Pom, groupId: string, artifactId: string) {
    pom.deleteNode(`/project/build/pluginManagement/plugins/plugin/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/..`);
}

export function updateBuildPluginVersionIfNecessary(pom: Pom, groupId: string, artifactId: string, newVersion: string)  {
    let currentVersionStr = pom.getTextContentFor(`/project/build/plugins/plugin/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/../version`);
    if (currentVersionStr && semverGt(newVersion, currentVersionStr)) {
        pom.setTextContentFor(`/project/build/plugins/plugin/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/../version`, newVersion);
    }
}

export function updateBuildPluginManagementPluginVersionIfNecessary(pom: Pom, groupId: string, artifactId: string, newVersion: string) {
    let currentVersionStr = pom.getTextContentFor(`/project/build/pluginManagement/plugins/plugin/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/../version`);
    if (currentVersionStr && semverGt(newVersion, currentVersionStr)) {
        pom.setTextContentFor(`/project/build/pluginManagement/plugins/plugin/artifactId[text()='${artifactId}' and ../groupId[text() = '${groupId}']]/../version`, newVersion);
    }
}

export function editMatchingProjectsAndParents(root: Project, matchF: (pom: Pom) => boolean,
                                       projectF: (pom: Pom) => void, parentF: (pom: Pom) => void): void {
    // first, find all of the projects and all of the projects matching
    let allProjects: { [key:string]:Pom; } = { };
    let allMatchingProjects: Pom[] = [];

    let eng: PathExpressionEngine = root.context.pathExpressionEngine;
    eng.with<EveryPom>(root, "/EveryPom()", pom => {
        let key: string = pom.groupId() + ":" + pom.artifactId();
        allProjects[key] = pom;
        if (matchF(pom)) {
            allMatchingProjects.push(pom);
        }
    });

    // now go through the matched projects and call the project function
    for (let pom of allMatchingProjects) {
        projectF(pom);

        // then call the parent function
        let parentKey = pom.parentGroupId() + ":" + pom.parentArtifactId();
        let parentPom = allProjects[parentKey];
        if (parentPom != null) {
            parentF(parentPom);
        } else {
            parentF(pom);
        }
    }
}

function findDefinitionFilter(documentElement) : any {
    for (let child of documentElement.childNodes) {
        if (child.nodeName === "filter") {
            return child;
        }
    }
    return null;
}

function countChildNodes(element) : number {
    let count = 0;
    for (let child of element.childNodes) {
        if (child.nodeType === element.nodeType) {
            count++;
        }
    }
    return count;
}
