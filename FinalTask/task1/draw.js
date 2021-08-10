const os = require('os');
const calculate = require('./calculate');

function getEmptyTableMessage(name) {
    return '║ Table "' + name + '" is empty or does not exist ║';
}

function addEndOfLineMarker(element = '') {
    return element + os.EOL;
}

function makeLineForEmptyTable(result, text) {
    return continueEqualityLine(result, calculate.updateLength(getEmptyTableMessage(text)));
}

function continueEqualityLine(result, size) {
    for (let i = 0; i < size; i++) {
        result += '═';
    }

    return result;
}

function makeLineWithJunction() {
    let result = '╠';

    for (let i = 1; i < calculate.getColumnsQuantity(); i++) {
        result = continueEqualityLine(result, calculate.getSize()) + '╬';
    }

    return result;
}

function makeLineWithTJunction() {
    let result = '╔';

    for (let i = 1; i < calculate.getColumnsQuantity(); i++) {
        result = continueEqualityLine(result, calculate.getSize()) + '╦';
    }

    return result;
}

function makeLineWithTUpJunction() {
    let result = '╚';
    for (let i = 1; i < calculate.getColumnsQuantity(); i++) {
        result = continueEqualityLine(result, calculate.getSize()) + '╩';
    }

    return result;
}

function getEmptyTable(name) {
    const result = makeLineForEmptyTable('╔', name) + addEndOfLineMarker('╗')
        + addEndOfLineMarker(getEmptyTableMessage(name)) + '╚';
    return makeLineForEmptyTable(result, name) + addEndOfLineMarker('╝');
}

function makeColumns(columns) {
    let result = '║';
    for (let i = 0; i < calculate.getColumnsQuantity(); i++) {
        result = calculate.chainRows(result, columns, i)
    }
    return result;
}

function makeTextRow(result) {
    for (let i = 0; i < calculate.getColumnsQuantity(); i++) {
        result += calculate.addText(i);
    }

    return result;
}

function makeFullHorizontalLine() {
    return continueEqualityLine(makeLineWithJunction(), calculate.getSize());
}

function getHeaderOfTheTable() {
    let result = makeLineWithTJunction()
    result = continueEqualityLine(result, calculate.getSize()) + addEndOfLineMarker('╗');
    result = makeTextRow(result) + addEndOfLineMarker('║');

    if (calculate.getDataLength() > 0) {
        result += makeFullHorizontalLine() + addEndOfLineMarker('╣')
    }
    return result;
}

function startRow(result, columns) {
    if (columns < calculate.getDataLength() - 1) {
        result += makeLineWithJunction();
        result = continueEqualityLine(result, calculate.getSize()) + addEndOfLineMarker('╣');
    }
    return result;
}

function finishRows() {
    let result = '';
    for (let i = 0; i < calculate.getDataLength(); i++) {
        result += makeColumns(i) + addEndOfLineMarker();
        result = startRow(result, i)
    }

    return result;
}

function getStringTableData() {
    let result = finishRows();
    result += makeLineWithTUpJunction();
    result = continueEqualityLine(result, calculate.getSize()) + addEndOfLineMarker('╝');
    return result;
}

module.exports = {
    getTableString(name) {
        if (calculate.getColumnLength() === 0) {
            return getEmptyTable(name);
        }

        return getHeaderOfTheTable() + getStringTableData();
    }
}
