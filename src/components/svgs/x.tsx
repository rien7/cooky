export default function X(props: { color?: string; width?: string; height?: string }) {
  return (
    <svg fill={props.color || '#000000'} width={props.width || '1rem'} height={props.height || '1rem'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.414 12l4.95-4.95a1 1 0 0 0-1.414-1.414L12 10.586l-4.95-4.95A1 1 0 0 0 5.636 7.05l4.95 4.95-4.95 4.95a1 1 0 0 0 1.414 1.414l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414-1.414z"/>
    </svg>
  )
}
