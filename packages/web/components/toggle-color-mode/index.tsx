import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { Button, IconButton, useColorMode } from "@chakra-ui/react"

function ToggleColorMode() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <header>
      <IconButton
        variant={"ghost"}
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        aria-label={"夜间模式"}
      />
    </header>
  )
}

export default ToggleColorMode