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
import { Pom } from "@atomist/rug/model/Pom";
import { File } from "@atomist/rug/model/File";
import { Result } from "@atomist/rug/test/Result";
import { Project } from "@atomist/rug/model/Project";
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { DOMParser } from 'xmldom';
import * as xpathSelect from 'xpath.js';

export function countDependenciesInDependencyManagement(pom: Pom): number {
    let doc = new DOMParser().parseFromString(pom.content, "text/xml");
    return doc.getElementsByTagName("dependencyManagement")[0].getElementsByTagName("dependency").length;
}

export function getAttributeValue(file: File, xpath: string): string {
    let doc = new DOMParser().parseFromString(file.content);
    let xpathResult = xpathSelect(doc, xpath);

    if (xpathResult.length == 1) {
        return xpathResult[0].value;
    }

    return null;
}

export function checkDependency(project: Project, path: string, groupId: string, artifactId: string): boolean {
    let pathExpression = "/Pom()";
    if (path.length > 0) {
        pathExpression = `/${path}/*[@name='pom.xml']/Pom()`;
    }
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    let pom = eng.scalar(project, new PathExpression<Project,Pom>(pathExpression));
    return pom.isDependencyPresent(groupId, artifactId);
}

export function checkManagedDependency(project: Project, path: string, groupId: string, artifactId: string): boolean {
    let pathExpression = "/Pom()";
    if (path.length > 0) {
        pathExpression = `/${path}/*[@name='pom.xml']/Pom()`;
    }
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    let pom = eng.scalar(project, new PathExpression<Project,Pom>(pathExpression));
    return pom.isDependencyManagementDependencyPresent(groupId, artifactId);
}