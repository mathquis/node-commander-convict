const Program = require('commander')

class ConvictedCommand extends Program.Command {
	convict(convict, options) {
		options || (options = {});
		const help = this._walkConvict(convict);
		if (options.withHelp) {
			help.push('\u001B[90m# ---\u001B[39m');
			this.addHelpText('after', `\n${help.join('\n')}`);
		}
		return this;
	}

	_walkConvict(convict, schema, path, help) {
		schema || (schema = convict.getSchema()._cvtProperties || {});
		path || (path = []);
		help || (help = [
			'\u001B[90m# --------------------------------',
			'# Configurations',
			'# --------------------------------\u001B[39m'
		]);
		const keys = Object.keys(schema);
		const self = this;
		keys.forEach(function(paramName) {
			const param = schema[paramName];

			if (!(typeof param === 'object')) {
				return;
			}

			const subPath = [...path, paramName];

			const indent = ''.padStart(path.length * 2, ' ');

			if (param._cvtProperties) {
				help.push(indent + '\u001B[1m' + paramName + '\u001B[22m:')
				self._walkConvict(convict, param._cvtProperties, subPath, help);
				return;
			}

			if (param.arg) {
				// Commander option
				const definition = '--' + param.arg + ( param.format !== Boolean ? ' <' + paramName + '>' : '' );

				const doc = param.doc;

				self.option(definition, doc);
			}

			// Help
			help.push(indent + '\u001B[90m# ' + ( param.doc || paramName ))
			if (param.env) {
				help.push(indent + '# env: ' + param.env);
			}
			if (Array.isArray(param.format)) {
				help.push(indent + '# format:');
				param.format.forEach(format => help.push(indent + '#   - ' + format));
			} else if (typeof param.format === 'string') {
				help.push(indent + '# format: ' + param.format);
			}
			let defaultValue = param.default
			if (Array.isArray(defaultValue)) {
				defaultValue = '';
			} else if (typeof defaultValue === 'object') {
				defaultValue = '';
			} else if (typeof defaultValue === 'string') {
				defaultValue = '"' + defaultValue + '"';
			}

			help.push('\u001B[39m\r' + indent + '\u001B[1m' + paramName + '\u001B[22m: \u001B[36m' + defaultValue + '\u001B[39m');

			if (Array.isArray(param.default)) {
				help.push(indent + '\u001B[90m#   - value\u001B[39m');
			} else if (typeof param.default === 'object') {
				help.push(indent + '\u001B[90m#   key: value\u001B[39m');
			}
		});

		return help;
	};

	createCommand(name) {
		return new ConvictedCommand(name);
	};
}

exports = module.exports = new ConvictedCommand();
exports.program = exports;

/**
 * Expose classes
 */

exports.Argument = Program.Argument;
exports.Command = ConvictedCommand;
exports.CommanderError = Program.CommanderError;
exports.Help = Program.Help;
exports.InvalidArgumentError = Program.InvalidArgumentError;
exports.InvalidOptionArgumentError = Program.InvalidArgumentError; // Deprecated
exports.Option = Program.Option;