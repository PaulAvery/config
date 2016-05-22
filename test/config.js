/* eslint no-shadow: "off" */
import test from 'ava-spec';
import config from '../src';

let throwData = [
	() => { },
	undefined
];

let testData = [{
	defaultValue: 'string',
	configValues: {
		'TestString': 'TestString',
		'FALSE': 'FALSE',
		'TRUE': 'TRUE'
	}
}, {
	defaultValue: true,
	configValues: {
		'something else': false,
		'FALSE': false,
		'false': false,
		'TRUE': true,
		'true': true
	}
}, {
	defaultValue: 12,
	configValues: {
		'122': 122,
		'-12': -12,
		'9.5': 9.5,
		'9,5': 9
	}
}];

test.beforeEach(() => {
	process.env = {};
});

testData.forEach(data => {
	test.group(`A value of type "${typeof data.defaultValue}"`, test => {
		test.group('is copied over correctly', test => {
			test.group('if attached directly', test => {
				test.group('to an environment object', test => {
					Object.keys(data.configValues).forEach(key => {
						let value = data.configValues[key];

						test(`with value '${value}'`, t => {
							let defaults = { value: data.defaultValue };

							let settings = config('name', defaults, { 'NAME_VALUE': key });
							t.deepEqual(settings, { value: value });
						});
					});
				});

				test.group('to the process.env object', test => {
					Object.keys(data.configValues).forEach(key => {
						let value = data.configValues[key];

						test(`with value [${value}](${typeof value})`, t => {
							let defaults = { value: data.defaultValue };
							process.env = { 'NAME_VALUE': key };

							let settings = config('name', defaults);
							t.deepEqual(settings, { value: value });
						});
					});
				});
			});

			test.group('if attached to a nested object', test => {
				test.group('to an environment object', test => {
					Object.keys(data.configValues).forEach(key => {
						let value = data.configValues[key];

						test(`with value [${value}](${typeof value})`, t => {
							let defaults = { object: { value: data.defaultValue } };

							let settings = config('name', defaults, { 'NAME_OBJECT_VALUE': key });
							t.deepEqual(settings, { object: { value: value } });
						});
					});
				});

				test.group('to the process.env object', test => {
					Object.keys(data.configValues).forEach(key => {
						let value = data.configValues[key];

						test(`with value [${value}](${typeof value})`, t => {
							let defaults = { object: { value: data.defaultValue } };
							process.env = { 'NAME_OBJECT_VALUE': key };

							let settings = config('name', defaults);
							t.deepEqual(settings, { object: { value: value } });
						});
					});
				});
			});
		});

		test.group('is left at its default value if not attached', test => {
			test('to an environment object', t => {
				let defaults = {value: data.defaultValue};

				let settings = config('name', defaults, {});
				t.deepEqual(settings, defaults);
			});

			test('to the process.env object', t => {
				let defaults = { value: data.defaultValue };

				let settings = config('name', defaults);
				t.deepEqual(settings, defaults);
			});
		});
	});
});

throwData.forEach(value => {
	test(`Value of type ${typeof value} throws`, t => {
		let defaults = { value: value };
		t.throws(() => config('name', defaults));
	});
});
