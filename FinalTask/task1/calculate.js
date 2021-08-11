const ONE_COLUMN = 2;
const TWO_COLUMNS = 3;

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

module.exports = {
    setData(data) {
        this.data = data;
    },
    getNames() {
        return this.data[0].getColumnNames();
    },
    getColumnValues(columns) {
        return this.data[columns].getValues();
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
        let length = updateLength(this.getNames(), 0);

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
}
