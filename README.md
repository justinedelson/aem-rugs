# aem-rugs

[![Build Status](https://travis-ci.org/atomist-rugs/aem-rugs.svg?branch=master)](https://travis-ci.org/atomist-rugs/aem-rugs)
[![Slack Status](https://join.atomist.com/badge.svg)](https://join.atomist.com)

[rug]: http://docs.atomist.com/

This [Rug][rug] project contains Atomist Rug archive project.

## Rugs

### CreateAemMultimoduleProject

Create

#### Prerequisites

This Rug has no prerequisites.

#### Parameters

This Rug takes following parameters.

Name | Required | Default | Description
-----|----------|---------|------------
`project_name` | Yes | | Name of project to be created

#### Running

Run this Rug as follows:

```
$ cd parent/directory
$ rug generate atomist-rugs:rug-editors:CreateAemMultimoduleProject \
    my-new-project
```

Explain what your generator does here.

## Support

General support questions should be discussed in the `#support`
channel on our community Slack team
at [atomist-community.slack.com][slack].

If you find a problem, please create an [issue][].

[issue]: https://github.com/atomist-rugs/aem-rugs/issues

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

```
$ git tag -a 1.2.3
```

The Travis CI build (see badge at the top of this page) will
automatically create a GitHub release using the tag name for the
release and the comment provided on the annotated tag as the contents
of the release notes.  It will also automatically upload the needed
artifacts.

---
Created by [Atomist][atomist].
Need Help?  [Join our Slack team][slack].

[atomist]: https://www.atomist.com/
[slack]: https://join.atomist.com/
