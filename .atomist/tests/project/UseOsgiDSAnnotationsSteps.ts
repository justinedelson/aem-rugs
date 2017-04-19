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
import { checkDependency, checkDependencyManagement, checkPlugin, checkPluginManagement } from "./TestHelpers"

When("Use OSGi DS Annotations", (p, world) => {
    let editor = world.editor("UseOsgiDSAnnotations");
    world.editWith(editor, {});
});

Then("the OSGi dependencies are managed in the root pom", (p, world) => {
    return checkDependencyManagement(p, "", "org.osgi", "org.osgi.annotation") &&
        checkDependencyManagement(p, "", "org.osgi", "org.osgi.service.component.annotations") &&
        checkDependencyManagement(p, "", "org.osgi", "org.osgi.service.metatype.annotations");
});

Then("the OSGi dependencies are in the core pom", (p, world) => {
    return checkDependency(p, "core", "org.osgi", "org.osgi.annotation") &&
        checkDependency(p, "core", "org.osgi", "org.osgi.service.component.annotations") &&
        checkDependency(p, "core", "org.osgi", "org.osgi.service.metatype.annotations");
});

Then("the SCR dependency is not in the core pom", (p, world) => {
    return !checkDependency(p, "core", "org.apache.felix", "org.apache.felix.scr.annotations");
});

Then("the SCR dependency is not managed in the root pom", (p, world) => {
    return !checkDependencyManagement(p, "", "org.apache.felix", "org.apache.felix.scr.annotations");
});

Then("the SCR plugin is not configured in the core pom", (p, world) => {
    return !checkPlugin(p, "core", "org.apache.felix", "maven-scr-plugin");
});

Then("the SCR plugin is not managed in the root pom", (p, world) => {
    return !checkPluginManagement(p, "", "org.apache.felix", "maven-scr-plugin");
});
