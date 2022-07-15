import React, {
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { Search, SearchProps } from 'semantic-ui-react'

interface SearchResult {
  place_id: number
  lat: number
  lon: number
  display_name: string
}

export interface Result {
  title: string
  lat: number
  lon: number
}

interface State {
  loading: boolean
  results: Result[]
  value: string
}

const initialState: State = {
  loading: false,
  results: [],
  value: '',
}

enum SearchActionType {
  CLEAN_QUERY = 'CLEAN_QUERY',
  START_SEARCH = 'START_SEARCH',
  FINISH_SEARCH = 'FINISH_SEARCH',
  UPDATE_SELECTION = 'UPDATE_SELECTION',
}

interface SearchAction {
  type: SearchActionType
  query?: string
  results?: Result[]
  selection?: string
}

async function api(value: string): Promise<SearchResult[]> {
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + value

  const timeout = (time: number) => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), time * 1000)
    return controller
  }

  return fetch(url, { signal: timeout(30).signal }).then(res => res.json())
}

function searchReducer(state: any, action: SearchAction) {
  switch (action.type) {
    case SearchActionType.CLEAN_QUERY:
      return initialState
    case SearchActionType.START_SEARCH:
      return { ...state, loading: true, value: action.query, results: [] }
    case SearchActionType.FINISH_SEARCH:
      return { ...state, loading: false, results: action.results }
    case SearchActionType.UPDATE_SELECTION:
      return { ...state, value: action.selection }

    default:
      throw new Error()
  }
}

interface Props {
  callback: (result: Result) => void
}

const LocationSearch: FC<Props> = props => {
  const [state, dispatch] = useReducer(searchReducer, initialState)
  const { loading, results, value } = state
  const timeoutRef: { current: NodeJS.Timeout | null } = useRef(null)

  const handleResultSelect = useCallback(
    (event: MouseEvent, data: any) => {
      dispatch({
        type: SearchActionType.UPDATE_SELECTION,
        selection: data.result.title,
      })

      props.callback(data.result)
    },
    [props]
  )

  const handleSearchChange = useCallback(
    (event: MouseEvent, data: SearchProps) => {
      const value = data.value
      if (value === undefined) {
        return
      }

      clearTimeout(timeoutRef.current as NodeJS.Timeout)
      dispatch({ type: SearchActionType.START_SEARCH, query: value })

      timeoutRef.current = setTimeout(() => {
        if (value.length === 0) {
          dispatch({ type: SearchActionType.CLEAN_QUERY })
          return
        }

        const results: Result[] = []
        api(value)
          .then(data => {
            data.forEach(entry => {
              results.push({
                title: entry.display_name,
                lat: entry.lat,
                lon: entry.lon,
              })
            })
          })
          .finally(() => {
            dispatch({
              type: SearchActionType.FINISH_SEARCH,
              results: results,
            })
          })
      }, 300)
    },
    []
  )

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current as NodeJS.Timeout)
    }
  }, [])

  return (
    <React.Fragment>
      <Search
        loading={loading}
        onResultSelect={handleResultSelect}
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
      />
    </React.Fragment>
  )
}

export default LocationSearch
