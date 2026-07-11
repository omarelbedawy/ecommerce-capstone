const bcrypt = require('bcryptjs');

describe('password hashing', () => {
  it('hashes a password and can verify it later', async () => {
    const plain = 'SuperSecret123!';
    const hashed = await bcrypt.hash(plain, 10);

    expect(hashed).not.toBe(plain);
    expect(await bcrypt.compare(plain, hashed)).toBe(true);
  });

  it('rejects the wrong password', async () => {
    const hashed = await bcrypt.hash('correct-password', 10);
    expect(await bcrypt.compare('wrong-password', hashed)).toBe(false);
  });
});
