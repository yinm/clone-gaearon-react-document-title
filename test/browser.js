/*jshint newcap: false */
/*global global, describe, it, afterEach, before, after */
'use strict'

const expect = require('expect.js')
const jsdom = require('mocha-jsdom')
const React = require('react')
const ReactDOM = require('react-dom')
const createReactClass = require('create-react-class')
const DocumentTitle = require('../')

jsdom()

describe('DocumentTitle (in a browser)', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
  })

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container)
    delete global.document.title
  })

  before(() => {
    DocumentTitle.canUseDOM = true
  })

  it('changes the document title on mount', (done) => {
    const title = 'hello world'
    const Component = createReactClass({
      componentDidMount() {
        expect(global.document.title).to.equal(title)
        done()
      },
      render() {
        return React.createElement(DocumentTitle, {title: title})
      }
    })

    ReactDOM.render(React.createElement(Component), container)
  })

  it('supports nesting', (done) => {
    let called = false
    const title = 'hello world'
    const Component1 = createReactClass({
      componentDidMount() {
        setTimeout(() => {
          expect(called).to.be(true)
          expect(global.document.title).to.equal(title)
          done()
        })
      },
      render() {
        return React.createElement(DocumentTitle, {title: title})
      }
    })

    const Component2 = createReactClass({
      componentDidMount() {
        called = true
      },
      render() {
        return React.createElement(DocumentTitle, {title: 'nope'},
          React.DOM.div(null, React.createElement(Component1))
        )
      }
    })

    ReactDOM.render(React.createElement(Component2), container)
  })

})
