const Program = require('commander')

const command = Program.command
Program.command = (...args) => {
  return ConvictCommander(command.apply(Program, args))
}

function ConvictCommander(commander) {
  function recurs(convict, schema, path) {
    schema || (schema = convict._def)
    path || (path = [])
    const keys = Object.keys(schema)
    keys.forEach(function(paramName) {
      const param = schema[paramName];
      const subPath = [...path, paramName]

      if (typeof param === 'object' && ( typeof param.doc === 'undefined' )) {
        recurs(convict, param, subPath)
        return;
      }

      if (!param.arg) {
        return;
      }

      const def = '--' + param.arg + ( param.format !== Boolean ? ' <' + paramName + '>' : '' );

      const opts = []
      if (param.default) {
        opts.push('default: ' + param.default)
      }
      if (typeof param.env !== 'undefined') {
        opts.push('env: ' + param.env)
      }

      const doc = param.doc + (param.default == null ? ' (mandatory)' : ' [' + opts.join(', ') + ']');

      commander.option(def, doc);
    });
  };

  commander.convict = function conv(convict) {
    recurs(convict);
    return this;
  };

  return commander;
};

module.exports = ConvictCommander(Program)
