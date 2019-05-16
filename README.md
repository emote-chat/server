# Emote
> A mobile chat application with emoji reactions and NLP-generated emoji suggestions.

[![CircleCI](https://circleci.com/gh/emote-chat/server.svg?style=svg)](https://circleci.com/gh/emote-chat/server)
<!-- [![NPM Version][npm-image]][npm-url] -->
<!-- [![Downloads Stats][npm-downloads]][npm-url] -->

<!-- One to two paragraph statement about your product and what it does. -->

<!-- update later with screenshot or gif of application -->
![header](https://user-images.githubusercontent.com/29691658/56085479-a48e0c00-5e09-11e9-9a68-08c8d5cf93d0.png)

## Database Setup for UNIX-based Systems
<!-- remove next two steps later because we'll want to seed the database as part of running the server locally in 'development' mode -->

1. Install [PostgreSQL](https://www.postgresql.org/download/) **major version 11**. We recommend using [homebrew](https://brew.sh/).
1. Switch to the postgres UNIX account: `sudo -i -u postgres`
1. Create a username and password (replace `username` with desired username): `createuser username --pwprompt`
1. Enter password to be used for the user you just created
1. To create a database (replace `database` with desired database name): `createdb database`
1. To exit the postgres UNIX account: `exit`
1. Create a file named `.env` at the root of the project with the variables in `.env.example` and replace with the host, user, user password and database information for the databases you'll be using for development and testing respectively. `DEV_DB_HOST` and `TEST_DB_HOST` default to `localhost` so you don't have to include those variables if you plan to use `localhost`. It is suggested that you specify separate tables for `DEV_DB_NAME` and `TEST_DB_NAME` since the test suites will wipe the test database clean before running each test suite. *Please note that production database information is only accessible to the project owners.*

## Run Server

OS X, Linux and Windows:

```sh
npm install
npm start
```

## Run Tests
```sh
npm install
npm test
```

## NLP 

### Installation

1. Don't forget to define `TWITTER_USER`, `TWITTER_PASS`, `TWITTER_KEY` and `TWITTER_SECRET` in your `.env` file. *Refer to the `.env.example` to be sure you define the necessary environment variables.*
1. Update and activate the Anaconda virtual env:

```sh
conda env update -f nlp/env.yml --prune
conda activate emote
```

### Get More Tweets
* To use twitter stream (live tweets; *note that you must have [Twitter login verification](https://twitter.com/settings/account) (2-factor authentication) temporarily turned off* as the script uses your username and password to authenticate you along with your app key and secret to acquire the proper oauth v1.0 credentials &mdash; v2.0 is not available for streams):

```sh
python nlp/twitter.py
```

* To use twitter search and get 100 tweets at a time:

```sh
python nlp/twitter.py -se
```

## Read Tweets Pickle
```sh
python nlp/read.py
```

## Process Tweets Pickle
```sh
python nlp/process.py
```

<!-- ## Usage example -->

<!-- A few motivating and useful examples of how your product can be used. Spice this up with code blocks and potentially more screenshots.

_For more examples and usage, please refer to the [Wiki][wiki]._ -->

<!-- ## Development setup

Describe how to install all development dependencies and how to run an automated test-suite of some kind. Potentially do this for multiple platforms.

```sh
make install
npm test
``` -->

<!-- ## Release History

* 0.2.1
    * CHANGE: Update docs (module code remains unchanged)
* 0.2.0
    * CHANGE: Remove `setDefaultXYZ()`
    * ADD: Add `init()`
* 0.1.1
    * FIX: Crash when calling `baz()` (Thanks @GenerousContributorName!)
* 0.1.0
    * The first proper release
    * CHANGE: Rename `foo()` to `bar()`
* 0.0.1
    * Work in progress -->

## Meta

* Sonam Kindy – [@sonamdkindy](https://github.com/sonamdkindy)
* Michele Larson – [@mnicole](https://github.com/mnicole)
* Eric Newton – [@ernewtoner](https://github.com/ernewtoner)

Distributed under the Apache v2.0 license. See the [LICENSE](LICENSE) file for more information.

## Contributing

1. [Fork](https://help.github.com/en/articles/fork-a-repo#fork-an-example-repository) the repository
2. Create your feature branch on the forked repo (`git checkout -b feature/fooBar`)
3. Commit your changes to the forked repo (`git commit -am 'Added fooBar that does x, y, z'`)
4. Push the branch back to your forked repo (`git push origin feature/fooBar`)
5. Create a [pull request from your fork](https://help.github.com/en/articles/creating-a-pull-request-from-a-fork)

## Resources
* README template used is located [here](https://github.com/dbader/readme-template)
<!-- list other critical resources used -->

<!-- Markdown link & img dfn's -->
<!-- [npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki -->
