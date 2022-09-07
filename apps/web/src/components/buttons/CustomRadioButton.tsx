import { FormControlLabel, Radio, styled } from '@mui/material'
import { MouseEventHandler } from 'react'

export const Icon = styled('span')(({ theme }) => ({
  borderRadius: '42%',
  width: '20px',
  height: '16px',
  backgroundColor: 'transparent',
  border: `2px solid ${theme.palette.radioColor.main}`,
  position: 'relative',
}))

export const CheckedIcon = styled(Icon)(({ theme }) => ({
  '&:before': {
    display: 'block',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    width: '20px',
    height: '16px',
    backgroundImage: `radial-gradient(${theme.palette.radioCheckedColor.main},${theme.palette.radioCheckedColor.main} 28%,transparent 32%)`,
    content: '""',
  },
}))
const CustomRadioButton = (props: { onClick?: MouseEventHandler<HTMLButtonElement>; label?: string }) => {
  return (
    <FormControlLabel
      value={props.label}
      label={props.label}
      control={<Radio onClick={props.onClick} icon={<Icon />} checkedIcon={<CheckedIcon />} />}
    />
  )
}
export default CustomRadioButton
