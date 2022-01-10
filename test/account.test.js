const { hash } = require('bcrypt')
const accountRepository = require('../src/repositories/account')

describe('User repos', () => {
    let account1, accounts, hashedPassword;

    beforeEach(async () => {
        hashedPassword = await hash('pass1234', 15)

        account1 = await accountRepository.add({
            username: 'jdejesus',
            password: hashedPassword
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