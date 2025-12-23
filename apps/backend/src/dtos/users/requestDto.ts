export type LoginRequest = {
  email: string,
  password: string
}

export type PreSignupRequest = LoginRequest & {
  name: string
} 

