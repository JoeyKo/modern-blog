import { Center, Container, FormControl, FormHelperText, FormLabel, Input } from "@chakra-ui/react"

const Login: React.FC = () => {
  return (
    <Container>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type='email' />
        <FormHelperText>never share your email.</FormHelperText>
      </FormControl>
    </Container>
  )
}

export default Login