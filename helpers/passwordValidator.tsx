export function passwordValidator(password: string) {
  if (!password) return "Mật khẩu không được để trống!"
  if (password.length < 5) return 'Mật khẩu phải có ít nhất 5 kí tự trở lên!'
  return ''
}
