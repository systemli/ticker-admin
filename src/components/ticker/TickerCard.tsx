import React, { FC } from 'react'
import { Button, Card, Icon, Label } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import TickerModalForm from './TickerModalForm'
import { Ticker } from '../../api/Ticker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

interface Props {
  ticker: Ticker
}

const TickerCard: FC<Props> = props => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Icon
            color={props.ticker.active ? 'green' : 'red'}
            name={props.ticker.active ? 'toggle on' : 'toggle off'}
          />
          {props.ticker.title}
          <Label
            content={props.ticker.id}
            size="mini"
            style={{ float: 'right' }}
          />
        </Card.Header>
        <Card.Meta>
          <a
            href={'https://' + props.ticker.domain}
            rel="noopener noreferrer"
            target="_blank"
          >
            {props.ticker.domain}
          </a>
        </Card.Meta>
        <Card.Description>
          <ReactMarkdown>{props.ticker.description}</ReactMarkdown>
        </Card.Description>
      </Card.Content>
      <Card.Content>
        <Button.Group compact size="tiny">
          <TickerModalForm
            ticker={props.ticker}
            trigger={
              <Button
                color="black"
                content="Configure"
                icon={
                  <Icon>
                    <FontAwesomeIcon icon={faGear} />
                  </Icon>
                }
              />
            }
          />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default TickerCard
