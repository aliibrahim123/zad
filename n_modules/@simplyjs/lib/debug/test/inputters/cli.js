//cli inputter

import make from '../../../cli/base.js';

var cliInputter = (run, logger, name = 'runner') => {
	var cli = make(name, 'run tests', '', { logHelpIfEmptyArgs: false });
	cli.argument('[...suites]', 'suites to run', [''])
	  .option(['-t', '--tags'], '<...tags>', 'include only tests that include these tags')
	  .option(['-i', '--interval'], '<ms>', 'interval', 20, { type: 'number in ms' })
	  .handle(({suites, tags, interval}) => run(suites, {tags, interval}, logger));
	return cli
}

export default cliInputter;

if (globalThis.$test) $test.cliInputter = cliInputter;