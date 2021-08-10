const calculate = require('./calculate');
const draw = require('./draw');
const SECOND_VALUE = 2;

module.exports = class Print {
    constructor(view, manager) {
        this.view = view;
        this.manager = manager;
    }

    canProcess(command) {
        return command.startsWith('print ');
    }

    process(input) {
        const command = this.splitInput(input);
        this.getIncorrectNumberOfParametersError(command);
        this.makeView(command);
    }

    makeView(command) {
        const tableName = command[1];
        calculate.setData(this.manager.getTableData(tableName));
        this.view.write(draw.getTableString(tableName));
    }

    getIncorrectNumberOfParametersError(command) {
        if (command.length !== SECOND_VALUE) {
            throw new TypeError('Incorrect number of parameters. Expected 1, got ' + this.getNumberOfParams(command));
        }
    }

    splitInput(input) {
        return input.split(' ');
    }

    getNumberOfParams(command) {
        return command.length - 1;
    }
};

