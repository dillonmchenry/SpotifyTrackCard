import React from 'react';
import axios from 'axios';
import CriticalRating from "../Critical Rating";
import LandingScreen from "../LandingScreen";
import './styles.scss';

class SpotifyPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            song: '',
            artist: '',
            cover: '',
            album: '',
            features: {},
            popularity: '',
            explicit: '',
            releaseDate: '',
        };
    }

    componentDidMount() {
        this.callBackendAPI()
            .then(res => console.log(res))
            .catch(error => console.log(error));

        const token = 'BQCjxUUQllV4cQNeB71eWKcCs0l98sRHnRF0iPXsZVRyu0TvYK-YqdxrXb7hfaic4XxwvY33HheTzp3PP06JHeQEPMrNi5uG1QyazBDDerwNzQvmliXqmWnu3x9J7N60jZ2W8hI1jW_Gk42F7xidCOAvH6DcVS32aVp3e04';
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
                console.log(state);
                if (state) {
                    this.setState({
                        id: state.track_window.current_track.id,
                        artist: state.track_window.current_track.artists[0],
                        song: state.track_window.current_track.name,
                        album: state.track_window.current_track.album.name,
                        cover: state.track_window.current_track.album.images[2].url
                    });

                    axios.get(`https://api.spotify.com/v1/audio-features/${this.state.id}`, {
                        headers: {'Authorization': `Bearer ${token}`}
                    })
                        .then(response => {
                            console.log(response);
                            this.setState({ features: response.data });
                        })
                        .catch((error) => {
                        });

                    axios.get(`https://api.spotify.com/v1/tracks/${this.state.id}`, {
                        headers: {'Authorization': `Bearer ${token}`}
                    })
                        .then(response => {
                            this.setState( {
                                popularity: response.data.popularity,
                                explicit: response.data.explicit,
                                releaseDate: response.data.album.release_date,
                            })
                        })
                        .catch((error) => {
                            console.log("Track Query:", error.response.status);
                        })
                    console.log(this.state);
                } else {
                    this.setState({
                        song: '',
                        artist: '',
                        cover: '',
                        album: ''
                    });
                }
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

    callBackendAPI = async () => {
        const response = await fetch('/login', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            redirect: 'follow'
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    render() {
        return (
            (this.state.features.acousticness !== undefined) ?
                <div className="player">
                    <img src={this.state.cover} />
                    <h2>{this.state.song}</h2>
                    <h3>{this.state.artist.name}</h3>
                    <h4>{Math.round(this.state.features.danceability*100)}</h4>
                    <CriticalRating artist={this.state.artist.name} album={this.state.album} />
                </div> :
                <LandingScreen />


        );
    }


}

export default SpotifyPlayer;