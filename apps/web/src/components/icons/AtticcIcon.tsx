import { IIconProps } from './iconInterface'

export const AtticcIcon = (props: any) => {
  const { tColor = '#fff', oColor = '#fff', borderColor = '#fff', cColor = '#F26E21', aColor = 'F26E21' } = props
  return (
    <svg
      width={props.width === undefined ? '267' : props.width}
      height={props.height === undefined ? '267' : props.height}
      viewBox="0 0 267 267"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M174.973 185.409C164.131 198.149 148.273 205.468 131.603 205.468C106.258 205.468 83.7594 188.391 76.8472 163.995V163.859L60.1767 160.2L60.3122 160.742C63.1584 177.412 71.8325 192.728 84.7082 203.841C97.8549 215.091 114.525 221.19 131.738 221.19C155.727 221.19 178.09 209.263 191.644 189.475L191.915 189.068L175.109 185.409H174.973Z"
        fill={cColor}
      />
      <path
        d="M182.021 59.9055C166.841 59.9055 154.643 72.239 154.643 87.2832C154.643 102.327 166.977 114.661 182.021 114.661C197.065 114.661 209.398 102.327 209.398 87.2832C209.398 72.239 197.2 59.9055 182.021 59.9055ZM193.948 87.4187C193.948 93.9243 188.662 99.3456 182.021 99.3456C175.38 99.3456 170.094 94.0598 170.094 87.4187C170.094 80.7776 175.38 75.4918 182.021 75.4918C188.662 75.4918 193.948 80.9131 193.948 87.4187Z"
        fill={oColor}
      />
      <path d="M186.493 142.038H139.734V157.489H186.493V170.5H202.08V123.606H186.493V142.038Z" fill={tColor} />
      <path
        d="M87.2832 87.9611L104.36 113.577H123.064L87.1477 59.7703L52.3157 113.035L51.9091 113.577H70.4772L87.2832 87.9611Z"
        fill={aColor}
      />
      <path
        d="M133.5 0C59.9056 0 0 59.9056 0 133.5C0 207.094 59.9056 267 133.5 267C207.094 267 267 207.094 267 133.5C267 59.9056 207.094 0 133.5 0ZM252.769 133.5C252.769 199.234 199.234 252.769 133.5 252.769C67.7665 252.769 14.231 199.234 14.231 133.5C14.231 67.7665 67.7665 14.231 133.5 14.231C199.234 14.231 252.769 67.7665 252.769 133.5Z"
        fill={borderColor}
      />
    </svg>
  )
}

export const LandingAtticIcon = (props: IIconProps) => {
  let filledColor = '#600B18'
  if (props.color !== undefined) filledColor = props.color.main
  return (
    <svg
      width={props.width === undefined ? '378' : props.width}
      height={props.height === undefined ? '402' : props.height}
      viewBox="0 0 378 402"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M326.049 330.427C304.321 355.911 272.543 370.551 239.136 370.551C188.346 370.551 143.259 336.391 129.407 287.591V287.32L96 280L96.2716 281.084C101.975 314.431 119.358 345.067 145.16 367.298C171.506 389.8 204.914 402 239.407 402C287.481 402 332.296 378.142 359.457 338.56L360 337.747L326.321 330.427H326.049Z"
        fill="#17181B"
      />
      <path
        d="M66.5 79C29.6287 79 0 108.958 0 145.5C0 182.042 29.9579 212 66.5 212C103.042 212 133 182.042 133 145.5C133 108.958 103.371 79 66.5 79ZM95.4703 145.829C95.4703 161.631 82.6312 174.8 66.5 174.8C50.3688 174.8 37.5297 161.96 37.5297 145.829C37.5297 129.698 50.3688 116.859 66.5 116.859C82.6312 116.859 95.4703 130.027 95.4703 145.829Z"
        fill="white"
      />
      <path d="M320.5 214.162H229V244.474H320.5V270H351V178H320.5V214.162Z" fill="white" />
      <path
        d="M295.649 70.2974L339.93 114.002L377.062 106.394L283.959 14.6095L236.387 134.1L235.799 135.337L272.662 127.785L295.649 70.2974Z"
        fill="#17181B"
      />
    </svg>
  )
}

export const AtticTextIcon = (props: IIconProps) => {
  let filledColor = '#fff'
  if (props.color !== undefined) filledColor = props.color.main
  return (
    <svg
      width={props.width === undefined ? '102' : props.width}
      height={props.height === undefined ? '28' : props.height}
      viewBox="0 0 102 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.772583 17.4618C0.772583 11.9309 5.06091 7.49634 10.5919 7.49634C13.4914 7.49634 15.8548 8.73898 17.5604 10.5177V7.93492H21.2396V27.0131H17.5604V24.406C15.8792 26.209 13.4914 27.4273 10.5919 27.4273C5.06091 27.4273 0.772583 22.9928 0.772583 17.4618ZM10.933 23.7481C14.4416 23.7481 17.4142 20.9704 17.4142 17.4618C17.4142 13.9532 14.4416 11.1755 10.933 11.1755C7.42436 11.1755 4.5005 13.9532 4.5005 17.4618C4.5005 20.9461 7.42436 23.7481 10.933 23.7481Z"
        fill={filledColor}
      />
      <path
        d="M27.7452 20.2395V11.2973H24.2366V7.93491H27.7452V3.69531H31.4244V7.93491H36.6142V11.273H31.4244V20.2151C31.4244 21.4821 31.4731 23.6019 33.934 23.6019C34.7625 23.6019 35.5178 23.2364 35.9564 22.8222L37.9543 25.7461C36.9066 26.6963 35.4691 27.2811 33.934 27.2811C29.597 27.3055 27.7452 24.6009 27.7452 20.2395Z"
        fill={filledColor}
      />
      <path
        d="M42.8031 20.2395V11.2973H39.2944V7.93491H42.8031V3.69531H46.4822V7.93491H51.6721V11.273H46.4822V20.2151C46.4822 21.4821 46.531 23.6019 48.9919 23.6019C49.8203 23.6019 50.5756 23.2364 51.0142 22.8222L53.0122 25.7461C51.9645 26.6963 50.5269 27.2811 48.9919 27.2811C44.6305 27.3055 42.8031 24.6009 42.8031 20.2395Z"
        fill={filledColor}
      />
      <path
        d="M57.7635 0.259766C58.933 0.259766 59.9076 1.21002 59.9076 2.3552C59.9076 3.52474 58.933 4.45063 57.7635 4.45063C56.6426 4.45063 55.668 3.50037 55.668 2.3552C55.668 1.21002 56.6426 0.259766 57.7635 0.259766ZM55.9604 7.93489H59.6152V27.0131H55.9604V7.93489Z"
        fill={filledColor}
      />
      <path
        d="M62.6122 17.4618C62.6122 11.9309 67.1198 7.49634 72.6508 7.49634C76.3787 7.49634 79.6193 9.49431 81.3492 12.4913L78.0355 14.0994C76.9147 12.3207 74.9168 11.1755 72.6508 11.1755C69.1421 11.1755 66.2914 13.9532 66.2914 17.4618C66.2914 20.9704 69.1421 23.7481 72.6508 23.7481C74.9168 23.7481 76.8904 22.6273 78.0355 20.8486L81.3492 22.4567C79.6193 25.4293 76.3787 27.4273 72.6508 27.4273C67.1442 27.4273 62.6122 22.9928 62.6122 17.4618Z"
        fill={filledColor}
      />
      <path
        d="M82.933 17.4618C82.933 11.9309 87.4406 7.49634 92.9716 7.49634C96.6995 7.49634 99.9401 9.49431 101.67 12.4913L98.3563 14.0994C97.2355 12.3207 95.2376 11.1755 92.9716 11.1755C89.4629 11.1755 86.6122 13.9532 86.6122 17.4618C86.6122 20.9704 89.4629 23.7481 92.9716 23.7481C95.2376 23.7481 97.2112 22.6273 98.3563 20.8486L101.67 22.4567C99.9401 25.4293 96.6995 27.4273 92.9716 27.4273C87.465 27.4273 82.933 22.9928 82.933 17.4618Z"
        fill={filledColor}
      />
    </svg>
  )
}