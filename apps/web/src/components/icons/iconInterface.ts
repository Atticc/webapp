import { PaletteColor, SxProps, Theme } from '@mui/material'

export interface IArrowIconProps {
  direction?: 'left' | 'right' | 'up' | 'down'
  width?: string
  height?: string
  color?: PaletteColor
}
export interface ITierIconProps {
  width?: string
  height?: string
  color?: PaletteColor
  tier?: 'legendary' | 'prestige' | 'noble' | 'superior' | 'fine'
}

export interface IIconProps {
  width?: string | number
  height?: string | number
  color?: PaletteColor
}
