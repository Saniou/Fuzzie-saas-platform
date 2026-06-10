import ComingSoon from '@/components/global/coming-soon'
import { ScrollText } from 'lucide-react'

const LogsPage = () => {
  return (
    <ComingSoon
      title="Logs"
      description="Execution logs and debugging history for your workflows will appear here."
      icon={ScrollText}
    />
  )
}

export default LogsPage
