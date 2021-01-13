const os = require('os');

function getEmptyTable(tableName) {
    const textEmptyTable = '║ Table "' + tableName + '" is empty or does not exist ║';
    let result = '╔';
    for (let i = 0; i < textEmptyTable.length - 2; i++) {
        result += '═';
    }
    result += '╗' + os.EOL;
    result += textEmptyTable + os.EOL;
    result += '╚';
    for (let i = 0; i < textEmptyTable.length - 2; i++) {
        result += '═';
    }
    result += '╝' + os.EOL;
    return result;
}

function getMaxColumnSize(dataSets) {
    let maxLength = 0;
    if (dataSets.length > 0) {
        const columnNames = dataSets[0].getColumnNames();
        for (const columnName of columnNames) {
            if (columnName.length > maxLength) {
                maxLength = columnName.length;
            }
        }
        for (const dataSet of dataSets) {
            const values = dataSet.getValues();
            for (const value of values) {
                if (value.toString().length > maxLength) {
                    maxLength = value.toString().length;
                }
            }
        }
    }
    return maxLength;
}

function getColumnCount(dataSets) {
    const result = 0;
    if (dataSets.length > 0) {
        return dataSets[0].getColumnNames().length;
    }
    return result;
}

function getHeaderOfTheTable(dataSets) {
    let maxColumnSize = getMaxColumnSize(dataSets);
    let result = '';
    const columnCount = getColumnCount(dataSets);
    if (maxColumnSize % 2 === 0) {
        maxColumnSize += 2;
    } else {
        maxColumnSize += 3;
    }
    result += '╔';
    for (let j = 1; j < columnCount; j++) {
        for (let i = 0; i < maxColumnSize; i++) {
            result += '═';
        }
        result += '╦';
    }
    for (let i = 0; i < maxColumnSize; i++) {
        result += '═';
    }
    result += '╗' + os.EOL;
    const columnNames = dataSets[0].getColumnNames();
    for (let column = 0; column < columnCount; column++) {
        result += '║';
        const columnNamesLength = columnNames[column].length;
        if (columnNamesLength % 2 === 0) {
            for (let j = 0; j < (maxColumnSize - columnNamesLength) / 2; j++) {
                result += ' ';
            }
            result += columnNames[column].toString();
            for (let j = 0; j < (maxColumnSize - columnNamesLength) / 2; j++) {
                result += ' ';
            }
        } else {
            for (let j = 0; j < Math.trunc((maxColumnSize - columnNamesLength) / 2); j++) {
                result += ' ';
            }
            result += columnNames[column].toString();
            for (let j = 0; j <= Math.trunc((maxColumnSize - columnNamesLength) / 2); j++) {
                result += ' ';
            }
        }
    }
    result += '║' + os.EOL;

    //last string of the header
    if (dataSets.length > 0) {
        result += '╠';
        for (let j = 1; j < columnCount; j++) {
            for (let i = 0; i < maxColumnSize; i++) {
                result += '═';
            }
            result += '╬';
        }
        for (let i = 0; i < maxColumnSize; i++) {
            result += '═';
        }
        result += '╣' + os.EOL;
    } else {
        result += '╚';
        for (let j = 1; j < columnCount; j++) {
            for (let i = 0; i < maxColumnSize; i++) {
                result += '═';
            }
            result += '╩';
        }
        for (let i = 0; i < maxColumnSize; i++) {
            result += '═';
        }
        result += '╝' + os.EOL;
    }
    return result;
}

function getStringTableData(dataSets) {
    const rowsCount = dataSets.length;
    let maxColumnSize = getMaxColumnSize(dataSets);
    let result = '';
    if (maxColumnSize % 2 === 0) {
        maxColumnSize += 2;
    } else {
        maxColumnSize += 3;
    }
    const columnCount = getColumnCount(dataSets);
    for (let row = 0; row < rowsCount; row++) {
        const values = dataSets[row].getValues();
        result += '║';
        for (let column = 0; column < columnCount; column++) {
            const valuesLength = values[column].toString().length;
            if (valuesLength % 2 === 0) {
                for (let j = 0; j < (maxColumnSize - valuesLength) / 2; j++) {
                    result += ' ';
                }
                result += values[column].toString();
                for (let j = 0; j < (maxColumnSize - valuesLength) / 2; j++) {
                    result += ' ';
                }
                result += '║';
            } else {
                for (let j = 0; j < Math.trunc((maxColumnSize - valuesLength) / 2); j++) {
                    result += ' ';
                }
                result += values[column].toString();
                for (let j = 0; j <= Math.trunc((maxColumnSize - valuesLength) / 2); j++) {
                    result += ' ';
                }
                result += '║';
            }
        }
        result += os.EOL;
        if (row < rowsCount - 1) {
            result += '╠';
            for (let j = 1; j < columnCount; j++) {
                for (let i = 0; i < maxColumnSize; i++) {
                    result += '═';
                }
                result += '╬';
            }
            for (let i = 0; i < maxColumnSize; i++) {
                result += '═';
            }
            result += '╣' + os.EOL;
        }
    }
    result += '╚';
    for (let j = 1; j < columnCount; j++) {
        for (let i = 0; i < maxColumnSize; i++) {
            result += '═';
        }
        result += '╩';
    }
    for (let i = 0; i < maxColumnSize; i++) {
        result += '═';
    }
    result += '╝' + os.EOL;
    return result;
}

function getTableString(data, tableName) {
    const maxColumnSize = getMaxColumnSize(data);
    if (maxColumnSize === 0) {
        return getEmptyTable(tableName);
    } else {
        return getHeaderOfTheTable(data) + getStringTableData(data);
    }
}

module.exports = class Print {
    constructor(view, manager) {
        this.view = view;
        this.manager = manager;
    }

    canProcess(command) {
        return command.startsWith('print ');
    }

    process(input) {
        const command = input.split(' ');
        if (command.length !== 2) {
            throw new TypeError('Incorrect number of parameters. Expected 1, got ' + (command.length - 1));
        }
        const tableName = command[1];
        const data = this.manager.getTableData(tableName);
        this.view.write(getTableString(data, tableName));
    }
};
