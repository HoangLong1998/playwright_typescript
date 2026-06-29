export type TestUser = {
  username: string;
  password: string;
};

const usersFromEnv = Array.from({ length: 10 }, (_, index) => {
  const username = process.env[`TEST_USER_${index}_EMAIL`];
  const password = process.env[`TEST_USER_${index}_PASSWORD`];

  return username && password ? { username, password } : undefined;
}).filter((user): user is TestUser => Boolean(user));

export const testUsers: TestUser[] =
  usersFromEnv.length > 0
    ? usersFromEnv
    : [
        {
          username: 'long.hoang@yopmail.com',
          password: 'Long123@',
        },
        {
          username: 'bert.hoang@yopmail.com',
          password: 'Bert123@',
        },
      ];

export const apiTestUser = testUsers[1] ?? testUsers[0];
