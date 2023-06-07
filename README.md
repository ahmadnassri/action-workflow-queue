# GitHub Action: Workflow Run Wait

If the same workflow is already running from a previous commit, wait for it to finish

[![license][license-img]][license-url]
[![test][test-img]][test-url]

<details>
  <summary><strong>Why?</strong></summary>

Workflows run on every commit asynchronously, this is fine for most cases, however, you might want to wait for a previous commit workflow to finish before running another one, some example use-cases:

-   Deployment workflows
-   Terraform workflows
-   Database Migrations

</details>

## Usage

###### `.github/workflows/my-workflow.yml`

``` yaml
jobs:
  xyz:
    runs-on: ubuntu-latest

    steps:
      - uses: joreetz-otto/action-workflow-queue@v2.0.3

      # only runs additional steps if there is no other instance of `my-workflow.yml` currently running
```

### Inputs

| input          | required | default        | description                                     |
|----------------|----------|----------------|-------------------------------------------------|
| `github-token` | ❌        | `github.token` | The GitHub token used to call the GitHub API    |
| `timeout`      | ❌        | `600000`       | timeout before we stop trying (in milliseconds) |
| `delay`        | ❌        | `10000`        | delay between status checks (in milliseconds)   |

----
> Author: [Ahmad Nassri](https://www.ahmadnassri.com/) &bull;
> Maintainer: [Jonas Reetz] &bull;

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/joreetz-otto/action-workflow-queue

[test-url]: https://github.com/joreetz-otto/action-workflow-queue/actions?query=workflow%3Atest
[test-img]: https://github.com/joreetz-otto/action-workflow-queue/workflows/test/badge.svg
