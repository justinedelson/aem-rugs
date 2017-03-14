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