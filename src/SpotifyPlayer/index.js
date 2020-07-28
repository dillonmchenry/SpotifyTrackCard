import React from 'react';
import axios from 'axios';
import './styles.scss';

class SpotifyPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const token = 'BQCQ-9HljRZ3WEbQNbcTm9jbLAXkyirAm9jPDgiMcqw6Dngr1TB7UMkPoRsA9CmQDBOKlZ0KIiDbyn5OQN-8OJ-Rrl_38E0H6IJQSbWh5maCQTkZxwllvt7yRUdMP8bhmXwyfBaV0kRww4KTOVzSwiL5WvsKPSmcGhO2TcM';
        const playerName = "Dillon's Playback"
        window.onSpotifyWebPlaybackSDKReady = () => {
            // eslint-disable-next-line no-undef
            const player = new Spotify.Player({
                name: playerName,
                getOAuthToken: cb => { cb(token); }
            });

            // Error handling
            player.addListener('initialization_error', ({ message }) => { console.error(message); });
            player.addListener('authentication_error', ({ message }) => { console.error(message); });
            player.addListener('account_error', ({ message }) => { console.error(message); });
            player.addListener('playback_error', ({ message }) => { console.error(message); });

            // Playback status updates
            player.addListener('player_state_changed', state => {
                this.setState({
                    id: state.track_window.current_track.id,
                    artist: state.track_window.current_track.artists[0].name,
                    song: state.track_window.current_track.name,
                    album: state.track_window.current_track.album.name,
                    cover: state.track_window.current_track.album.images[2].url
                });

                axios.get(`https://api.spotify.com/v1/audio-features?ids=${this.state.id}`, {
                        headers: {'Authorization': `Bearer ${token}` }
                    }
                ).then(response => {
                        this.setState({ features: response.data.audio_features[0] });
                    })
                    .catch(error => {
                        console.log(error);
                    });

                axios.get(`https://api.spotify.com/v1/tracks/${this.state.id}`, {
                    headers: {'Authorization': `Bearer ${token}`}
                }).then(response => {
                    this.setState( {
                        popularity: response.data.popularity,
                        explicit: response.data.explicit,
                    })
                })

                console.log(this.state);


            });


            // Ready
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready to Connect to:', playerName);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log(`${playerName} has gone offline`);
            });

            // Connect to the player!
            player.connect();
        };

    }

    render() {
        return (
          <div className="player">
              <img src={this.state.cover} />
              <h2>{this.state.song}</h2>
              <h3>{this.state.artist}</h3>
          </div>
        );
    }


}

export default SpotifyPlayer;