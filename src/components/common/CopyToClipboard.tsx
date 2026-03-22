import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconButton, Tooltip } from '@mui/material'
import { grey } from '@mui/material/colors'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  text: string
}

const CopyToClipboard: FC<Props> = ({ text }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState<boolean>(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Tooltip title={copied ? t('common.copied') : t('action.copyToClipboard')} arrow placement="top">
      <IconButton aria-label={t('action.copyToClipboard')} onClick={handleClick} size="small">
        <FontAwesomeIcon aria-hidden="true" icon={faCopy} color={grey[800]} size="xs" />
      </IconButton>
    </Tooltip>
  )
}

export default CopyToClipboard
