# Adobe Experience Manager Rugs

[rug]: http://docs.atomist.com/

This [Rug][rug] project contains Rug Editors and Generators for working with Adobe Experience Manager projects.

> This project, like Rug itself is in active development as is subject to change.

## Usage

1. Install the [Rug CLI](http://docs.atomist.com/user-guide/interfaces/cli/install/).
2. Edit the file `~/.atomist/cli.yml` to include the repository `https://dl.bintray.com/justinedelson/rugs`. If `~/.atomist/cli.yml` does not exist, run `rug list` to generate it.
3. Use one of the Rug Generators or Editors listed below. The sample commands assume you want to specify all parameters on the command line. If you want to use the interactive mode, use either `rug edit -I <editor coordinates>` or `rug generate -I <generator coordinates>`, e.g. `rug generate -I aem-rugs:aem-rugs:AddCoreComponent`.   
 
### Sample cli.yml file

    # Set up the path to the local repository
    local_repository:
      path: "${user.home}/.atomist/repository"

    # Set up remote repositories to query for Rug archives. Additionally one of the
    # repositories can also be enabled for publication (publish: true).
    remote_repositories:
      central:
        publish: false
        url: "http://repo.maven.apache.org/maven2/"
      rugs:
        publish: false
        url: "https://atomist.jfrog.io/atomist/rugs"
      aem:
        publish: false
        url: "https://dl.bintray.com/justinedelson/rugs"

### Project Structure Support

In general, the Editors in this project are meant to be flexible and support a variety of different project structures, including
cases where the aggregator is the parent, cases where there is a separate parent, multi-bundle, and multi-content package projects.
For example, Editors that operate on OSGi bundle projects will search for all `pom.xml` files in the current directory
and below for ones which have `<packaging>bundle</packaging>`. In cases where content is being edited, the same recursive
search is done, checking both for the correct packaging type and where the content path is covered by the File Vault filter.
In cases where there is ambiguity, an optional parameter is available to specify the specific project to be edited, e.g.
in the case of the [AddSlingModelsPackage](#addslingmodelspackage) Editor.

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
$ cd project/directory
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

    $ cd project/directory
    $ rug edit aem-rugs:aem-rugs:AddCoreComponent component_folder_name=/apps/test/components/content \
        component_group="My Project" core_component_name=image component_title="My Image"


### AddHtlPlugin

Adds the [HTL Maven Plugin](http://sling.apache.org/components/htl-maven-plugin/) to the project.

#### Prerequisites

There must be a content package project under the current directory.

#### Parameters

This Rug takes no parameters.

#### Running

Run this Rug as follows:

    $ cd project/directory
    $ rug edit aem-rugs:aem-rugs:AddHtlPlugin

### UseJava8

Update the configuration of the Maven compiler plugin to use Java 8.

#### Parameters

This Rug takes no parameters.

#### Running

Run this Rug as follows:

    $ cd project/directory
    $ rug edit aem-rugs:aem-rugs:UseJava8


### UseOsgiDSAnnotations

Update the project to use the standard OSGi Declarative Services annotations.

> This rug does **not** update Java code, so it is likely that after running it, your build will be broken.

#### Parameters

This Rug takes no parameters.

#### Running

Run this Rug as follows:

    $ cd project/directory
    $ rug edit aem-rugs:aem-rugs:UseOsgiDSAnnotations 

### AddSlingModelsPackage

Set up a package in the project for use with Sling Models, i.e. make sure the `javax.inject` annotations are
available and that the package is in the `Sling-Models-Package` bundle header.

#### Prerequisites

There must be a bundle project either directly or as a child module.

#### Parameters

This Rug takes following parameters.

Name | Required | Default | Description
-----|----------|---------|------------
`packageName` | Yes | | The package name
`bundlePath` | Maybe | | If the project contains multiple bundle modules, specify the path to the module, e.g. `/core` to select the `core` module.
`packageVersion` | No | 1.0.0 | The export version for the package

#### Running

Run this Rug as follows:

    $ cd project/directory
    $ rug edit aem-rugs:aem-rugs:AddSlingModelsPackage packageName=com.myco.models

## Development

### Building

Before building, you must fetch the NPM modules used:

    $ cd .atomist
    $ npm install

You can build, test, and install the project locally with
the [Rug CLI][cli].

[cli]: https://github.com/atomist/rug-cli

    $ rug test
    $ rug install

### Adding a new Editor
 
To add a new editor, use the standard Rug:

    $ rug edit atomist:rug-rugs:AddTypeScriptEditor editorName="NewEditor" description="A New Editor"
