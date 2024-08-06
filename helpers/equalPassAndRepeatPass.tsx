export function equaPassAndRepeatPass(password: string, repeatPass:string) {
  if(password!==repeatPass){
    return 'Mật khẩu mới và mật khẩu nhập lại không trùng nhau!'
  }
  return ''
}