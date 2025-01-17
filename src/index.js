#!/usr/bin/env node
const cactus = require('./cactus');
const yargs = require('yargs');
const logger = require('winston');
logger.cli();

function wrap(fn) {
  return function(args) {
    fn(args).then(logger.info, logger.error);
  }
}

yargs
  .usage('git cactus <command>')
  .demandCommand(1, 'You need to provide a cactus command')
  .command('cut [level]', 'cuts a release branch from origin/master', (yargs) => {
    yargs
      .positional('level', {
        choices: ['major', 'minor'],
        default: 'minor',
        describe: 'The level of the release'
      });
  }, wrap(cactus.cutReleaseBranch))
  .command('tag', 'tags a version on a release branch', () => {}, wrap(cactus.tagVersion))
  .group(['upstream'], 'Git Options:')
  .option('upstream', { default: 'origin', describe: 'Upstream remote name'})
  .group(['master'], 'Git Options:')
  .option('master', { default: 'master', describe: 'The name of the default/primary branch'})
  .example('git cactus cut', 'Cuts a new release branch (minor)')
  .example('git cactus tag', 'Tags a new version (patch)')
  .argv
