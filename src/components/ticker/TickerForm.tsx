import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
} from 'react'
import {
  Button,
  CheckboxProps,
  Form,
  Header,
  Icon,
  Input,
  InputOnChangeData,
  Message,
  TextAreaProps,
} from 'semantic-ui-react'
import { Ticker, useTickerApi } from '../../api/Ticker'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import useAuth from '../useAuth'
import LocationSearch, { Result } from './LocationSearch'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

interface Props {
  ticker?: Ticker
  callback: () => void
}

interface FormValues {
  title: string
  domain: string
  active: boolean
  description: string
  information: {
    author: string
    email: string
    url: string
    twitter: string
    facebook: string
    telegram: string
  }
  location: {
    lat: number
    lon: number
  }
}

const TickerForm: FC<Props> = props => {
  const ticker = props.ticker
  const { handleSubmit, register, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: ticker?.title,
      domain: ticker?.domain,
      active: ticker?.active,
      description: ticker?.description,
      information: {
        author: ticker?.information.author,
        email: ticker?.information.email,
        url: ticker?.information.url,
        twitter: ticker?.information.twitter,
        facebook: ticker?.information.facebook,
        telegram: ticker?.information.telegram,
      },
      location: {
        lat: ticker?.location.lat || 0,
        lon: ticker?.location.lon || 0,
      },
    },
  })
  const { token, user } = useAuth()
  const { postTicker, putTicker } = useTickerApi(token)
  const queryClient = useQueryClient()

  const onLocationChange = useCallback(
    (result: Result) => {
      setValue('location.lat', result.lat)
      setValue('location.lon', result.lon)
    },
    [setValue]
  )

  const onLoctionReset = useCallback(
    (e: React.MouseEvent) => {
      setValue('location.lat', 0)
      setValue('location.lon', 0)

      e.preventDefault()
    },
    [setValue]
  )

  const onChange = useCallback(
    (
      e: ChangeEvent | FormEvent,
      {
        name,
        value,
        checked,
      }: InputOnChangeData | CheckboxProps | TextAreaProps
    ) => {
      if (checked !== undefined) {
        setValue(name, checked)
      } else {
        setValue(name, value)
      }
    },
    [setValue]
  )

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (ticker) {
      putTicker(data, ticker.id).finally(() => {
        queryClient.invalidateQueries(['tickers'])
        queryClient.invalidateQueries(['ticker', ticker.id])
        props.callback()
      })
    } else {
      postTicker(data).finally(() => {
        queryClient.invalidateQueries(['tickers'])
        props.callback()
      })
    }
  }

  useEffect(() => {
    register('location.lat', { valueAsNumber: true })
    register('location.lon', { valueAsNumber: true })
  })

  const position = watch('location')

  return (
    <Form id="editTicker" onSubmit={handleSubmit(onSubmit)}>
      <Form.Group widths="equal">
        <Form.Input
          defaultValue={ticker ? ticker.title : ''}
          label="Title"
          name="title"
          onChange={onChange}
          required
        />
        <Form.Input
          defaultValue={ticker ? ticker.domain : ''}
          disabled={!user?.roles.includes('admin')}
          label="Domain"
          name="domain"
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Checkbox
        defaultChecked={ticker ? ticker.active : false}
        label="Active"
        name="active"
        onChange={onChange}
        toggle
      />
      <Form.TextArea
        defaultValue={ticker ? ticker.description : ''}
        label="Description"
        name="description"
        onChange={onChange}
        required
        rows="5"
      />
      <Header dividing>Information</Header>
      <Form.Group widths="equal">
        <Form.Input label="Author">
          <Input
            defaultValue={ticker ? ticker.information.author : ''}
            iconPosition="left"
            name="information.author"
            onChange={onChange}
            placeholder="Author"
          >
            <Icon name="users" />
            <input />
          </Input>
        </Form.Input>
        <Form.Input label="Homepage">
          <Input
            defaultValue={ticker ? ticker.information.url : ''}
            iconPosition="left"
            name="information.url"
            onChange={onChange}
          >
            <Icon name="home" />
            <input />
          </Input>
        </Form.Input>
        <Form.Input label="Email">
          <Input
            defaultValue={ticker ? ticker.information.email : ''}
            iconPosition="left"
            name="information.email"
            onChange={onChange}
            placeholder="Email"
          >
            <Icon name="at" />
            <input />
          </Input>
        </Form.Input>
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Input label="Twitter">
          <Input
            defaultValue={ticker ? ticker.information.twitter : ''}
            iconPosition="left"
            name="information.twitter"
            onChange={onChange}
          >
            <Icon name="twitter" />
            <input />
          </Input>
        </Form.Input>
        <Form.Input label="Facebook">
          <Input
            defaultValue={ticker ? ticker.information.facebook : ''}
            iconPosition="left"
            name="information.facebook"
            onChange={onChange}
          >
            <Icon name="facebook" />
            <input />
          </Input>
        </Form.Input>
        <Form.Input label="Telegram">
          <Input
            defaultValue={ticker ? ticker.information.telegram : ''}
            iconPosition="left"
            name="information.telegram"
            onChange={onChange}
          >
            <Icon name="telegram" />
            <input />
          </Input>
        </Form.Input>
      </Form.Group>
      <Header dividing>Location</Header>
      <Message info size="small">
        You can add a default location to the ticker. This will help you to have
        a pre-selected location when you add a map to a message. <br />
        Current Location: {position.lat.toFixed(2)},{position.lon.toFixed(2)}
      </Message>
      <Form.Group widths="equal">
        <Form.Field width="15">
          <LocationSearch callback={onLocationChange} />
        </Form.Field>
        <Form.Field width="1">
          <Button
            color="red"
            disabled={ticker?.location.lat === 0 && ticker.location.lon === 0}
            icon="delete"
            onClick={onLoctionReset}
          />
        </Form.Field>
      </Form.Group>
      {position.lat !== 0 && position.lon !== 0 ? (
        <MapContainer
          center={[position.lat, position.lon]}
          scrollWheelZoom={false}
          style={{ height: 200 }}
          zoom={10}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[position.lat, position.lon]} />
        </MapContainer>
      ) : null}
    </Form>
  )
}

export default TickerForm
