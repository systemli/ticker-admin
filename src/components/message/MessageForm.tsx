import { FC, useCallback, useEffect, useState } from 'react'
import { useMessageApi } from '../../api/Message'
import { Ticker } from '../../api/Ticker'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import MessageFormCounter from './MessageFormCounter'
import useAuth from '../../contexts/useAuth'
import { Upload } from '../../api/Upload'
import UploadButton from './UploadButton'
import AttachmentsPreview from './AttachmentsPreview'
import EmojiPicker from './EmojiPicker'
import MessageMapModal from './MessageMapModal'
import { FeatureCollection, Geometry } from 'geojson'
import { Box, Button, FormGroup, IconButton, Stack, TextField } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapLocationDot, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import palette from '../../theme/palette'
import { Emoji } from './Emoji'

interface Props {
  ticker: Ticker
}

interface FormValues {
  message: string
}

const MessageForm: FC<Props> = ({ ticker }) => {
  const {
    formState: { isSubmitSuccessful, errors },
    handleSubmit,
    reset,
    register,
    watch,
    setValue,
  } = useForm<FormValues>({ mode: 'onSubmit' })
  const { token } = useAuth()
  const { postMessage } = useMessageApi(token)
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [attachments, setAttachments] = useState<Upload[]>([])
  const [mapDialogOpen, setMapDialogOpen] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emptyMap: FeatureCollection<Geometry, any> = {
    type: 'FeatureCollection',
    features: [],
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [map, setMap] = useState<FeatureCollection<Geometry, any>>(emptyMap)

  /**
   * Calculates the maximum length of a message based on the given ticker's configuration.
   * If the ticker's Mastodon integration is active, the maximum length is 500 characters.
   * Otherwise, the maximum length is 4096 characters (Telegram message limit).
   * @param ticker - The ticker object to calculate the maximum message length for.
   * @returns The maximum length of a message for the given ticker.
   */
  const maxLength: number = (function (ticker: Ticker) {
    if (ticker.bluesky.active) {
      return 300
    }

    if (ticker.mastodon.active) {
      return 500
    }

    return 4096
  })(ticker)

  const onUpload = useCallback(
    (uploads: Upload[]) => {
      setAttachments(attachments.concat(uploads))
    },
    [attachments]
  )

  const onUploadDelete = useCallback(
    (upload: Upload) => {
      setAttachments(
        attachments.filter((attachment: Upload) => {
          if (attachment.id !== upload.id) {
            return true
          }
        })
      )
    },
    [attachments]
  )

  const onSelectEmoji = (emoji: Emoji) => {
    setValue('message', message.toString() + emoji.native + ' ')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onMapUpdate = useCallback((featureGroups: FeatureCollection<Geometry, any>) => {
    setMap(featureGroups)
  }, [])

  const onSubmit: SubmitHandler<FormValues> = data => {
    setIsSubmitting(true)
    const uploads = attachments.map(upload => {
      return upload.id
    })

    postMessage(ticker.id.toString(), data.message, map, uploads).finally(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', ticker.id] })
      setAttachments([])
      setIsSubmitting(false)
    })
  }

  useEffect(() => {
    reset({
      message: '',
    })
  }, [isSubmitSuccessful, reset])

  const message = watch('message')

  return (
    <form id="sendMessage" onSubmit={handleSubmit(onSubmit)}>
      <FormGroup sx={{ mb: 1 }}>
        <TextField
          {...register('message', {
            required: true,
            maxLength: maxLength,
          })}
          color={errors.message ? 'error' : 'primary'}
          error={!!errors.message}
          helperText={
            errors.message?.type === 'maxLength' ? 'The message is too long.' : errors.message?.type === 'required' ? 'The message is required.' : null
          }
          multiline
          placeholder="Write a message"
          rows="3"
        />
      </FormGroup>
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Box display="flex">
          <Button disabled={isSubmitting} startIcon={<FontAwesomeIcon icon={faPaperPlane} />} sx={{ mr: 1 }} type="submit" variant="outlined">
            Send
          </Button>
          <EmojiPicker onChange={onSelectEmoji} />
          <UploadButton onUpload={onUpload} ticker={ticker} />
          <IconButton component="span" onClick={() => setMapDialogOpen(true)}>
            <FontAwesomeIcon color={palette.primary['main']} icon={faMapLocationDot} size="xs" />
          </IconButton>
          <MessageMapModal map={map} onChange={onMapUpdate} onClose={() => setMapDialogOpen(false)} open={mapDialogOpen} ticker={ticker} />
        </Box>
        <MessageFormCounter letterCount={message?.length || 0} maxLength={maxLength} />
      </Stack>
      <Box>
        <AttachmentsPreview attachments={attachments} onDelete={onUploadDelete} />
      </Box>
    </form>
  )
}

export default MessageForm
