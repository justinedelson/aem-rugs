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
import { Given, When, Then, ProjectScenarioWorld } from "@atomist/rug/test/project/Core";
import { DOMParser } from 'xmldom';
import * as xpathSelect from 'xpath.js';

console.log(xpathSelect);

export function countDependenciesInDependencyManagement(pom: Pom): number {
    let doc = new DOMParser().parseFromString(pom.content(), "text/xml");
    return doc.getElementsByTagName("dependencyManagement")[0].getElementsByTagName("dependency").length;
}

export function getAttributeValue(file: File, xpath: string): string {
    let doc = new DOMParser().parseFromString(file.content());
    let xpathResult = xpathSelect(xpath, doc);

    console.log(xpathResult);

    return null;
}

export function addCommonSteps() {
    Given("a simple multimodule project", (project: Project, world: ProjectScenarioWorld) => {
        project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule", "");
    });

    Given("a multimodule project with two content packages", (project: Project, world: ProjectScenarioWorld) => {
        project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule-two-content-packages", "");
    });

    Given("a standalone content-package project", (project: Project, world: ProjectScenarioWorld) => {
        project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/just-content-package", "");
    });

    Given("a standalone bundle project", (project: Project, world: ProjectScenarioWorld) => {
        project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/just-bundle", "");
    });

    Then("it should fail", (project: Project, world: ProjectScenarioWorld): boolean => {
        return world.failed();
    });
}