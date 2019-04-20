# Emote
> A mobile chat application with emoji reactions and NLP-generated emoji suggestions.

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url] -->

<!-- One to two paragraph statement about your product and what it does. -->

<!-- update later with screenshot or gif of application -->
![header](https://user-images.githubusercontent.com/29691658/56085479-a48e0c00-5e09-11e9-9a68-08c8d5cf93d0.png)

## Database Setup for UNIX Based Systems

1. Install [PostgreSQL](https://www.postgresql.org/download/) >=10 on your given system
2. Switch to the postgres UNIX account: `sudo -i -u postgres`
3. Create a username and password (often the same as your UNIX account): `createuser myUsername --pwprompt`
4. Create a database (often the same name as the username): `createdb myUsername`
5. Exit the postgres UNIX account: `exit`
6. Access the postgres prompt of the user and database you created: `psql -h localhost -d myDatabase -U myUsername`
7. Import table initialization queries at the root of the project: `\i /pathtoproject/init_tables.sql`
8. Import test data queries at the root of the project: `\i /pathtoproject/init_test_data.sql`
9. Exit postgres prompt: `\q`
10. Create a file named '.env' at the root of the project and fill in with postgres user details:
```sh
DB_HOST=localhost
DB_PORT=5432
DB_USER=myUsername
DB_PASS=myPassword
```

## Application Installation

OS X, Linux and Windows:

```sh
npm install
npm start
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
* Eric Newtoner – [@ernewtoner](https://github.com/ernewtoner)
* Michele Larson – [@mnicole](https://github.com/mnicole)

Distributed under the GNU GPLv3 license. See the [LICENSE](LICENSE) file for more information.

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
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[wiki]: https://github.com/yourname/yourproject/wiki
