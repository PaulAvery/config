/* Load dependencies */
import set from 'set-value';
import get from 'get-value';
import dotenv from 'dotenv';

/* Load dotenv to allow setting environment in config file */
dotenv.config({ silent: true });

export default function(name, defaults, env = process.env) {
	(function createMappings(envPath, optionPath) {
		let option = optionPath.length > 0 ? get(defaults, optionPath) : defaults;

		/* Small utility to copy a specific environment var to the defaults object */
		function map(parser) {
			if (env[envPath]) {
				set(defaults, optionPath, parser(env[envPath]));
			}
		}

		/* Parse environment vars into same types as default values */
		switch(typeof option) {
			case 'string':
				/* Copy a string as is */
				map(x => x);
				break;

			case 'boolean':
				/* Parse a boolean (anything but TRUE is false) */
				map(x => x.toUpperCase() === 'TRUE');
				break;

			case 'number':
				/* Parse a number */
				map(x => parseFloat(x));
				break;

			case 'object':
				/*
				 * Loop through all properties so that OBJECT_PROPERTY copies to object.property
				 */
				Object.keys(option).forEach(
					key => createMappings(
						envPath + '_' + key.toUpperCase(),
						optionPath.concat(key)
					)
				);
				break;

			default:
				throw new Error(`Type ${typeof option} not supported`);
		}
	})([name.toUpperCase()], []);

	return defaults;
}
