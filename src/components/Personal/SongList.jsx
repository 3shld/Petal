import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Item, Header, Button, Icon, Confirm } from 'semantic-ui-react'
import { songListIndexSet } from '../../actions/fm/actions'
import { removeTrashSong, trashListGET, playLog } from '../../actions/fm/apis'
import { rendererProcessSend } from '../../helper/electron'

const typeRender = {
  'recent': '最近收听',
  'redheart': '红心',
  'trash': '垃圾桶'
}

const tipRender = {
  'recent': '你还没有收听过歌曲。',
  'redheart': '这里没有你喜欢的歌曲。',
  'trash': '这里没有你不喜欢的歌曲。'
}

class SongList extends Component {
  state = {
    open: false,
    sid: undefined
  }

  show = sid => this.setState({ open: true, sid })
  handleConfirm = () => {
    this.setState({ open: false })
    this.props.handleRemoveTrashSong(this.state.sid)
    this.props.handleTrashListGET()
  }
  handleCancel = () => this.setState({ open: false })

  handleSongListIndexSetWrapper = (index, pattern) => {
    return () => {
      const { songListIndex, handlePlayLog, recentSong, redheartSong } = this.props
      if (index !== songListIndex || pattern !== this.props.pattern) {
        if (this.props.pattern === 'recent') {
          handlePlayLog(recentSong[songListIndex].sid, 's', 'y')
        }
        if (this.props.pattern === 'redheart') {
          handlePlayLog(redheartSong[songListIndex].sid, 's', 'h')
        }
      }

      this.props.handleSongListIndexSet(index, pattern)
      rendererProcessSend('touchBarResetPause')
      rendererProcessSend('patternSwitch', pattern)
      this.props.history.push('/')
    }
  }

  render() {
    const { songArray, type } = this.props
    const title = typeRender[type]

    return (
      <article className="petal-personal-songlist">
        <Header as="h2">{title}</Header>
        {songArray.length === 0 ?
          <p>{tipRender[type]}</p>
          : < Item.Group divided unstackable>
            {songArray.map((song, index) => {
              return <Item key={index}>
                <Item.Image size='tiny' src={song.picture} />
                <Item.Content>
                  <Item.Header>{song.title}</Item.Header>
                  <Item.Meta>{song.artist}</Item.Meta>
                  <Item.Description>{`${song.albumtitle} - ${song.public_time}`}</Item.Description>
                  <Item.Extra>
                    {(type === 'redheart' || type === 'recent') && <Button size='mini' basic icon onClick={this.handleSongListIndexSetWrapper(index, type)}><Icon name='play' /></Button>}
                    {type === 'trash' && <Button size='mini' basic icon onClick={() => this.show(songArray[index].sid)}><Icon name='trash' /></Button>}
                  </Item.Extra>
                </Item.Content>
              </Item>
            })}
          </Item.Group>}
        <Confirm
          open={this.state.open}
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          content='确认从垃圾桶移除此歌曲？'
          cancelButton={<Button negative>取消</Button>}
          confirmButton={<Button positive>确认</Button>}
          size='mini'
        />
      </article>
    )
  }
}

SongList.propTypes = {
  songArray: PropTypes.array.isRequired,
  songListIndex: PropTypes.number.isRequired,
  pattern: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  handleSongListIndexSet: PropTypes.func,
  handleRemoveTrashSong: PropTypes.func,
  handleTrashListGET: PropTypes.func,
  recentSong: PropTypes.array,
  redheartSong: PropTypes.array,
  handlePlayLog: PropTypes.func
}

const mapStateToProps = state => {
  return {
    pattern: state.fmReducer.pattern,
    recentSong: state.fmReducer.recent.songs,
    redheartSong: state.fmReducer.redheart,
    songListIndex: state.fmReducer.songListIndex
  }
}

const mapDispatchToProps = dispatch => {
  return {
    handleSongListIndexSet: (index, pattern) => dispatch(songListIndexSet(index, pattern)),
    handleRemoveTrashSong: sid => dispatch(removeTrashSong(sid)),
    handleTrashListGET: () => dispatch(trashListGET()),
    handlePlayLog: (sid, type, play_source) => dispatch(playLog(sid, type, play_source))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SongList))
