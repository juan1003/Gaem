require('dotenv').config();
const {MongoClient, ObjectId} = require("mongodb");

const accountRepository = () => {
    const url = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    const loadAccounts = accounts => {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                results = await db.collection('accounts').insertMany(accounts);
                resolve(results);
                client.close();
            } catch (error) { 
                reject(error);
            }
        });
    }

    const get = (query, limit) => {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                let results = await db.collection('accounts').find(query);
                if(limit > 0) {
                    results.limit(limit);
                }
                resolve(await results.toArray());
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    const getById = id => {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const account = await db.collection('accounts').findOne({_id: ObjectId(id)});
                resolve(account);
            } catch (error) {
                reject(error);
            }
        });
    }

    const add = account => {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const insertedAccount = await db.collection('accounts').insertOne(account);
                resolve(insertedAccount.ops[0]);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    const update = (id, account) => {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const updatedAccount = await db.collection('accounts')
                    .findOneAndReplace({_id: ObjectId(id)}, account, { returnOriginal: false });
                resolve(updatedAccount.value);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    const remove = id => {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const removedAccount = await db.collection('accounts').deleteOne({_id: ObjectId(id)});
                resolve(removedAccount.deletedCount === 1);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    return { loadAccounts, get, getById, add, update, remove }
}

module.exports = accountRepository();