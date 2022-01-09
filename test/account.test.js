const { ObjectId } = require('mongodb')
const accountRepository = require('../src/repositories/account')

describe('User repos', () => {
    let accounts, account1;

    beforeEach(async () => {
        account1 = await accountRepository.add({
            username: 'jdejesus',
            password: 'pass1234'
        })

        accounts = await accountRepository.get()
        console.log(accounts)
    })

    afterEach(async () => {
        console.log(account1)
        // await accountRepository.remove(ObjectId(account1._id))
    })

    it('should return an empty array', () => {
        expect(accounts.length).toBe(1)
    })
})