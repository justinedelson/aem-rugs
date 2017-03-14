/**
 * Created by jedelson on 3/13/17.
 */
import { Project } from '@atomist/rug/model/Project'
import { Xml } from '@atomist/rug/model/Xml'
import { Pom } from '@atomist/rug/model/Pom'
import { Dependencies } from './Constants'

/**
 * Remove files in this project that do not belong in the generated
 * project.
 *
 * @param project  Generated project to be modified.
 * @param extra    List of files in addition to the defaults to remove.
 */
export function removeUnnecessaryFiles(project: Project, extraFiles?: string[], extraDirectories?: string[]): void {
    let filesToRemove: string[] = [
        ".atomist.yml",
        ".travis.yml"
    ];
    if (extraFiles != null) {
        filesToRemove = filesToRemove.concat(extraFiles);
    }
    for (let f of filesToRemove) {
        project.deleteFile(f);
    }

    let directoriesToRemove: string[] = [
        ".idea"
    ];
    if (extraDirectories != null) {
        directoriesToRemove = directoriesToRemove.concat(extraDirectories);
    }
    for (let d of directoriesToRemove) {
        project.deleteDirectory(d);
    }
}

export function setProperty(xml : Xml, name : string, value : string): void {
    xml.setTextContentFor(`/properties/entry[@key='${name}']`, value);
}

export function addDependencyManagement(aemVersion: string, pom: Pom): void {
    switch (aemVersion) {
        case "6.1" :
            Dependencies.osgiCore420.addOrReplaceDependencyManagement(pom);
            Dependencies.osgiCompendium420.addOrReplaceDependencyManagement(pom);
            break;
        case "6.2" :
            Dependencies.osgiCore420.addOrReplaceDependencyManagement(pom);
            Dependencies.osgiCompendium420.addOrReplaceDependencyManagement(pom);
            break;
        case "6.3" :
            Dependencies.osgiCore420.addOrReplaceDependencyManagement(pom);
            Dependencies.osgiCompendium420.addOrReplaceDependencyManagement(pom);
            break;
    }
}