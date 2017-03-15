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
import { Project } from "@atomist/rug/model/Project";
import { Given, When, Then, ProjectScenarioWorld } from "@atomist/rug/test/project/Core";
import { Result } from "@atomist/rug/test/Result";
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { Pom } from "@atomist/rug/model/Pom"
import { countDependenciesInDependencyManagement } from "./TestHelpers"

const projectName = "test-project";
const groupId = "com.myco";
const contentPackageGroup = "my-packages";
const appsFolderName = "test";

When("generate with CreateAemMultimoduleProject for AEM 6.3", (project: Project, world: ProjectScenarioWorld) => {
    let generator = world.generator("CreateAemMultimoduleProject")
    world.generateWith(generator, {
        project_name: projectName,
        group_id: groupId,
        content_package_group: contentPackageGroup,
        apps_folder_name: appsFolderName,
        aem_version: "6.3"
    });
});

Then("there should be a correct root pom file for AEM 6.3", (project: Project, world: ProjectScenarioWorld) => {
    let eng = project.context().pathExpressionEngine();
    let pom = eng.scalar(project, new PathExpression<Project, Pom>("/Pom()"));
    if (!pom) {
        return Result.Failure("No pom.xml in root");
    }

    if (pom.content().indexOf("REPLACE") > -1) {
        return Result.Failure(`Expected 'REPLACE' in root pom. ${pom.content()}`);
    }

    if (pom.groupId() !== groupId) {
        return Result.Failure(`Incorrect groupId: ${pom.groupId()}`);
    }

    // TODO - this looks like a bug where the projet name is always "project_name"
    if (pom.artifactId() !== "project_name") {
        return Result.Failure(`Incorrect artifactId: ${pom.artifactId()}`);
    }

    let dependencyManagementCount = countDependenciesInDependencyManagement(pom);
    if (dependencyManagementCount != 19) {
        return Result.Failure(`Incorrect number of dependencies in dependencyManagenent ${dependencyManagementCount}`);
    }

    return Result.Success;
});