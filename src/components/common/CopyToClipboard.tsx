import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@mui/material'
import { grey } from '@mui/material/colors'
import { FC, useState } from 'react'

interface Props {
  text: string
}

const CopyToClipboard: FC<Props> = ({ text }) => {
  const [copied, setCopied] = useState<boolean>(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'} arrow placement="top">
      <FontAwesomeIcon icon={faCopy} onClick={handleClick} color={grey[800]} style={{ cursor: 'pointer' }} aria-label="Copy to Clipboard" />
    </Tooltip>
  )
}

export default CopyToClipboard
