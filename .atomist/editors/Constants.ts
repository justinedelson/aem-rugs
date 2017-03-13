export abstract class XPaths {
    public static bsn: string = "/project/build/plugins/plugin[artifactId/text()='maven-bundle-plugin']/configuration/instructions/Bundle-SymbolicName";
    public static embeddeds: string = "/project/build/plugins/plugin[artifactId/text()='content-package-maven-plugin']/configuration/embeddeds";
    public static contentPackageGroup: string = "/project/build/plugins/plugin[artifactId/text()='content-package-maven-plugin']/configuration/group";
    public static slingInstallUrl: string = "/project/build/plugins/plugin[artifactId/text()='maven-sling-plugin']/configuration/slingUrl";
}