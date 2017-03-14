import { Dependency } from './Dependency'

export abstract class XPaths {
    public static bsn: string = "/project/build/plugins/plugin[artifactId/text()='maven-bundle-plugin']/configuration/instructions/Bundle-SymbolicName";
    public static embeddeds: string = "/project/build/plugins/plugin[artifactId/text()='content-package-maven-plugin']/configuration/embeddeds";
    public static contentPackageGroup: string = "/project/build/plugins/plugin[artifactId/text()='content-package-maven-plugin']/configuration/group";
    public static slingInstallUrl: string = "/project/build/plugins/plugin[artifactId/text()='maven-sling-plugin']/configuration/slingUrl";
}

export abstract class Dependencies {
    public static osgiCore420: Dependency = new Dependency("org.osgi", "org.osgi.core", "4.2.0");
    public static osgiCompendium420: Dependency = new Dependency("org.osgi", "org.osgi.compendium", "4.2.0");
}