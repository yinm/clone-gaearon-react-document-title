/*jshing newcap: false */
/*global describe, it, before */
'use strict'

const expect = require('expect.js')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const createReactClass = require('create-react-class')
const DocumentTitle = require('../')

describe('DocumentTitle', () => {
  before(() => {
    DocumentTitle.canUseDOM = false
  })

  it('has a displayName', () => {
    const el = React.createElement(DocumentTitle)
    expect(el.type.displayName).to.be.a('string')
    expect(el.type.displayName).not.to.be.empty()
    expect(el.type.displayName).to.equal('SideEffect(DocumentTitle)')
  })

  it('hides itself from the DOM', () => {
    const Component = createReactClass({
      render() {
        return React.createElement(DocumentTitle, {title: 'irrelevant'},
          React.createElement('div', null, 'hello')
        )
      }
    })

    const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Component))
    expect(markup).to.equal('<div>hello</div>')
  })

  it('throws an error if it has multiple children', (done) => {
    const Component = createReactClass({
      render() {
        return React.createElement(DocumentTitle, {title: 'irrelevant'},
          React.createElement('div', null, 'hello'),
          React.createElement('div', null, 'world')
        )
      }
    })

    expect(() => {
      ReactDOMServer.renderToStaticMarkup(React.createElement(Component))
    }).to.throwException((e) => {
      expect(e.message).to.match(/React.Children.only expected/)
      done()
    })
  })

  it('works with complex children', () => {
    const Component1 = createReactClass({
      render() {
        return React.createElement('p', null,
          React.createElement('span', null, 'c'),
          React.createElement('span', null, 'd')
        )
      }
    })

    const Component2 = createReactClass({
      render() {
        return React.createElement(DocumentTitle, {title: 'irrelevant'},
          React.createElement('div', null,
            React.createElement('div', null, 'a'),
            React.createElement('div', null, 'b'),
            React.createElement('div', null, React.createElement(Component1))
          )
        )
      }
    })

    const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Component2))
    expect(markup).to.equal(
      '<div>' +
        '<div>a</div>' +
        '<div>b</div>' +
        '<div>' +
          '<p>' +
            '<span>c</span>' +
            '<span>d</span>' +
          '</p>' +
        '</div>' +
      '</div>'
    )
  })
})

describe('DocumentTitle.rewind', () => {
  it('clears the mounted instances', () => {
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(DocumentTitle, {title: 'a'},
        React.createElement(DocumentTitle, {title: 'b'}, React.createElement(DocumentTitle, {title: 'c'}))
      )
    )

    expect(DocumentTitle.peek()).to.equal('c')
    DocumentTitle.rewind()
    expect(DocumentTitle.peek()).to.equal(undefined)
  })

  it('returns the latest document title', () => {
    const title = 'cheese'
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(DocumentTitle, {title: 'a'},
        React.createElement(DocumentTitle, {title: 'b'}, React.createElement(DocumentTitle, {title: title}))
      )
    )

    expect(DocumentTitle.rewind()).to.equal(title)
  })

  it('returns undefined if no mounted instances exist', () => {
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(DocumentTitle, {title: 'a'},
        React.createElement(DocumentTitle, {title: 'b'}, React.createElement(DocumentTitle, {title: 'c'}))
      )
    )

    DocumentTitle.rewind()
    expect(DocumentTitle.peek()).to.equal(undefined)
  })
})