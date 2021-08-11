const os = require('os');
const calculate = require('./calculate');

const SHIFT = 1;
const VERTICAL_LINE = '║';
const JUNCTION = '╬';
const T_JUNCTION = '╦';
const T_UP_JUNCTION = '╩';
const T_RIGHT_JUNCTION = '╠';
const T_LEFT_JUNCTION = '╣';
const LEFT_TOP_CORNER = '╔';
const LEFT_BOTTOM_CORNER = '╚';
const RIGHT_TOP_CORNER = '╗';
const RIGHT_BOTTOM_CORNER = '╝';

function getEmptyTableMessage(name) {
    return `${VERTICAL_LINE} Table "${name}" is empty or does not exist ${VERTICAL_LINE}`;
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
    let result = T_RIGHT_JUNCTION;

    for (let i = 1; i < calculate.getColumnsQuantity(); i++) {
        result = continueEqualityLine(result, calculate.getSize()) + JUNCTION;
    }

    return result;
}

function makeLineWithTJunction() {
    let result = LEFT_TOP_CORNER;

    for (let i = 1; i < calculate.getColumnsQuantity(); i++) {
        result = continueEqualityLine(result, calculate.getSize()) + T_JUNCTION;
    }

    return result;
}

function makeLineWithTUpJunction() {
    let result = LEFT_BOTTOM_CORNER;
    for (let i = 1; i < calculate.getColumnsQuantity(); i++) {
        result = continueEqualityLine(result, calculate.getSize()) + T_UP_JUNCTION;
    }

    return result;
}

function getEmptyTable(name) {
    const result = makeLineForEmptyTable(LEFT_TOP_CORNER, name) + addEndOfLineMarker(RIGHT_TOP_CORNER)
        + addEndOfLineMarker(getEmptyTableMessage(name)) + LEFT_BOTTOM_CORNER;
    return makeLineForEmptyTable(result, name) + addEndOfLineMarker(RIGHT_BOTTOM_CORNER);
}

function addColumnSpaces(result, size) {
    for (let i = 0; i < size; i++) {
        result += ' ';
    }

    return result;
}

function getPaddingWithValues(result, values, column) {
    const namesLength = getTextLength(values, column);

    result = addColumnSpaces(result, calculate.getTruncatedLength(namesLength))
        + addTextToTheCell(values, column);
    return addColumnSpaces(result, calculate.getTruncatedLength(namesLength));
}
function addShiftedSpaceToResult(result, length) {
    return addColumnSpaces(result, calculate.getTruncatedLength(length) + SHIFT)
}

function chainRows(result, columns, quantity) {
    const values = calculate.getColumnValues(columns);
    const valuesLength = values[quantity].toString().length;

    if (valuesLength % 2 === 0) {
        result = getPaddingWithValues(result, values, quantity) + VERTICAL_LINE;
    } else {
        result = addColumnSpaces(result, calculate.getTruncatedLength(valuesLength)) + addTextToTheCell(values, quantity);
        result = addShiftedSpaceToResult(result, valuesLength) + VERTICAL_LINE;
    }

    return result;
}

function makeColumns(columns) {
    let result = VERTICAL_LINE;
    for (let i = 0; i < calculate.getColumnsQuantity(); i++) {
        result = chainRows(result, columns, i)
    }
    return result;
}

function addTextToTheCell(text, column) {
    return text[column].toString();
}

function getTextLength(text, column) {
    return addTextToTheCell(text, column).length;
}

function getPaddingWithNames(column) {
    const text = calculate.getNames();
    const namesLength = getTextLength(text, column);

    let result = addColumnSpaces(VERTICAL_LINE, calculate.getTruncatedLength(namesLength))
        + addTextToTheCell(text, column);
    return addColumnSpaces(result, calculate.getTruncatedLength(namesLength))
}

function getPaddingWithShortColumn(column) {
    const names = calculate.getNames();
    const namesLength = getTextLength(names, column);

    let result = addColumnSpaces(VERTICAL_LINE, calculate.getTruncatedLength(namesLength))
        + addTextToTheCell(names, column);
    return addShiftedSpaceToResult(result, namesLength);
}

function addText(columns) {
    if (getTextLength(calculate.getNames(), columns) % 2 === 0) {
        return getPaddingWithNames(columns);
    }

    return getPaddingWithShortColumn(columns);
}

function makeTextRow(result) {
    for (let i = 0; i < calculate.getColumnsQuantity(); i++) {
        result += addText(i);
    }

    return result;
}

function makeFullHorizontalLine() {
    return continueEqualityLine(makeLineWithJunction(), calculate.getSize());
}

function getHeaderOfTheTable() {
    let result = makeLineWithTJunction()
    result = continueEqualityLine(result, calculate.getSize()) + addEndOfLineMarker(RIGHT_TOP_CORNER);
    result = makeTextRow(result) + addEndOfLineMarker(VERTICAL_LINE);

    if (calculate.getDataLength() > 0) {
        result += makeFullHorizontalLine() + addEndOfLineMarker(T_LEFT_JUNCTION);
    }
    return result;
}

function startRow(result, columns) {
    if (columns < calculate.getDataLength() - 1) {
        result += makeLineWithJunction();
        result = continueEqualityLine(result, calculate.getSize()) + addEndOfLineMarker(T_LEFT_JUNCTION);
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
    result = continueEqualityLine(result, calculate.getSize()) + addEndOfLineMarker(RIGHT_BOTTOM_CORNER);
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
