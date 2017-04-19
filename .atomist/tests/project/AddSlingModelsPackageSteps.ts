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
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { Pom } from '@atomist/rug/model/Pom'
import { Given, When, Then, ProjectScenarioWorld } from "@atomist/rug/test/project/Core";
import { Result } from "@atomist/rug/test/Result";
import { getAttributeValue, checkDependency, checkManagedDependency } from "./TestHelpers"


const depGroupId = "javax.inject";
const depArtifactId = "javax.inject";
const packageName = "com.myco.models";

Given("a bundle with the Sling-Model-Packages header defined", (p, world) => {
    p.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/bundle-with-existing-sling-models-package", "");
});

When("AddSlingModelsPackage is run", (p, world) => {
    let psworld = world as ProjectScenarioWorld;
    let editor = psworld.editor("AddSlingModelsPackage");

    psworld.editWith(editor, { packageName: packageName });
});

When("AddSlingModelsPackage is run with a bundle path of core", (p, world) => {
    let psworld = world as ProjectScenarioWorld;
    let editor = psworld.editor("AddSlingModelsPackage");

    psworld.editWith(editor, { packageName: packageName, bundlePath: "/core" });
});

When("AddSlingModelsPackage is run with a bundle path of garbage", (p, world) => {
    let psworld = world as ProjectScenarioWorld;
    let editor = psworld.editor("AddSlingModelsPackage");

    psworld.editWith(editor, { packageName: packageName, bundlePath: "/garbage" });
});

Then("javax.inject was added to the core bundle's dependencies", (p, world): boolean => {
    return checkDependency(p, "core", depGroupId, depArtifactId);
});

Then("javax.inject was added to the parent pom's dependencyManagement", (p, world): boolean => {
    return checkManagedDependency(p, "parent", depGroupId, depArtifactId);
});

Then("javax.inject was added to the root pom's dependencyManagement", (p, world): boolean => {
    return checkManagedDependency(p, "", depGroupId, depArtifactId);
});

Then("javax.inject was added to the root bundle's dependencies", (p, world): boolean => {
    return checkDependency(p, "", depGroupId, depArtifactId);
});

Then("the package was added to the core bundle's maven-bundle-plugin configuration", (p, world): Result => {
    let eng = p.context.pathExpressionEngine;
    let pom = eng.scalar(p, new PathExpression<Project, Pom>("/core/*[@name='pom.xml']/Pom()"));
    let packageHeader = pom.getTextContentFor("/project/build/plugins/plugin/artifactId[text() = 'maven-bundle-plugin']/../configuration/instructions/Sling-Model-Packages");
    if (packageHeader === packageName) {
        return Result.Success;
    } else {
        return Result.Failure(`Package header was not expected value '${packageName}'. It was '${packageHeader}'.`);
    }
});

Then("the package was added to the existing package", (p, world): Result => {
    let eng = p.context.pathExpressionEngine;
    let pom = eng.scalar(p, new PathExpression<Project, Pom>("/Pom()"));
    let packageHeader = pom.getTextContentFor("/project/build/plugins/plugin/artifactId[text() = 'maven-bundle-plugin']/../configuration/instructions/Sling-Model-Packages");
    let expectedValue = `some.existing.package,${packageName}`;
    if (packageHeader === expectedValue) {
        return Result.Success;
    } else {
        return Result.Failure(`Package header was not expected value '${expectedValue}'. It was '${packageHeader}'.`);
    }
});