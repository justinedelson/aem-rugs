import { Pom } from "@atomist/rug/model/Pom"
import { Result } from "@atomist/rug/test/Result";
import { DOMParser } from 'xmldom'

export function countDependenciesInDependencyManagement(pom: Pom): number {
    let doc = new DOMParser().parseFromString(pom.content(), "text/xml");
    return doc.getElementsByTagName("dependencyManagement")[0].getElementsByTagName("dependency").length;
}
