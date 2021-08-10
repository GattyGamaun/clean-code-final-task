const ONE_COLUMN = 2;
const TWO_COLUMNS = 3;

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

module.exports = {
    getColumnLength(array) {
        console.log('zzz', array[0].getColumnNames().length)
        return array[0].getColumnNames().length;
    },
    getMaxColumnLength(array) {
        if (array.length <= 0) {
            return 0;
        }
        let maxLength = updateMaxLength(array[0].getColumnNames(), 0);

        for (const dataSet of array) {
            maxLength = updateMaxLength(dataSet.getValues(), maxLength);
        }

        return maxLength;
    },
    calculateMaxColumnSize(array) {
        let maxColumnSize = this.getMaxColumnLength(array);
        if (maxColumnSize % 2 === 0) {
            return maxColumnSize + ONE_COLUMN;
        }

        return maxColumnSize + TWO_COLUMNS;

    },
    getTruncatedLength(data, nameLength) {
        console.log('getTruncatedLength', this.calculateMaxColumnSize(data))
        return Math.trunc((this.calculateMaxColumnSize(data) - nameLength) / ONE_COLUMN);
    }

}
