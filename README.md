# aem-rugs

[rug]: http://docs.atomist.com/

This [Rug][rug] project contains Rug Editors and Generators for working with Adobe Experience Manager projects.

## Rugs

### CreateAemMultimoduleProject

Create a new AEM Multimodule Maven project with a single bundle and content-package project.

#### Prerequisites

This Rug has no prerequisites.

#### Parameters

This Rug takes following parameters.

Name | Required | Default | Description
-----|----------|---------|------------
`project_name` | Yes | | Name of project to be created
`group_id` | Yes | | Maven Group ID of the project to be created
`artifact_id` | Yes | | Maven Artifact ID of the project to be created
`apps_folder_name` | Yes | | The folder under apps into which components and configurations will be placed
`content_package_group` | Yes | | The content package group name
`aem_version` | Yes | | The AEM version being targetted by the project (6.1, 6.2 or 6.3)

#### Running

Run this Rug as follows:

```
$ cd parent/directory
$ rug generate aem-rugs:aem-rugs:CreateAemMultimoduleProject \
    my-new-project group_id=com.test artifact_id=test-project \
    apps_folder_name=test content_package_group=my-packages aem_version=6.3
```

### AddCoreComponent

Create a new proxy component for one of the AEM Core Components

#### Prerequisites

There must be a content package project under the current directory whose
filter already contains the new component's parent directory. 

#### Parameters

This Rug takes following parameters.

Name | Required | Default | Description
-----|----------|---------|------------
`component_folder_name` | Yes | | The parent folder for the newly created component
`core_component_name` | Yes | | The name of the core component being proxied
`component_title` | Yes | | The title of the newly created component
`component_group` | Yes | | The group of the newly created component

#### Running

Run this Rug as follows:

```
$ cd parent/directory
$ rug edit aem-rugs:aem-rugs:AddCoreComponent component_folder_name=/apps/test/components/content \
    component_group="My Project" core_component_name=image component_title="My Image"
```

### AddHtlPlugin

Adds the [HTL Maven Plugin](http://sling.apache.org/components/htl-maven-plugin/) to the project.

#### Prerequisites

There must be a content package project under the current directory.

#### Parameters

This Rug takes no parameters.

#### Running

Run this Rug as follows:

```
$ cd parent/directory
$ rug edit aem-rugs:aem-rugs:AddHtlPlugin
```

### UseJava8

Update the configuration of the Maven compiler plugin to use Java 8.

#### Parameters

This Rug takes no parameters.

#### Running

Run this Rug as follows:

```
$ cd parent/directory
$ rug edit aem-rugs:aem-rugs:UseJava8
```


### UseOsgiDSAnnotations

Update the project to use the standard OSGi Declarative Services annotations.

> This rug does **not** update Java code, so it is likely that after running it, your build will be broken.

#### Parameters

This Rug takes no parameters.

#### Running

Run this Rug as follows:

```
$ cd parent/directory
$ rug edit aem-rugs:aem-rugs:UseJava8
```


## Development

You can build, test, and install the project locally with
the [Rug CLI][cli].

[cli]: https://github.com/atomist/rug-cli

```
$ rug test
$ rug install
```

To create a new release of the project, simply push a tag of the form
`M.N.P` where `M`, `N`, and `P` are integers that form the next
appropriate [semantic version][semver] for release.  For example:

[semver]: http://semver.org
