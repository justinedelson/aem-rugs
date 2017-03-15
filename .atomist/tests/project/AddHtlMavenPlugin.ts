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
import { Pom } from '@atomist/rug/model/Pom'
import { EveryPom } from '@atomist/rug/model/EveryPom'
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { Result } from "@atomist/rug/test/Result";
import { addCommonSteps } from "./TestHelpers"

addCommonSteps();

When("add HTL plugin", (project: Project, world: ProjectScenarioWorld) => {
    let editor = world.editor("AddHtlMavenPlugin");
    world.editWith(editor, {});
});

Then("the root project should have the HTL plugin in pluginManagement", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context().pathExpressionEngine();
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/Pom()"));
    return pom.contains("/project/build/pluginManagement/plugins/plugin/artifactId [text()='htl-maven-plugin' and ../groupId [text() = 'org.apache.sling']]/..");
});

Then("the uiapps project should be configured with the HTL plugin", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context().pathExpressionEngine();
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/uiapps/*[@name='pom.xml']/Pom()"));
    return pom.contains("/project/build/plugins/plugin/artifactId [text()='htl-maven-plugin' and ../groupId [text() = 'org.apache.sling']]/..");
});

Then("the uiconfig project should be configured with the HTL plugin", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context().pathExpressionEngine();
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/uiconfig/*[@name='pom.xml']/Pom()"));
    return pom.contains("/project/build/plugins/plugin/artifactId [text()='htl-maven-plugin' and ../groupId [text() = 'org.apache.sling']]/..");
});

Then("the root project should be configured with the HTL plugin", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context().pathExpressionEngine();
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/Pom()"));
    return pom.contains("/project/build/plugins/plugin/artifactId [text()='htl-maven-plugin' and ../groupId [text() = 'org.apache.sling']]/..");
});