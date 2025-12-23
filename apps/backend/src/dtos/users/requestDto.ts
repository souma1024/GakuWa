export type LoginRequest = {
  email: string,
  password: string
}

export type SignupRequest = LoginRequest & {
  name: string
} 

