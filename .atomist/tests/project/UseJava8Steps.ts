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

Given("a standalone bundle project using Java 8", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/just-bundle-java8", "");
});

Given("a standalone bundle project without a compiler plugin configuration", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/just-bundle-nocompilerplugin", "");
});

When("use Java 8", (project: Project, world: ProjectScenarioWorld) => {
    let editor = world.editor("UseJava8");
    world.editWith(editor, {});
});

Then("compiler plugin was updated", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/Pom()"));
    return pom.getTextContentFor("/project/build/plugins/plugin/artifactId[text() = 'maven-compiler-plugin']/../configuration/source") == "1.8" &&
        pom.getTextContentFor("/project/build/plugins/plugin/artifactId[text() = 'maven-compiler-plugin']/../configuration/target") == "1.8";
});

Then("plugin management in the root pom was updated", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/Pom()"));
    return pom.getTextContentFor("/project/build/pluginManagement/plugins/plugin/artifactId[text() = 'maven-compiler-plugin']/../configuration/source") == "1.8" &&
        pom.getTextContentFor("/project/build/pluginManagement/plugins/plugin/artifactId[text() = 'maven-compiler-plugin']/../configuration/target") == "1.8";
});

Then("plugin management in the parent pom was updated", (project: Project, world: ProjectScenarioWorld): boolean => {
    let eng: PathExpressionEngine = project.context.pathExpressionEngine;
    let pom = eng.scalar(project, new PathExpression<Project,Pom>("/parent/*[@name='pom.xml']/Pom()"));
    return pom.getTextContentFor("/project/build/pluginManagement/plugins/plugin/artifactId[text() = 'maven-compiler-plugin']/../configuration/source") == "1.8" &&
        pom.getTextContentFor("/project/build/pluginManagement/plugins/plugin/artifactId[text() = 'maven-compiler-plugin']/../configuration/target") == "1.8";
});
