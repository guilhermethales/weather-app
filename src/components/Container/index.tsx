import { Box } from '@chakra-ui/react'

type ContainerProps = {
  children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
  return (
    <Box
      as="main"
      backgroundImage={`url(${process.env.NEXT_PUBLIC_BACKGROUND})`}
      backgroundPosition="center"
      backgroundSize="cover"
      height="100%"
      overflow="auto"
    >
      {children}
    </Box>
  )
}

export default Container
