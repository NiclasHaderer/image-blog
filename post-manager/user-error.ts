export class PostUserError extends Error {
  constructor() {
    super('Post creation user error. Aborting...');
  }
}
