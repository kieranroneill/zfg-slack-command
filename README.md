[![CircleCI](https://circleci.com/gh/kieranroneill/zfg-slack-command/tree/master.svg?style=shield&circle-token=33b54b560c45e7fe1f6d4e44f069ed2a3f6d6dba)](https://circleci.com/gh/kieranroneill/zfg-slack-command/tree/master)

# Slack `/zfg` command

A custom Slack command that allows you to _express_ (ho, ho, ho... pun intended) how you give zero f*cks...

#### Table Of Contents

* [Requirements](#requirements)
* [Development](#development)
* [Testing](#testing)
* [Continuous integration](#continuous-integration)
    * [Deployment](#deployment)

## Requirements

In order to get started, you will need: 

* Install [Node](https://nodejs.org) (>= v6.10.0).
* Install [Yarn](https://yarnpkg.com).

## Development

1. Install the dependencies using `yarn install`
2. Run `yarn start`
3. Server[less] should be running on [http://localhost:1337](http://localhost:1337)

## Testing

Unit testing is performed using:

* [Mocha](https://mochajs.org/) for running the tests.
* [Chai](http://chaijs.com/) for assertions.

To run the unit tests simply run:
```bash
yarn test
```

## Continuous integration

### Deployment

The following environment variables are needed for deployment:

| Name | Description |
| :--- | :--- |
| `AWS_ACCESS_KEY_ID` | The AWS access key ID. |
| `AWS_SECRET_ACCESS_KEY` | The AWS secret access key used to deploy to S3. |
| `SLACK_TOKEN` | The validation token received from Slack when creating the slash command. |
