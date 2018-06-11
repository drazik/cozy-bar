import React, { Component } from 'react'
import { connect } from 'react-redux'
import Hammer from 'hammerjs'
import Spinner from 'cozy-ui/react/Spinner'

import { fetchApps, isAppListFetching } from '../lib/reducers'

import AppsList from './AppsList'
import Settings from './Settings'

class Drawer extends Component {
  constructor (props, context) {
    super(props)
    this.store = context.barStore
    this.state = {
      isScrolling: false
    }
  }

  onDrawerClick = event => {
    if (event.target === this.wrapperRef) {
      this.props.onClose()
    }
  }

  onTransitionEnd = event => {
    if (this.props.visible) {
      this.attachGestures()
      this.preventBackgroundScrolling()
    } else {
      this.detachGestures()
      this.restoreBackgroundScrolling()
    }
    this.props.drawerListener()
  }

  async componentWillMount () {
    await this.props.fetchAppsList()
    await this.store.fetchSettingsData()
  }

  componentDidMount () {
    this.turnTransitionsOn()
    this.asideRef.addEventListener('transitionend', this.onTransitionEnd)
  }

  async componentWillReceiveProps (nextProps) {
    if (!this.props.visible && nextProps.visible) {
      await this.props.fetchAppsList()
      await this.store.fetchSettingsData()
    }
  }

  turnTransitionsOn () {
    this.asideRef.classList.add('with-transition')
  }

  turnTransitionsOff () {
    this.asideRef.classList.remove('with-transition')
  }

  preventBackgroundScrolling () {
    document.body.style.overflow = 'hidden'
  }

  restoreBackgroundScrolling () {
    document.body.style.overflow = 'auto'
  }

  detachGestures () {
    this.gesturesHandler.destroy()
  }

  attachGestures () {
    // IMPORTANT: on Chrome, the `overflow-y: scroll` property on .coz-drawer--apps prevented
    // swipe events to be dispatched correctly ; the `touch-action: pan-y` fixes the problem
    // see drawer.css
    this.gesturesHandler = new Hammer.Manager(document.body, {
      // we listen in all directions so that we can catch panup/pandown events and let the user scroll
      recognizers: [[Hammer.Pan, { direction: Hammer.DIRECTION_ALL }]]
    })

    // to be completely accurate, `maximumGestureDelta` should be the difference between the right of the aside and the
    // left of the page; but using the width is much easier to compute and accurate enough.
    const maximumGestureDistance = this.asideRef.getBoundingClientRect().width
    // between 0 and 1, how far down the gesture must be to be considered complete upon release
    const minimumCloseDistance = 0.6
    // a gesture faster than this will dismiss the menu, regardless of distance traveled
    const minimumCloseVelocity = 0.6

    let currentGestureProgress = null

    this.gesturesHandler.on('panstart', event => {
      if (event.additionalEvent === 'panup' || event.additionalEvent === 'pandown') {
        this.setState({ isScrolling: true })
      } else {
        this.turnTransitionsOff()
        currentGestureProgress = 0
      }
    })

    this.gesturesHandler.on('pan', e => {
      if (this.state.isScrolling) return
      currentGestureProgress = -e.deltaX / maximumGestureDistance
      this.applyTransformation(currentGestureProgress)
    })

    this.gesturesHandler.on('panend', e => {
      if (this.state.isScrolling) {
        this.setState({isScrolling: false})
        return
      }
      // Dismiss the menu if the swipe pan was bigger than the treshold,
      // or if it was a fast, downward gesture
      let shouldDismiss =
        -e.deltaX / maximumGestureDistance >= minimumCloseDistance ||
        (-e.deltaX > 0 && e.velocity >= minimumCloseVelocity)

      if (shouldDismiss) {
        this.turnTransitionsOn()
        this.props.onClose()
        this.asideRef.style.transform = ''
      } else {
        this.turnTransitionsOn()
        this.applyTransformation(0)
      }
    })
  }

  applyTransformation (progress) {
    // constrain between 0 and 1.1 (go a bit further than 1 to be hidden completely)
    progress = Math.min(1.1, Math.max(0, progress))
    this.asideRef.style.transform = 'scaleX(' + (1 - progress) + ')'
  }

  render () {
    const { onClaudy, visible, isClaudyLoading, toggleSupport, renewToken, onLogOut, toggleComingSoon, isAppListFetching } = this.props
    const { settingsData } = this.store
    return (
      <div className='coz-drawer-wrapper'
        onClick={this.onDrawerClick}
        aria-hidden={visible ? 'false' : 'true'}
        ref={(node) => { this.wrapperRef = node }}
      >
        <aside ref={(node) => { this.asideRef = node }}>
          <nav className='coz-drawer--apps'>
            {isAppListFetching
              ? (
                <Spinner size='xlarge' middle />
              )
              : (
                <AppsList
                  wrappingLimit={3}
                  renewToken={renewToken}
                  toggleComingSoon={toggleComingSoon}
                />
              )
            }
          </nav>
          <hr className='coz-sep-flex' />
          <nav className='coz-drawer--settings'>
            {settingsData &&
              <Settings
                onLogOut={() => {
                  if (onLogOut && typeof onLogOut === 'function') {
                    onLogOut()
                  } else {
                    this.store.logout()
                  }
                }}
                settingsData={settingsData}
                isClaudyLoading={isClaudyLoading}
                onClaudy={onClaudy}
                toggleSupport={toggleSupport}
                isDrawer
              />
            }
          </nav>
        </aside>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isAppListFetching: isAppListFetching(state)
})

const mapDispatchToProps = dispatch => ({
  fetchAppsList: () => dispatch(fetchApps())
})

export default connect(mapStateToProps, mapDispatchToProps)(Drawer)
