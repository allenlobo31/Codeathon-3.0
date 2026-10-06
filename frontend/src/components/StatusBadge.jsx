const styles = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-gray-200 text-gray-600',
  revoked: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}
