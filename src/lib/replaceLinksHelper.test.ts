import { replaceMagic } from './replaceLinksHelper'

describe('helper', function () {
  test('replace links', function () {
    const text = 'https://www.systemli.org'

    expect(replaceMagic(text)).toBe('<a href="https://www.systemli.org" target="_blank" rel="noopener noreferrer">www.systemli.org</a>')
  })

  test('replace twitter hashtag', function () {
    const text = '#hashtag'

    expect(replaceMagic(text)).toBe('<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/search?q=%23hashtag">#hashtag</a>')
  })

  test('replace twitter user handle', function () {
    const text = '/cc @systemli'

    expect(replaceMagic(text)).toBe('/cc <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/systemli">@systemli</a>')
  })

  test('replace email address', function () {
    const text = 'sent mail to admin@systemli.org'

    expect(replaceMagic(text)).toBe('sent mail to <a href="mailto:admin@systemli.org">admin@systemli.org</a>')
  })

  test('replace newline with <br/> tag', function () {
    const text = 'newline\nnewtext\r\n'

    expect(replaceMagic(text)).toBe('newline<br/>newtext<br/>')
  })
})
