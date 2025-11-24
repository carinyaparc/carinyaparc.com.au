/**
 * Global teardown code that runs after all tests complete.
 * Use this for any cleanup that needs to happen after all tests have finished.
 */

export default async (): Promise<void> => {
  // Clean up any global resources that were created
  console.log('Test suite completed, performing global cleanup...');
};
