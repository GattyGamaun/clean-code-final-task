const ONE_COLUMN = 2;
const TWO_COLUMNS = 3;

function reverseMaxLength(name, maxLength) {
    if (name.toString().length > maxLength) {
        maxLength = name.toString().length;
    }

    return maxLength;
}

function updateLength(names, maxLength) {
    for (const name of names) {
        maxLength = reverseMaxLength(name, maxLength);
    }

    return maxLength;
}

module.exports = {
    getColumnsQuantity(array) {
        return array[0].getColumnNames().length;
    },
    getColumnLength(array) {
        if (array.length <= 0) {
            return 0;
        }
        let length = updateLength(array[0].getColumnNames(), 0);

        for (const dataSet of array) {
            length = updateLength(dataSet.getValues(), length);
        }
        return length;
    },
    calculateColumnSize(array) {
        let columnSize = this.getColumnLength(array);
        if (columnSize % 2 === 0) {
            return columnSize + ONE_COLUMN;
        }

        return columnSize + TWO_COLUMNS;

    },
    getTruncatedLength(data, nameLength) {
        return Math.trunc((this.calculateColumnSize(data) - nameLength) / ONE_COLUMN);
    }
}
