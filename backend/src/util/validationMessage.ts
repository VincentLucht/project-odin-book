class ValidationMessages {
  req(field: string) {
    return `${field} is required`;
  }

  userIdReq() {
    return 'User ID is required';
  }

  usernameReq() {
    return 'Username is required';
  }

  minLen(field: string, length: number) {
    return `${field} must be at least ${length} characters long`;
  }

  maxLen(field: string, length: number) {
    return `${field} cannot be longer than ${length} characters`;
  }

  match(field1: string, field2: number) {
    return `${field1} must match ${field2}`;
  }
}

const vm = new ValidationMessages();
export default vm;
