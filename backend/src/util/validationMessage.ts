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
    const word = field.charAt(0).toUpperCase() + field.slice(1);
    return `${word} must be at least ${length} characters long`;
  }

  maxLen(field: string, length: number) {
    const word = field.charAt(0).toUpperCase() + field.slice(1);
    return `${word} cannot be longer than ${length} characters`;
  }

  match(field1: string, field2: number) {
    return `${field1} must match ${field2}`;
  }
}

const vm = new ValidationMessages();
export default vm;
