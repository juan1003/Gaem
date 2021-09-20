//nodejs support
if (typeof btoa === 'undefined') btoa = function (str) { return Buffer.from(str).toString('base64') };
if (typeof atob === 'undefined') atob = function (str) { return Buffer.from(str, 'base64').toString('utf8') };

class DataManager {
    /**
     * Infinite number of key array.
     * The algorithm will iterate through each one and will use the
     * text of each one to determine encryption. Can make it as
     * complex as needed or as lightweight as needed.
     * @param keydata 
     * 
     * @example
     * const encTest = new DataManager(['some_key', 'some_second_key', '...etc']);
     * 
     * var str = 'test encoding';
     * encTest.encrypt(str).then(estr => {
     *     //output encoded string
     *     console.log(estr);
     * 
     *     //decode it for testing
     *     encTest.decode(estr).then(decoded => {
     *         //output decoded string, should be 'test encoding'
     *         console.log(decoded);
     *     })
     * });
     * 
     */
    constructor(keydata = ['some_key', 'some_second_key', '...etc']) {
        this.keydata = keydata;
    }

    /**
     * Sets the key if you want to change it.
     * @param keydata 
     * @param keydata leave default for this.keydata
     * 
     */
    setKey(keydata = ['...']) {
        this.keydata = keydata;
    }

    /**
     * Encrypts text data.
     * @param str 
     * @param keydata leave default for this.keydata
     * 
     * @returns string
     */
    async encrypt(str, keydata = this.keydata) {
        try {
            /**
         * Convert original to base64
         * to prevent character overflow on
         * high-level characters such as
         * ありがとうございます
         * 
         * Also append check data to ensure it gets decoded properly instead
         * of returning garbled mess for the attempting hacker to figure out
         */
            let bstr = str + 'chk=true';
            let end = '';
            let pushed = [];
            /**
             * Iterate through keydata and apply to pushed array
             */
            for (let i = 0; i < keydata.length; i++) {
                for (let j = 0; j < keydata[i].length; j++) {
                    pushed.push(this.keydata[i].charCodeAt(j));
                }
            }

            for (let i = 0; i < bstr.length; i++) {
                end += String.fromCharCode(bstr.charCodeAt(i) + pushed[i % pushed.length]);
            }

            //Return a second encoded string to ensure utf8 readability
            return btoa(end);
        } catch (e) {
            return e;
        }
    }

    /**
     * Decodes a decrypted string from an encrypted string
     * @param str 
     * @param keydata leave default for this.keydata
     * @returns string
     */
    async decode(str = '', keydata = this.keydata) {
        try {
            //Convert base64 string to garbled data
            let bstr = atob(str)
            let end = '';
            let pushed = [];
            for (let i = 0; i < keydata.length; i++) {
                for (let j = 0; j < keydata[i].length; j++) {
                    pushed.push(keydata[i].charCodeAt(j));
                }
            }

            for (let i = 0; i < bstr.length; i++) {
                end += String.fromCharCode(bstr.charCodeAt(i) - pushed[i % pushed.length]);
            }

            if (end.endsWith('chk=true')) {
                return end.substr(0, end.length - 8);
            } else {
                return `ERR: Keydata was incorrect or data was corrupted.`
            }
        } catch (e) {
            return 'ERR: Data is not encoded properly.'
        }
    }
}
class Database {
    constructor(keydata = ['some_key', 'some_second_key', '...etc']) {
        this.properties = {};

        this.manager = new DataManager(keydata);

        this.network = null;
    }

    /**
     * @alias DataManager.setKey
     */
    setKey(keydata = ['...']) {
        this.manager.setKey(keydata);
    }

    /**
     * Defines the network
     * @param network 
     */
    setNetwork(network='http://localhost/') {
        this.network = network;
    }

    /**
     * 
     * @param {*} name 
     * @returns Database
     * 
     * @example
     * my_db.addProperty('test')
     *      .addProperty('items')
     *      .addProperty('numTest')
     */
    addProperty(name = 'any') {
        this.properties[name] = null
        return this;
    }

    /**
     * 
     * @param {} property 
     * @param {} value
     * 
     * @returns Database 
     * 
     * @example
     * my_db.setProperty('test', 'Yo this is a test string')
     *      .setProperty('items', {my_item:'thing', anything_else: true, blah_blah: 34})
     *      .setProperty('numTest', 16);
     */
    setProperty(property = 'any', value) {
        this.properties[property] = value;
        return this;
    }

    /**
     * Gets a property
     * @param name 
     * @returns properties[name]
     */
    getProperty(name) {
        return this.properties[name];
    }

    /**
     * Gets all properties
     * @returns properties
     */
    getAllProperties() {
        return this.properties;
    }

    /**
     * Convert hwdata to JSON
     * @param data 
     * @returns 
     */
    async toJson(data) {
        return this.manager.decode(data).then(results => {
            let end = {};
            results = results.replace(/\[\<(.*?)\>\]::(.*?)$/gm, (a, b, c) => {
                end[b] = JSON.parse(c);
            })
            return end;
        }).catch(e => {
            return e;
        });
    }

    /**
     * Convert JSON to hwdata
     * @param json 
     * @returns 
     */
    async fromJson(json) {
        let end = '';
        const keys = Object.keys(json);
        keys.forEach((a, b) => {
            const eol = (b < keys.length - 1) ? '\n' : '';
            end += `[<${a}>]::${JSON.stringify(json[a])}${eol}`;
        });
        return this.manager.encrypt(end);
    }

    save() {
        if (!this.network) {
            console.error('Please define a database network.');
            return;
        }

        this.fromJson(this.properties).then(dat => {
            fetch(this.network, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                // mode: 'cors', // no-cors, *cors, same-origin
                // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                // credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'text/html',
                    "Authorization": "some_token"
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: dat // body data type must match "Content-Type" header
            })
        });
    }

    load() {
        if (!this.network) {
            console.error('Please define a database network.');
            return;
        }
        fetch(this.network).then(d1 => {
            d1.text();
        }).then(dat => {
            this.toJson(dat).then(results => {
                console.log(results);
            })
        })
        
    }
}
