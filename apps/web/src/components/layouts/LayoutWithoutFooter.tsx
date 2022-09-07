import Header from './Header'
import { Box, Container, useTheme } from '@mui/material'

function LayoutWithoutFooter({ children }: { children: React.ReactNode }) {
  const color = useTheme().palette

  return (
    <Box minHeight={'100vh'} bgcolor={color.bgColor.main}>
      <Header />
      <Container
        maxWidth={false}
        sx={{
          margin: 0,
          padding: {
            xs: 0,
          },
          width: 1,
          maxWidth: 1,
          overflowX: 'hidden',
        }}
      >
        {children}
      </Container>
    </Box>
  )
}

export default LayoutWithoutFooter
