export default function Circle(props: { color?: string; all: number; present: number }) {
  return (
    <svg width='1.5rem' height='1.5rem' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx='50%' cy='50%' r='10'
        strokeWidth='2'
        transform="rotate(-90 12 12)"
        stroke={props.color || '#000000'}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={props.all}
        strokeDashoffset={props.present} />
    </svg>
  )
}
