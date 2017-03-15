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
import { addCommonSteps } from "./TestHelpers"

addCommonSteps();

When("add core text component", (project: Project, world: ProjectScenarioWorld) => {
    let editor = world.editor("AddCoreComponent");
    world.editWith(editor, {
        component_folder_name: "/apps/test/components/content",
        component_group: "My Project",
        core_component_name: "text",
        component_title: "My Text"
    });
});

Then("the text component should be created in the ui.apps project", (project: Project, world: ProjectScenarioWorld): Result => {
    return checkTextComponent(project, "uiapps/src/main/content/jcr_root/apps/test/components/content/myText/.content.xml");
});

Then("the text component should be created in the root project", (project: Project, world: ProjectScenarioWorld): Result => {
    return checkTextComponent(project, "src/main/content/jcr_root/apps/test/components/content/myText/.content.xml");
});

Then("the text component should not be created in the config project", (project: Project, world: ProjectScenarioWorld): Result => {
    let path = "uiconfig/src/main/content/jcr_root/apps/test/components/content/myText/.content.xml";
    if (project.fileExists(path)) {
        return Result.Failure("Component created at the incorrect path");
    } else {
        return Result.Success;
    }
});

function checkTextComponent(project: Project, path: string) : Result {
    if (project.fileExists(path)) {
        let fileContent = project.findFile(path).content();
        let expected = `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root
    xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    componentGroup="My Project"
    sling:resourceSuperType="core/wcm/components/text/v1/text"
    jcr:title="My Text"/>`;
        if (fileContent === expected) {
            return Result.Success;
        } else {
            return Result.Failure(`Unexpected content in .content.xml: !${project.findFile(path).content()}! Expected: !${expected}!`);
        }
    } else {
        return Result.Failure("no component exists at the correct path");
    }
}