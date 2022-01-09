const { hash } = require('bcrypt')
const accountRepository = require('../src/repositories/account')

describe('User repos', () => {
    let accounts;

    beforeEach(async () => {
        await accountRepository.add({
            username: 'jdejesus',
            password: 'pass1234'
        })

        accounts = await accountRepository.get()
    })

    afterEach(async () => {
        await accountRepository.remove(ObjectId(account1._id))
    })

    it('should return 1 account', () => {
        expect(accounts.length).toBe(1)
    })
})