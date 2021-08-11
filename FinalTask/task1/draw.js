const os = require('os');
const calculate = require('./calculate');

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

function makeColumns(columns) {
    let result = VERTICAL_LINE;
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
