const os = require('os');

const VERTICAL_BORDERS = 2;

function tableLengthWithoutBorders(textTable) {
    return textTable.length - VERTICAL_BORDERS
}

function makeInnerHorizontalLine(result, name) {
    return makeHorizontalLine(result, tableLengthWithoutBorders(getTextEmptyTable(name)))
}

function makeHorizontalLine(result, size) {
    for (let i = 0; i < size; i++) {
        result += '═';
    }

    return result;
}

function getTextEmptyTable(name) {
    return '║ Table "' + name + '" is empty or does not exist ║';
}

function addEndOfLineMarker(element) {
    return element + os.EOL;
}

function getEmptyTable(tableName) {
    let result = '╔';
    result = makeInnerHorizontalLine(result, tableName);
    result += addEndOfLineMarker('╗');
    result += addEndOfLineMarker(getTextEmptyTable(tableName));
    result += '╚';
    result = makeInnerHorizontalLine(result, tableName);
    result += addEndOfLineMarker('╝');
    return result;
}

function checkDataSets(dataSets) {
    if (dataSets.length <= 0) {
        return 0
    }
}

function test(columnNames, maxLength) {
    for (const columnName of columnNames) {
        if (columnName.toString().length > maxLength) {
            maxLength = columnName.toString().length;
        }
    }

    return maxLength;
}

function getMaxColumnSize(dataSets) {
    if (dataSets.length <= 0) {
        return 0;
    }
    let maxLength = 0;

    const columnNames = dataSets[0].getColumnNames();
    maxLength = test(columnNames, maxLength)

    for (const dataSet of dataSets) {
        const values = dataSet.getValues();
        maxLength = test(values, maxLength)
    }

    return maxLength;
}

function getColumnCount(dataSets) {
    if (dataSets.length <= 0) {
        return 0;
    }
    return dataSets[0].getColumnNames().length;
}

function getHeaderOfTheTable(dataSets) {
    let maxColumnSize = getMaxColumnSize(dataSets);
    const columnCount = getColumnCount(dataSets);
    if (maxColumnSize % 2 === 0) {
        maxColumnSize += 2;
    } else {
        maxColumnSize += 3;
    }
    let result = '╔';
    for (let j = 1; j < columnCount; j++) {
        result =  makeHorizontalLine(result, maxColumnSize)
        result += '╦';
    }
    result =  makeHorizontalLine(result, maxColumnSize);
    result += addEndOfLineMarker('╗');
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
    result += addEndOfLineMarker('║');

    //last string of the header
    if (dataSets.length > 0) {
        result += '╠';
        for (let j = 1; j < columnCount; j++) {
            result = makeHorizontalLine(result, maxColumnSize)
            result += '╬';
        }
        result = makeHorizontalLine(result, maxColumnSize);
        result += addEndOfLineMarker('╣');
    } else {
        result += '╚';
        for (let j = 1; j < columnCount; j++) {
            result = makeHorizontalLine(result, maxColumnSize)
            result += '╩';
        }
        result = makeHorizontalLine(result, maxColumnSize)
        result += addEndOfLineMarker('╝');
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
            result += addEndOfLineMarker('╣');
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
    result += addEndOfLineMarker('╝');
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
