# GitHub Action: Workflow Run Queue

If the same workflow is already running from a previous commit, wait for it to finish

[![license][license-img]][license-url]
[![release][release-img]][release-url]

<details>
  <summary><strong>Why?</strong></summary>

Workflows run on every commit asynchronously, this is fine for most cases, however, you might want to wait for a previous commit workflow to finish before running another one, some example use-cases:

- Deployment workflows
- Terraform workflows
- Database Migrations

</details>

## Usage

###### `.github/workflows/my-workflow.yml`

```yaml
jobs:
  xyz:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: durable-code/workflow-queue
        with:
          workflow-ref: ${{ github.workflow_ref }}
          run-id: ${{ github.run_id }}

      # only runs additional steps if there is no other instance of `my-workflow.yml` currently running
```

### Inputs

| input          | required | default        | description                                             |
| -------------- | -------- | -------------- | ------------------------------------------------------- |
| `github-token` | ❌       | `github.token` | The GitHub token used to call the GitHub API            |
| `workflow-ref` | ✅       | -              | The `${{ github.workflow_ref }}` of the caller workflow |
| `workflow-ref` | ✅       | -              | The `${{ github.run_id }}` of the caller workflow       |
| `timeout`      | ❌       | `600000`       | timeout before we stop trying (in milliseconds)         |
| `delay`        | ❌       | `10000`        | delay between status checks (in milliseconds)           |


----
> Author: [Ahmad Nassri](https://www.ahmadnassri.com/) &bull;
> Twitter: [@AhmadNassri](https://twitter.com/AhmadNassri)

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/ahmadnassri/action-workflow-queue

[release-url]: https://github.com/ahmadnassri/action-workflow-queue/releases
[release-img]: https://badgen.net/github/release/ahmadnassri/action-workflow-queue
