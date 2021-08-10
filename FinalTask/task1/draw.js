const os = require('os');
const calculate = require('./calculate');

const ONE_COLUMN = 2;
const SHIFT = 1;

function getEmptyTableMessage(name) {
    return '║ Table "' + name + '" is empty or does not exist ║';
}

function addEndOfLineMarker(element = '') {
    return element + os.EOL;
}

function updateLength(text) {
    return text.length - ONE_COLUMN;
}

function makeLineForEmptyTable(result, text) {
    return continueEqualityLine(result, updateLength(getEmptyTableMessage(text)));
}

function continueEqualityLine(result, size) {
    for (let i = 0; i < size; i++) {
        result += '═';
    }

    return result;
}

function addSpaceToResult(result, size) {
    for (let i = 0; i < size; i++) {
        result += ' ';
    }

    return result;
}

function makeLineWithJunction(data) {
    const size = calculate.calculateColumnSize(data);
    const count = calculate.getColumnsQuantity(data);
    let result = '╠';

    for (let i = 1; i < count; i++) {
        result = continueEqualityLine(result, size) + '╬';
    }

    return result;
}

function makeLineWithTJunction(data) {
    const size = calculate.calculateColumnSize(data);
    const count = calculate.getColumnsQuantity(data);
    let result = '╔';

    for (let i = 1; i < count; i++) {
        result = continueEqualityLine(result, size) + '╦';
    }

    return result;
}

function makeLineWithTUpJunction(data) {
    let result = '╚';
    for (let i = 1; i < calculate.getColumnsQuantity(data); i++) {
        result = continueEqualityLine(result, calculate.calculateColumnSize(data)) + '╩';
    }

    return result;
}

function getEmptyTable(name) {
    const result = makeLineForEmptyTable('╔', name) + addEndOfLineMarker('╗')
        + addEndOfLineMarker(getEmptyTableMessage(name)) + '╚';
    return makeLineForEmptyTable(result, name) + addEndOfLineMarker('╝');
}

function addTextToTheCell(text, column) {
    return text[column].toString();
}

function getTextLength(text, column) {
    return addTextToTheCell(text, column).length;
}

function getPaddingWithNames(result, data, column) {
    const text = data[0].getColumnNames();
    const namesLength = getTextLength(text, column);

    result = addSpaceToResult(result, calculate.getTruncatedLength(data, namesLength))
        + addTextToTheCell(text, column);
    return addSpaceToResult(result, calculate.getTruncatedLength(data, namesLength))
}

function getPaddingWithValues(result, data, values, column) {
    const namesLength = getTextLength(values, column);

    result = addSpaceToResult(result, calculate.getTruncatedLength(data, namesLength))
        + addTextToTheCell(values, column);
    return addSpaceToResult(result, calculate.getTruncatedLength(data, namesLength))
}

function chainRows(result, data, columns, i) {

    const values = data[columns].getValues();
    const valuesLength = values[i].toString().length;
    if (valuesLength % 2 === 0) {
        result = getPaddingWithValues(result, data, values, i) + '║';
    } else {
        result = addSpaceToResult(result, calculate.getTruncatedLength(data, valuesLength)) + addTextToTheCell(values, i);
        result = addShiftedSpaceToResult(result, data, valuesLength) + '║';
    }

    return result;
}

function makeColumns(data, columns) {
    let result = '║';
    for (let i = 0; i < calculate.getColumnsQuantity(data); i++) {
        result = chainRows(result, data, columns, i)
    }
    return result;
}

function addShiftedSpaceToResult(result, data, length) {
    return addSpaceToResult(result, calculate.getTruncatedLength(data, length) + SHIFT)
}

function getPaddingWithShortColumn(result, data, column) {
    const names = data[0].getColumnNames();
    const namesLength = getTextLength(names, column);

    result = addSpaceToResult(result, calculate.getTruncatedLength(data, namesLength))
        + addTextToTheCell(names, column);
    return addShiftedSpaceToResult(result, data, namesLength);
}

function addText(data, column) {
    const names = data[0].getColumnNames();
    let result = '║';

    if (getTextLength(names, column) % 2 === 0) {
        result = getPaddingWithNames(result, data, column)
    } else {
        result = getPaddingWithShortColumn(result, data, column)
    }

    return result;
}

function makeTextRow(result, data) {
    for (let i = 0; i < calculate.getColumnsQuantity(data); i++) {
        result += addText(data, i);
    }

    return result;
}

function makeFullHorizontalLine(data) {
    const maxColumnSize = calculate.calculateColumnSize(data);
    return continueEqualityLine(makeLineWithJunction(data), maxColumnSize);
}

function getHeaderOfTheTable(data) {
    const maxColumnSize = calculate.calculateColumnSize(data);

    let result = makeLineWithTJunction(data)
    result = continueEqualityLine(result, maxColumnSize) + addEndOfLineMarker('╗');
    result = makeTextRow(result, data) + addEndOfLineMarker('║');

    if (data.length > 0) {
        result += makeFullHorizontalLine(data) + addEndOfLineMarker('╣')
    }
    return result;
}

function startRow(result, data, columns) {
    if (columns < data.length - 1) {
        result += makeLineWithJunction(data);
        result = continueEqualityLine(result, calculate.calculateColumnSize(data)) + addEndOfLineMarker('╣');
    }
    return result;
}

function finishRows(data) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += makeColumns(data, i) + addEndOfLineMarker();
        result = startRow(result, data, i)
    }

    return result;
}

function getStringTableData(data) {
    let result = finishRows(data);
    result += makeLineWithTUpJunction(data);
    result = continueEqualityLine(result, calculate.calculateColumnSize(data)) + addEndOfLineMarker('╝');
    return result;
}

module.exports = {
    getTableString(data, tableName) {
        if (calculate.getColumnLength(data) === 0) {
            return getEmptyTable(tableName);
        }

        return getHeaderOfTheTable(data) + getStringTableData(data);
    }
}
