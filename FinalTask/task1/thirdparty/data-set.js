module.exports = class DataSet {
    constructor(iterable) {
        this.data = iterable.map(([columnName, value]) => {
            return { columnName, value };
        });
    }

    getColumnNames() {
        return this.data.map(entry => entry.columnName);
    }

    getValues() {
        return this.data.map(entry => entry.value);
    }
};
