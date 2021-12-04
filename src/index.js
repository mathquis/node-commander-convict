const Program = require('commander')

class ConvictedCommand extends Program.Command {
	convict(convict) {
		this._walkConvict(convict);
		return this;
	}

	_walkConvict(convict, schema, path) {
		schema || (schema = convict._def);
		path || (path = []);
		const keys = Object.keys(schema);
		const self = this;
		keys.forEach(function(paramName) {
			const param = schema[paramName];
			const subPath = [...path, paramName];

			if (typeof param === 'object' && ( typeof param.doc === 'undefined' )) {
				self._walkConvict(convict, param, subPath);
				return;
			}

			if (!param.arg) {
				return;
			}

			const def = '--' + param.arg + ( param.format !== Boolean ? ' <' + paramName + '>' : '' );

			const opts = [];
			if (param.default) {
				opts.push('default: ' + param.default);
			}
			if (typeof param.env !== 'undefined') {
				opts.push('env: ' + param.env);
			}

			const doc = param.doc + (param.default == null ? ' (mandatory)' : ' [' + opts.join(', ') + ']');

			self.option(def, doc);
		});
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