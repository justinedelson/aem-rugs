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

import { Given, When, Then, ProjectScenarioWorld } from "@atomist/rug/test/project/Core";
import { Project } from "@atomist/rug/model/Project";

Given("a simple multimodule project", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule", "");
});

Given("a simple multimodule project using OSGi annotations", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule-osgi-annotations", "");
});


Given("a multimodule project with two content packages", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule-two-content-packages", "");
});

Given("a multimodule project with two bundles", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule-two-bundles", "");
});

Given("a standalone content-package project", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/just-content-package", "");
});

Given("a standalone bundle project", (project: Project, world: ProjectScenarioWorld) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/just-bundle", "");
});

Given("a multimodule project with a separate parent", (project, world) => {
    project.copyEditorBackingFilesWithNewRelativePath(".atomist/templates/test-projects/multimodule-with-separate-parent", "");
});