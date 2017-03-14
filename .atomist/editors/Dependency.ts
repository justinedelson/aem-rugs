import { Pom } from '@atomist/rug/model/Pom'

export class Dependency {
    groupId: string;
    artifactId: string;
    version: string;
    scope: string;
    classifier: string;

    constructor(groupId: string, artifactId: string, version: string, type = "jar", scope = "provided", classifier = "") {
        this.groupId = groupId;
        this.artifactId = artifactId;
        this.version = version;
        this.scope = scope;
        this.classifier = classifier;
    }

    addOrReplaceDependencyManagement(pom: Pom) {
        pom.addOrReplaceDependencyManagementDependency(this.groupId, this.artifactId, this.getXml());
    }

    addOrReplaceManagedDependency(pom: Pom) {
        if (this.classifier === "") {
            pom.addOrReplaceDependency(this.groupId, this.artifactId);
        } else {
            pom.addOrReplaceNode("/project/dependencies",
                `/project/dependencies/dependency/artifactId[text()='${this.artifactId}' and ../groupId[text() = '${this.groupId}' and ../classifier[text() = '${this.classifier}']]]/..`,
                "dependency",
                `<dependency><groupId>${this.groupId}</groupId><artifactId>${this.artifactId}</artifactId><classifier>${this.classifier}</classifier></dependency>`);
        }
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