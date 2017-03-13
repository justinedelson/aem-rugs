/**
 * Created by jedelson on 3/13/17.
 */
import { Project } from '@atomist/rug/model/Project'
import { PathExpression, PathExpressionEngine } from '@atomist/rug/tree/PathExpression'
import { File } from '@atomist/rug/model/File'

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