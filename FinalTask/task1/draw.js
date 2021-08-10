const os = require('os');
const calculate = require('./calculate');
const ONE_COLUMN = 2;
const TWO_COLUMNS = 3
const SECOND_VALUE = 2;
const SHIFT = 1;
const ONE = 1;

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

function makeLineWithJunction(result, data) {
    const size = calculateMaxColumnSize(data);

    console.log('makeLineWithJunction', size)
    const count = calculate.getColumnLength(data);
    console.log('aaaa', count)
    for (let i = 1; i < count; i++) {
        result = continueEqualityLine(result, size) + '╬';
    }

    return result;
}

function makeLineWithTJunction(result, data) {
    const size = calculateMaxColumnSize(data);
    console.log('makeLineWithTJunction', size)

    const count = calculate.getColumnLength(data);
    console.log('count', count)

    for (let i = 1; i < count; i++) {
        result = continueEqualityLine(result, size) + '╦';
    }

    return result;
}



function makeLineWithTUpJunction(result, data) {
    for (let i = 1; i < calculate.getColumnLength(data); i++) {
        console.log('makeLineWithTUpJunction', calculateMaxColumnSize(data))
        result = continueEqualityLine(result, calculateMaxColumnSize(data)) + '╩';
    }

    return result;
}

function getEmptyTable(name) {
    const result = makeLineForEmptyTable('╔', name) + addEndOfLineMarker('╗')
        + addEndOfLineMarker(getEmptyTableMessage(name)) + '╚';
    return makeLineForEmptyTable(result, name) + addEndOfLineMarker('╝');
}

function reverseMaxLength(name, maxLength) {
    if (name.toString().length > maxLength) {
        maxLength = name.toString().length;
    }

    return maxLength;
}

function updateMaxLength(names, maxLength) {
    for (const name of names) {
        maxLength = reverseMaxLength(name, maxLength);
    }

    return maxLength;
}

function getMaxColumnLength(array) {
    if (array.length <= 0) {
        return 0;
    }
    let maxLength = updateMaxLength(array[0].getColumnNames(), 0);

    for (const dataSet of array) {
        maxLength = updateMaxLength(dataSet.getValues(), maxLength);
    }

    return maxLength;
}

function calculateMaxColumnSize(array) {
    let maxColumnSize = getMaxColumnLength(array);
    if (maxColumnSize % 2 === 0) {
        return maxColumnSize + ONE_COLUMN;
    }

    return maxColumnSize + TWO_COLUMNS;
}

function getTruncatedLength(data, nameLength) {
    console.log('getTruncatedLength', calculateMaxColumnSize(data))
    return Math.trunc( (calculateMaxColumnSize(data) - nameLength) / ONE_COLUMN);
}

function addTextToTheCell(text, column) {
    return text[column].toString();
}

function getTextLength(text, column) {
    return addTextToTheCell(text, column).length;
}

function getPaddingWithNames(result, data, column) {
    const text = data[0].getColumnNames();
    const columnNamesLength = getTextLength(text, column);

    result = addSpaceToResult(result, getTruncatedLength(data, columnNamesLength))
        + addTextToTheCell(text, column);
    return addSpaceToResult(result, getTruncatedLength(data, columnNamesLength))
}

function getPaddingWithValues(result, data, values, column) {
    const columnNamesLength = getTextLength(values, column);

    result = addSpaceToResult(result, getTruncatedLength(data, columnNamesLength))
        + addTextToTheCell(values, column);
    return addSpaceToResult(result, getTruncatedLength(data, columnNamesLength))
}

function addShiftedSpaceToResult(result, data, length) {
    return addSpaceToResult(result, getTruncatedLength(data, length) + SHIFT)
}

function getPaddingWithShortColumn(result, data, column) {
    const names = data[0].getColumnNames();
    const columnNamesLength = getTextLength(names, column);

    result = addSpaceToResult(result, getTruncatedLength(data, columnNamesLength))
        + addTextToTheCell(names, column);
    return addShiftedSpaceToResult(result, data, columnNamesLength);
}

function addText(result, data, column) {
    const names = data[0].getColumnNames();

    if (getTextLength(names, column) % 2 === 0) {
        result = getPaddingWithNames(result, data, column)
    } else {
        result = getPaddingWithShortColumn(result, data, column)
    }

    return result;
}

function makeTextRow(result, data) {
    for (let i = 0; i < calculate.getColumnLength(data); i++) {
        result += addText('║', data, i);
    }

    return result;
}

function makeFullHorizontalLine(result, data) {
    console.log('makeFullHorizontalLine', calculateMaxColumnSize(data))
    const maxColumnSize = calculateMaxColumnSize(data);
    result = makeLineWithJunction(result, data)
    return continueEqualityLine(result, maxColumnSize);
}

function getHeaderOfTheTable(data) {
    console.log('getHeaderOfTheTable', calculateMaxColumnSize(data))
    const maxColumnSize = calculateMaxColumnSize(data);

    let result = makeLineWithTJunction('╔', data)
    result = continueEqualityLine(result, maxColumnSize) + addEndOfLineMarker('╗');
    result = makeTextRow(result, data) + addEndOfLineMarker('║');

    if (data.length > 0) {
        result += makeFullHorizontalLine('╠', data) + addEndOfLineMarker('╣')
    }
    return result;
}

function chainRows(result, data, column, i) {
    const values = data[column].getValues();
    const valuesLength = values[i].toString().length;

    if (valuesLength % 2 === 0) {
        result = getPaddingWithValues(result, data, values, i) + '║';
    } else {
        result = addSpaceToResult(result, getTruncatedLength(data, valuesLength)) + addTextToTheCell(values, i);
        result = addShiftedSpaceToResult(result, data, valuesLength) + '║';
    }
    return result;
}

function makeColumns(result, data, columns) {
    for (let i = 0; i < calculate.getColumnLength(data); i++) {
        result = chainRows(result, data, columns, i)
    }

    return result;
}

function makeOneColumn(result, data, columns) {
    if (columns < data.length - 1) {
        result += makeLineWithJunction('╠', data);
        result = continueEqualityLine(result, 16) + addEndOfLineMarker('╣');
    }

    return result;
}

function makeRows(data) {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += makeColumns('║', data, i) + addEndOfLineMarker();
        result = makeOneColumn(result, data, i)
    }

    return result;
}

function getStringTableData(data) {
    let result = makeRows(data);
    result += makeLineWithTUpJunction('╚', data);
    result = continueEqualityLine(result,  calculateMaxColumnSize(data)) + addEndOfLineMarker('╝');
    return result;
}




module.exports = {
    getTableString(data, tableName) {
    if (calculate.getMaxColumnLength(data) === 0) {
        return getEmptyTable(tableName);
    }

    return getHeaderOfTheTable(data) + getStringTableData(data);
}
}
