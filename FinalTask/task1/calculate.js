const ONE_COLUMN = 2;
const TWO_COLUMNS = 3;
const SHIFT = 1;

function reverseMaxLength(name, length) {
    if (name.toString().length > length) {
        length = name.toString().length;
    }
    return length;
}

function updateLength(names, length) {
    for (const name of names) {
        length = reverseMaxLength(name, length);
    }

    return length;
}

function addTextToTheCell(text, column) {
    return text[column].toString();
}

function getTextLength(text, column) {
    return addTextToTheCell(text, column).length;
}

function addColumnSpaces(result, size) {
    for (let i = 0; i < size; i++) {
        result += ' ';
    }

    return result;
}

module.exports = {
    setData(data) {
        this.data = data;
    },
    getNames() {
        return this.data[0].getColumnNames();
    },
    getDataLength() {
        return this.data.length;
    },
    getColumnsQuantity() {
        return this.getNames().length;
    },
    getColumnLength() {
        if (this.data.length <= 0) {
            return 0;
        }
        let length = updateLength(this.data[0].getColumnNames(), 0);

        for (const dataSet of this.data) {
            length = updateLength(dataSet.getValues(), length);
        }
        return length;
    },
    getSize() {
        let columnSize = this.getColumnLength();
        if (columnSize % 2 === 0) {
            return columnSize + ONE_COLUMN;
        }

        return columnSize + TWO_COLUMNS;
    },
    getTruncatedLength(nameLength) {
        return Math.trunc((this.getSize(this.data) - nameLength) / ONE_COLUMN);
    },
    updateLength(text) {
        return text.length - ONE_COLUMN;
    },
    chainRows(result, columns, i) {
        const values = this.data[columns].getValues();
        const valuesLength = values[i].toString().length;

        if (valuesLength % 2 === 0) {
            result = this.getPaddingWithValues(result, values, i) + '║';
        } else {
            result = addColumnSpaces(result, this.getTruncatedLength(valuesLength)) + addTextToTheCell(values, i);
            result = this.addShiftedSpaceToResult(result, valuesLength) + '║';
        }

        return result;
    },
    addText(columns) {
        let result = '║';

        if (getTextLength(this.getNames(), columns) % 2 === 0) {
            result = this.getPaddingWithNames(result, columns)
        } else {
            result = this.getPaddingWithShortColumn(result, columns)
        }

        return result;
    },
    getPaddingWithNames(result, column) {
        const text = this.getNames();
        const namesLength = getTextLength(text, column);

        result = addColumnSpaces(result, this.getTruncatedLength(namesLength))
            + addTextToTheCell(text, column);
        return addColumnSpaces(result, this.getTruncatedLength(namesLength))
    },
    getPaddingWithValues(result, values, column) {
        const namesLength = getTextLength(values, column);

        result = addColumnSpaces(result, this.getTruncatedLength(namesLength))
            + addTextToTheCell(values, column);
        return addColumnSpaces(result, this.getTruncatedLength(namesLength))
    },
    addShiftedSpaceToResult(result, length) {
        return addColumnSpaces(result, this.getTruncatedLength(length) + SHIFT)
    },
    getPaddingWithShortColumn(result, column) {
        const names = this.getNames();
        const namesLength = getTextLength(names, column);

        result = addColumnSpaces(result, this.getTruncatedLength(namesLength))
            + addTextToTheCell(names, column);
        return this.addShiftedSpaceToResult(result, namesLength);
    }
}
