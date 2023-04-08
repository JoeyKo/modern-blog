import { Box } from "@chakra-ui/react";
import Header from "./header/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box>{children}</Box>
    </>
  )
}