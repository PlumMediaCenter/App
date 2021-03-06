import { Component, Input } from '@angular/core';
import { Movie } from '../../interfaces/movie';

@Component({
    selector: 'movie-card',
    templateUrl: 'movie-card.html',
    styleUrls: ['movie-card.scss']
})
export class MovieCardComponent {

    constructor() {
        //during development, use an epoch time on querystring
        this.epoch = new Date().getTime();
    }

    @Input('movie')
    public movie: Movie;

    public epoch: number;

}
