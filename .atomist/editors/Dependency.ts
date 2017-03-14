import { Pom } from '@atomist/rug/model/Pom'

export class Dependency {
    groupId: string;
    artifactId: string;
    version: string;
    scope: string;
    classifier: string;

    constructor(groupId: string, artifactId: string, version: string, scope = "provided", classifier = "") {
        this.groupId = groupId;
        this.artifactId = artifactId;
        this.version = version;
        this.scope = scope;
        this.classifier = classifier;
    }

    addOrReplaceDependencyManagement(pom: Pom) {
        pom.addOrReplaceDependencyManagementDependency(this.groupId, this.artifactId, this.getXml());
    }

    getXml() : string {
        if (this.classifier === "") {
            return `<dependency>
            <groupId>${this.groupId}</groupId>
            <artifactId>${this.artifactId}</artifactId>
            <version>${this.version}</version>
            <scope>${this.scope}</scope>
        </dependency>`;
        } else {
            return `<dependency>
            <groupId>${this.groupId}</groupId>
            <artifactId>${this.artifactId}</artifactId>
            <version>${this.version}</version>
            <scope>${this.scope}</scope>
            <classifier>${this.classifier}</classifier>
        </dependency>`;
        }
    }
}