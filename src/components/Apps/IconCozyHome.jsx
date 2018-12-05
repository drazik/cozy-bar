import React from 'react'

const SvgIconCozyHome = props => {
  const { currentColor, ...otherProps } = props
  return (
    <svg viewBox="0 0 32 32" {...otherProps}>
      <g fill="none" fillRule="evenodd">
        <circle
          cx={16}
          cy={16}
          r={16}
          fill={currentColor ? 'currentColor' : '#297EF2'}
        />
        <path
          d="M19.314 17.561a.555.555 0 0 1-.82.12 4.044 4.044 0 0 1-2.499.862 4.04 4.04 0 0 1-2.494-.86.557.557 0 0 1-.815-.12.547.547 0 0 1 .156-.748c.214-.14.229-.421.229-.424a.555.555 0 0 1 .176-.385.504.504 0 0 1 .386-.145.544.544 0 0 1 .528.553c0 .004 0 .153-.054.36a2.954 2.954 0 0 0 3.784-.008 1.765 1.765 0 0 1-.053-.344.546.546 0 0 1 .536-.561h.01c.294 0 .538.237.545.532 0 0 .015.282.227.422a.544.544 0 0 1 .158.746m2.322-6.369a5.94 5.94 0 0 0-1.69-3.506A5.651 5.651 0 0 0 15.916 6a5.648 5.648 0 0 0-4.029 1.687 5.936 5.936 0 0 0-1.691 3.524 5.677 5.677 0 0 0-3.433 1.737 5.966 5.966 0 0 0-1.643 4.137C5.12 20.347 7.704 23 10.882 23h10.236c3.176 0 5.762-2.653 5.762-5.915 0-3.083-2.31-5.623-5.244-5.893"
          fill="#FFF"
        />
      </g>
    </svg>
  )
}

export default SvgIconCozyHome