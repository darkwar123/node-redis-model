module.exports = function List (schema, model) {
    /**
     * Return part of list from a to b indexes
     * @param {Number} [a] - the start array position
     * @param {Number} [b] - the end array position
     * @return {Promise}
     * @static
     * */
    model.find = function find (a = 0, b = -1) {
        return new Promise((resolve, reject) => {
            schema.connection.lrange(schema.collection, a, b)
                .then(data => {
                    try{
                        data = data.map(d => JSON.parse(d))
                    }finally {
                        resolve(data.reverse());
                    }
                })
                .catch(reject)
        });
    };

    /**
     * Save list and trim it if needs
     * @param {Number} [a] - start position to trim
     * @param {Number} [b] - end position to trim
     * @return {Promise}
     * */
    model.prototype.save = function (a, b){
        let command = schema.connection.pipeline().lpush(schema.collection, JSON.stringify(this.toJSON()));

        if(
            typeof a === 'number'
            && typeof b === 'number'
        ){
            command.ltrim(schema.collection, a, b);
        }

        return new Promise((resolve, reject) => {
            this.validate()
                .then(() => {
                    return command.exec();
                })
                .then(resolve)
                .catch(reject);
        });
    };

    return model;
};