import React, {useEffect, useState} from "react";
import axios from "axios";
import './styles.scss';

const CriticalRating = (props) => {
    const artist = props.artist
    const album = props.album
    let numScores = 0;
    const [pitchScore, setPitchScore] = useState(0);
    const [metaCriticScore, setMetaCriticScore] = useState(0);

    const queryArtist = artist.split(' ').join('-').toLowerCase();
    const queryAlbum = album.split(' ').join('-').toLowerCase();

    //Pitchfork Query
    axios.get(`https://pitchfork.com/reviews/albums/${queryArtist}-${queryAlbum}/`, {
        withCredentials: false,
        SameSite: 'Strict',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
    })
        .then(response => {
            const pageHolder = document.createElement('div');
            pageHolder.innerHTML = response.data;
            setPitchScore(Number(pageHolder.getElementsByClassName("score")[0].textContent)*10);
        })
        .catch((error) => {
            console.log("MetaCritic Query:", error);
        })

    //Metacritic Query
    axios.get(`https://www.metacritic.com/music/${queryAlbum}/${queryArtist}`, {
        withCredentials: false,
        SameSite: 'Strict',
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        },
    })
        .then(response => {
            const pageHolder = document.createElement('div');
            pageHolder.innerHTML = response.data;
            setMetaCriticScore(Number(pageHolder.querySelectorAll(".highlight_metascore a div span")[0].innerHTML));
        })
        .catch((error) => {
            console.log("MetaCritic Query:", error);
        })

    if (pitchScore > 0){
        numScores += 1;
    }
    if (metaCriticScore > 0) {
        numScores += 1;
    }

    return (
        <div>
            {numScores > 0 && artist ?
                Math.round((pitchScore + metaCriticScore) / numScores):
                "N/A"
            }
        </div>
    );

}

export default CriticalRating;