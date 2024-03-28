// node modules
import { inspect } from 'util'

// packages
import core from '@actions/core'

// modules
import main from './lib/index.js'

// parse inputs
const inputs = {
  github_token: core.getInput('github-token', { required: true }),
  workflow_ref: core.getInput('workflow-ref', { required: true }),
  run_id: core.getInput('run-id', { required: true }),
  delay: Number(core.getInput('delay', { required: true })),
  timeout: Number(core.getInput('timeout', { required: true }))
}

// error handler
function errorHandler ({ message, stack, request }) {
  core.error(`${message}\n${stack}`)

  // debugging for API calls
  if (request) {
    const { method, url, body, headers } = request
    core.debug(`${method} ${url}\n\n${inspect(headers)}\n\n${inspect(body)}`)
  }

  process.exit(1)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

await main(inputs)
