/** User credentials type */
export type TestUser = {
  username: string;
  password: string;
};

/**
 * Get user from environment variables (TEST_USER_{index}_EMAIL/PASSWORD)
 * @param index - User index (0-9)
 * @returns TestUser object or undefined if not found
 */
const getEnvUser = (index: number): TestUser | undefined => {
  // Extract email and password from env
  const username = process.env[`TEST_USER_${index}_EMAIL`];
  const password = process.env[`TEST_USER_${index}_PASSWORD`];

  // Return undefined if either is missing
  if (!username || !password) {
    return undefined;
  }

  return { username, password };
};

/** Collect users from environment variables by looping 0-9 */
const usersFromEnv: TestUser[] = [];
for (let index = 0; index < 10; index++) {
  const user = getEnvUser(index);
  if (user) {
    usersFromEnv.push(user);
  }
}

/** Export users: use env users if available, fallback to default hardcoded users */
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


// let testUsers: TestUser[];

// if (usersFromEnv.length > 0) {
//   testUsers = usersFromEnv;
// } else {
//   testUsers = [
//     { username: 'long.hoang@yopmail.com', password: 'Long123@' },
//     { username: 'bert.hoang@yopmail.com', password: 'Bert123@' },
//   ];
// }

/** API test user: use 2nd user if available, fallback to 1st user */
export const apiTestUser = testUsers[1] ?? testUsers[0];
