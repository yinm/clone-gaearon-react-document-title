'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const withSideEffect = require('react-side-effect')

function reducePropsToState(propsList) {
  const innermostProps = propsList[propsList.length - 1]
  if (innermostProps) {
    return innermostProps.title
  }
}

function handleStateChangeOnClient(title) {
  const nextTitle = title || ''
  if (nextTitle !== document.title) {
    document.title = nextTitle
  }
}

function DocumentTitle() {}
DocumentTitle.prototype = Object.create(React.Component.prototype)

DocumentTitle.displayName = 'DocumentTitle'
DocumentTitle.propTypes = {
  title: PropTypes.string.isRequired
}

DocumentTitle.prototype.render = function() {
  if (this.props.children) {
    return React.Children.only(this.props.children)
  } else {
    return null
  }
}

module.exports = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(DocumentTitle)