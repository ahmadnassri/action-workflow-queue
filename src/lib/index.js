/* eslint-disable camelcase */

// packages
import core from '@actions/core'
import github from '@actions/github'

// modules
import runs from './runs.js'

// sleep function
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default async function ({ token, delay, timeout }) {
  let timer = 0

  // init octokit
  const octokit = github.getOctokit(token)

  // extract runId
  const { runId: run_id } = github.context

  // get workflow id and created date from run id
  const { data: { workflow_id, run_started_at } } = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}', {
    ...github.context.repo,
    run_id
  })

  // date to check against
  const before = new Date(run_started_at)

  core.info(`searching for workflow runs before ${before}`)

  // get previous runs
  let waiting_for = await runs({ octokit, run_id, workflow_id, before })

  if (waiting_for.length === 0) {
    core.info('no active run of this workflow found')
    process.exit(0)
  }

  // if one of them is not completed
  while (waiting_for.find(run => run.status !== 'completed')) {
    timer += delay

    // time out!
    if (timer >= timeout) {
      core.setFailed('workflow-queue timed out')
      process.exit(1)
    }

    for (const run of waiting_for) {
      core.info(`waiting for run #${run.id}: current status: ${run.status}`)
    }

    // zzz
    await sleep(delay)

    // get the data again
    waiting_for = await runs({ octokit, run_id, workflow_id, before })
  }

  core.info('all runs in the queue completed!')
}
