# An environment config loader
This module allows you to easily load your apps configuration from environment variables.
You specify a default config object, and the module parses environment variables based on that objects structure and data types.

**Setup:**
```js
import config from '@paulavery/config';

let settings = config('appName', {
	serverUrl: 'http://github.com/',
	mysql: {
		db: 'app-name',
		host: 'localhost',
		port: 3306,
		user: 'root'
	}
});
```

**Variables:**
```
APPNAME_SERVERURL='http://dev.github.com/'
APPNAME_MYSQL_DB=app-name-dev
APPNAME_MYSQL_PORT=2207
```

**Result:**
```js
{
	serverUrl: 'http://dev.github.com/',
	mysql: {
		db: 'app-name-dev',
		host: 'localhost',
		port: 2207,
		user: 'root'
	}
}
```

Supported datatypes are `string`, `number`, `boolean` and obviously `object`.

To make specifying local configs easy, it also uses the [dotenv](https://www.npmjs.com/package/dotenv) package to load a '.env' file with environment variables.
