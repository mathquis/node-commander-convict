# node-commander-convict

Inspired by https://github.com/jmendiara/convict-commander

## Installation

`npm install @mathquis/node-commander-convict`

## Usage
```javascript
const Program = require('@mathquis/node-commander-convict');
const Convict = require('convict');

const config = Convict({
	test: {
	    doc: '',
	    format: String,
	    default: 'convicted'
    }
});

const cmdConfig = Convict({
	cmdTest: {
	    doc: '',
	    format: String,
	    default: 'cmd-convicted'
    }
});

Program
    .convict(config)
    .command('cmd')
	    .convict(cmdConfig)
    .parse( process.argv );

console.log(config.get('test'));
console.log(cmdConfig.get('cmdTest'));
```