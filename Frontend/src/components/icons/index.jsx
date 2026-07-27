const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  )
}

export function CatalogIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </svg>
  )
}

export function PriceTagIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12.5 3.5h6a1 1 0 0 1 1 1v6a1 1 0 0 1-.3.7l-9 9a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.4l9-9a1 1 0 0 1 .7-.3Z" />
      <circle cx="16" cy="8" r="1.4" />
    </svg>
  )
}

export function LayersIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </svg>
  )
}

export function DocumentIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4V20a.7.7 0 0 1-.7.7H7A.7.7 0 0 1 6.3 20V4.2a.7.7 0 0 1 .7-.7Z" />
      <path d="M14 3.5V8h4" />
      <path d="M9 12.5h6M9 16h6" />
    </svg>
  )
}

export function BuildingIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="3.5" width="9" height="17" rx="0.8" />
      <path d="M14 9.5h4.5v11H14" />
      <path d="M8 7.5h1M11 7.5h1M8 11h1M11 11h1M8 14.5h1M11 14.5h1" />
    </svg>
  )
}

export function LogoutIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4H5.7a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1H9" />
      <path d="M16 15.5 20.5 11 16 6.5" />
      <path d="M20.2 11H9.5" />
    </svg>
  )
}

export function MonitorIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.3" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  )
}

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function ChevronDownIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function UserIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  )
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function EyeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  )
}

export function EyeOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a13.4 13.4 0 0 1-3.2 3.9M6.4 6.5C4 8.1 2.5 10.8 2.5 12c0 0 3.5 6.5 9.5 6.5 1.4 0 2.6-.3 3.7-.8" />
      <path d="M9.9 10a2.6 2.6 0 0 0 3.7 3.7" />
    </svg>
  )
}

export function ChartBarIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M4 20h16" />
    </svg>
  )
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4.5 6.5 7.5 6.5 7.5-6.5" />
    </svg>
  )
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  )
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.3 12.3 2.6 2.6 5-5.2" />
    </svg>
  )
}

export function KeyIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="8" cy="15.5" r="4" />
      <path d="m11.2 12.4 8.3-8.3M16.5 7l2.5 2.5M19.5 4l2.5 2.5" />
    </svg>
  )
}

export function PencilIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20l1-4.2L15.6 5.2a1.5 1.5 0 0 1 2.1 0l1.1 1.1a1.5 1.5 0 0 1 0 2.1L8.2 19 4 20Z" />
      <path d="m14.2 6.8 3 3" />
    </svg>
  )
}

export function TrashIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 7h14M9 7V4.8c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3V7M18.5 7l-.7 12.2a1.7 1.7 0 0 1-1.7 1.6H8a1.7 1.7 0 0 1-1.7-1.6L5.6 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  )
}

export function PlusIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  )
}

export function ChevronRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function FolderIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 6.2c0-.7.6-1.2 1.2-1.2h4.4l2 2.3h8.2c.7 0 1.2.5 1.2 1.2v9.3c0 .7-.5 1.2-1.2 1.2H4.7c-.7 0-1.2-.5-1.2-1.2Z" />
    </svg>
  )
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.2" r="3.2" />
      <path d="M2.8 19c.6-3.2 3-5 6.2-5s5.6 1.8 6.2 5" />
      <path d="M16 4.5a3.2 3.2 0 0 1 0 6.3M20 19c-.4-2.3-1.6-3.8-3.6-4.6" />
    </svg>
  )
}

export function AlertIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" />
      <path d="M12 10v4.2" />
      <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
